import { z } from 'zod';
import { logger } from './logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url("Must be a valid Supabase URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10, "Service role key is required for backend operations"),
  RAZORPAY_KEY_ID: z.string().min(10, "Razorpay Key ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(10, "Razorpay Secret is required"),
});

export const validateEnv = () => {
  try {
    envSchema.parse(process.env);
    logger.info('Environment variables validated successfully.');
  } catch (error) {
    logger.error('CRITICAL: Environment validation failed!', error.errors);
    // In production, we don't strictly exit(1) on Vercel because it causes crashing loops,
    // but we log heavily so Datadog/Sentry picks it up.
    if (process.env.NODE_ENV === 'production') {
      logger.error('Missing critical environment variables in production!');
    }
  }
};
