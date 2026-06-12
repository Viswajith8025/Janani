import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

import { logger } from './utils/logger.js';
import { validateEnv } from './utils/envValidate.js';
import { apiLimiter, bookingLimiter, authLimiter } from './middleware/rateLimiter.js';
import { verifyAdmin } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { bookingSchema, paymentOrderSchema, paymentVerifySchema, validate } from './validations/schemas.js';

// Validate environment variables on startup
validateEnv();

const app = express();

// ─── SENTRY INITIALIZATION (Mocked for Vercel Serverless) ───────────────────
// In production, uncomment and add your Sentry DSN to .env
/*
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0, 
    profilesSampleRate: 1.0,
  });
}
*/

// ─── SUPABASE CONFIG ────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── RAZORPAY CONFIG ────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sc6HDIM8vi6dTH',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'aEPJFMYYrPgxJkLLdIZWqMd1',
});

// ─── SECURITY MIDDLEWARE ────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '1mb' })); // Prevent JSON payload bloat attacks

const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'https://jananilifestyle.in'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(apiLimiter);

// ─── UPLOADS CONFIG ─────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.'), false);
    }
  }
});

// ─── HEALTH CHECK (Uptime Monitoring) ────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// Admin Login
app.post('/api/v1/auth/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid credentials');

    logger.info('Admin logged in successfully', { email });
    res.json({ success: true, data: { token: data.session.access_token, user: data.user } });
  } catch (error) {
    logger.warn('Failed login attempt', { email: req.body?.email });
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// 1. Create Booking
app.post('/api/v1/booking', bookingLimiter, validate(bookingSchema), async (req, res, next) => {
  try {
    const bookingData = req.body;
    const bookingRef = `JAN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const bookingId = crypto.randomUUID();
    
    const newBooking = {
      id: bookingId,
      bookingRef,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email,
      phone: bookingData.phone,
      countryCode: bookingData.countryCode,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      packageId: bookingData.packageId,
      packageName: bookingData.packageName,
      totalGuests: bookingData.totalGuests,
      specialRequests: bookingData.specialRequests,
      source: bookingData.source,
      status: 'pending_payment',
    };

    const { error } = await supabase.from('bookings').insert([newBooking]);
    if (error) {
      logger.error('Database Insert Error', error);
      return res.status(500).json({ success: false, message: 'Failed to create booking in database' });
    }

    logger.info(`New Booking Created: ${bookingRef}`);
    res.status(201).json({ success: true, data: { bookingRef, id: bookingId } });
  } catch (error) {
    next(error);
  }
});

// 2. Create Razorpay Order
app.post('/api/v1/payment/order', validate(paymentOrderSchema), async (req, res, next) => {
  try {
    const { bookingRef } = req.body;
    
    // Fetch booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('bookingRef', bookingRef)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Amount logic (calculated securely on server)
    const packages = {
      'serenity': 899,
      'harmony': 1399,
      'transformation': 1899
    };
    
    const basePrice = packages[booking.packageId];
    if (!basePrice) {
      logger.error('Invalid package ID found in DB', { packageId: booking.packageId });
      return res.status(400).json({ success: false, message: 'Invalid package associated with booking' });
    }

    const adults = booking.totalGuests?.adults || 1;
    const amountInUsd = basePrice * adults;
    // Real prod should use live exchange rates, keeping static 83 for demo purposes
    const amountInPaise = amountInUsd * 83 * 100; 

    // Create order with Razorpay
    // Added receipt as bookingRef for idempotency tracking on Razorpay
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingRef,
    });

    // Update booking with razorpay order ID
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ razorpayOrderId: order.id })
      .eq('id', booking.id);

    if (updateError) throw updateError;

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sc6HDIM8vi6dTH',
        bookingRef,
        prefill: {
          name: `${booking.firstName} ${booking.lastName}`,
          email: booking.email,
          contact: booking.phone,
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// 3. Verify Payment
app.post('/api/v1/payment/verify', validate(paymentVerifySchema), async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'aEPJFMYYrPgxJkLLdIZWqMd1')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      logger.warn('Invalid Razorpay signature detected', { razorpayOrderId });
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update booking status in Supabase
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('razorpayOrderId', razorpayOrderId)
      .single();
      
    if (fetchError || !booking) {
      logger.error('Verified payment for unknown order ID', { razorpayOrderId });
      return res.status(404).json({ success: false, message: 'Booking not found for verification' });
    }

    if (booking.status === 'confirmed') {
      return res.status(200).json({ success: true, message: 'Payment already verified' }); // Idempotency
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed',
        paymentId: razorpayPaymentId 
      })
      .eq('id', booking.id);

    if (updateError) throw updateError;

    logger.info(`Payment verified and booking confirmed`, { bookingId: booking.id });
    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    next(error);
  }
});

// 4. Upload ID (Supabase Storage Implementation with Sharp Optimization)
app.post('/api/v1/upload-id', upload.single('idProof'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    let fileBuffer = req.file.buffer;
    let mimeType = req.file.mimetype;
    let fileName = `id-proof-${Date.now()}-${crypto.randomUUID()}`;

    // Optimize image if it's not a PDF
    if (mimeType.startsWith('image/')) {
      fileBuffer = await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      mimeType = 'image/webp';
      fileName += '.webp';
    } else {
      fileName += '.pdf';
    }
    
    const { data, error } = await supabase.storage
      .from('id-proofs')
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      logger.error('Supabase Storage Upload Error', error);
      return res.status(500).json({ success: false, message: 'Failed to upload document' });
    }

    const { data: publicUrlData } = supabase.storage.from('id-proofs').getPublicUrl(fileName);

    logger.info('ID proof uploaded successfully', { fileName });
    res.status(200).json({ 
      success: true, 
      url: publicUrlData.publicUrl,
      message: 'File uploaded securely'
    });
  } catch (error) {
    next(error);
  }
});

// 5. Razorpay Webhook Listener
app.post('/api/v1/webhooks/razorpay', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  // If webhook secret isn't configured, skip processing gracefully
  if (!webhookSecret) {
    logger.warn('Webhook secret not configured, skipping event processing');
    return res.status(200).send('OK');
  }

  const signature = req.headers['x-razorpay-signature'];
  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      logger.error('Invalid Webhook Signature');
      return res.status(400).send('Invalid Signature');
    }

    const event = req.body;
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      
      const { data: booking } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('razorpayOrderId', razorpayOrderId)
        .single();
        
      if (booking && booking.status !== 'confirmed') {
        await supabase
          .from('bookings')
          .update({ status: 'confirmed', paymentId: payment.id })
          .eq('id', booking.id);
        logger.info(`Webhook processed: Booking ${booking.id} confirmed async via webhook.`);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Webhook processing failed', error);
    res.status(500).send('Internal Server Error');
  }
});

// ─── GET BOOKINGS (Protected Admin Route with Pagination) ────────────────────
app.get('/api/v1/bookings', verifyAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Cap limit at 50
    const safeLimit = Math.min(limit, 100);
    const offset = (page - 1) * safeLimit;

    const { data, error, count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(offset, offset + safeLimit - 1);

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      metadata: {
        total: count,
        page,
        limit: safeLimit,
        totalPages: Math.ceil(count / safeLimit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// ─── CONTACT FORM & N8N WEBHOOK ──────────────────────────────────────────────
app.post('/api/v1/contact', async (req, res, next) => {
  try {
    const { name, email, phone, preferredDates, message, subject, source } = req.body;

    // Send data to the n8n webhook (configure URL in .env)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            preferredDates,
            message,
            subject,
            source,
            timestamp: new Date().toISOString()
          })
        });
        logger.info(`Contact form data sent to n8n webhook for ${email}`);
      } catch (n8nError) {
        logger.error('Failed to send data to n8n webhook', n8nError);
        // We do not fail the user's request if n8n is down, just log it.
      }
    } else {
      logger.warn('N8N_WEBHOOK_URL is not set in environment variables');
    }

    // You can also add code here to save the contact form to Supabase if needed
    // Example: await supabase.from('contacts').insert([{ name, email, phone, ... }]);

    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully.' 
    });
  } catch (error) {
    next(error);
  }
});

// ─── MOCK ENDPOINTS TO SILENCE 404 ERRORS ───────────────────────────────────
app.get('/api/v1/experiences', (req, res) => res.json({ success: true, data: [] }));
app.get('/api/v1/gallery', (req, res) => res.json({ success: true, data: [] }));
app.get('/api/v1/testimonials', (req, res) => res.json({ success: true, data: [] }));
app.get('/api/v1/team', (req, res) => res.json({ success: true, data: [] }));
app.get('/api/v1/blog', (req, res) => res.json({ success: true, data: [] }));

// ─── Error Handlers ──────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
