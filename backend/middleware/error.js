import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Exception Caught', err);

  const statusCode = err.status || 500;
  
  // Do not expose stack traces in production
  const errorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal Server Error' 
      : err.message || 'Internal Server Error',
  };

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req, res, next) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
};
