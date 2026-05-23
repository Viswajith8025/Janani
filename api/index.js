import express from 'express';
import multer from 'multer';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── SUPABASE CONFIG ────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ WARNING: Supabase credentials missing from environment variables.');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder_key'
);

// ─── RAZORPAY CONFIG ────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sc6HDIM8vi6dTH',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'aEPJFMYYrPgxJkLLdIZWqMd1',
});

// ─── CORS ───────────────────────────────────────────────────────────────────
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

app.use(express.json());

// ─── UPLOADS CONFIG ─────────────────────────────────────────────────────────
// Using memory storage for Vercel serverless compatibility
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// Admin Login
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({ 
      success: true, 
      data: { 
        token: data.session.access_token, 
        user: data.user 
      } 
    });
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// 1. Create Booking
app.post('/api/v1/booking', async (req, res) => {
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
      source: bookingData.source || 'website',
      status: 'pending_payment',
    };

    const { error } = await supabase
      .from('bookings')
      .insert([newBooking]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      throw error;
    }

    console.log(`📝 New Booking Created: ${bookingRef}`);
    res.status(201).json({ success: true, data: { bookingRef, id: bookingId } });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
});

// 2. Create Razorpay Order
app.post('/api/v1/payment/order', async (req, res) => {
  try {
    const { bookingRef } = req.body;
    
    // Fetch booking from Supabase
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('bookingRef', bookingRef)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Amount logic (re-calculate on server for security)
    const packages = {
      'serenity': 899,
      'harmony': 1399,
      'transformation': 1899
    };
    
    const amountInUsd = (packages[booking.packageId] || 1399) * (booking.totalGuests?.adults || 1);
    const amountInPaise = amountInUsd * 83 * 100; // Using 83 INR conversion for demo

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingRef,
    };

    const order = await razorpay.orders.create(options);

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
    console.error('Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// 3. Verify Payment
app.post('/api/v1/payment/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'aEPJFMYYrPgxJkLLdIZWqMd1')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      // Update booking status in Supabase
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('razorpayOrderId', razorpayOrderId)
        .single();
        
      if (fetchError || !booking) {
        return res.status(404).json({ success: false, message: 'Booking not found for verification' });
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          paymentId: razorpayPaymentId 
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// 4. Upload ID
app.post('/api/v1/upload-id', upload.single('idProof'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  
  // Note: For Vercel Serverless, memoryStorage is used.
  // In a full implementation, you would upload req.file.buffer to Supabase Storage or Cloudinary here.
  // For now, we return a mock success response since the frontend logic doesn't strictly depend on this yet.
  
  res.status(200).json({ 
    success: true, 
    filename: `id-proof-${Date.now()}-${req.file.originalname}`,
    message: 'File processed in memory (upload logic to bucket required for persistence)'
  });
});

// ─── GET BOOKINGS (Admin) ────────────────────────────────────────────────────
app.get('/api/v1/bookings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// ─── 404 Handler for undefined routes ──────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ─── Error handler ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Run server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌿 Janani Backend running at http://localhost:${PORT}`);
    console.log(`🚀 API Base: http://localhost:${PORT}/api/v1`);
  });
}

// Export the app for Vercel Serverless Functions
export default app;
