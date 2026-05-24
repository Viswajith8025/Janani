import { z } from 'zod';

export const bookingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50).trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50).trim(),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  phone: z.string().min(8).max(20).trim(),
  countryCode: z.string().max(10).optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  packageId: z.enum(['serenity', 'harmony', 'transformation']).optional().default('harmony'),
  packageName: z.string().max(100).optional(),
  totalGuests: z.object({ 
    adults: z.number().int().min(1).max(10) 
  }),
  specialRequests: z.string().max(1000).optional(),
  source: z.string().max(50).optional().default('website'),
});

export const paymentOrderSchema = z.object({
  bookingRef: z.string().min(5).max(50).trim()
});

export const paymentVerifySchema = z.object({
  razorpayOrderId: z.string().min(5).max(100).trim(),
  razorpayPaymentId: z.string().min(5).max(100).trim(),
  razorpaySignature: z.string().min(10).max(200).trim(),
});

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};
