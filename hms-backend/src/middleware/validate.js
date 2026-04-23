const ApiError = require('../utils/ApiError');

/**
 * Middleware factory that validates req.body against a Zod schema.
 * Usage: validate(myZodSchema)
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      console.log('❌ Validation Failed:', JSON.stringify({ body: req.body, errors }, null, 2));
      return next(ApiError.badRequest('Validation failed', errors));
    }

    // Replace body with parsed (and potentially coerced/transformed) data
    req.body = result.data;
    next();
  };
};

module.exports = validate;
