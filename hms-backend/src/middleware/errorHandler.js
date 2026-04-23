const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Global error handling middleware.
 * Catches all errors thrown/passed via next(err) and sends a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    statusCode = 409;
    const field = err.detail?.match(/\((\w+)\)/)?.[1] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced record does not exist.';
  }

  // Log server errors
  if (statusCode >= 500) {
    console.error('💥 SERVER ERROR:', err);
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.isDevelopment && statusCode >= 500 && { stack: err.stack }),
  });
};

module.exports = errorHandler;
