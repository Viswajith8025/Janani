import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 bookings per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded on /booking', { ip: req.ip });
    res.status(429).json({ success: false, message: 'Too many booking requests from this IP. Please try again after 15 minutes.' });
  }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Global rate limit exceeded', { ip: req.ip });
    res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
  }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', { ip: req.ip });
    res.status(429).json({ success: false, message: 'Too many login attempts. Please try again after an hour.' });
  }
});
