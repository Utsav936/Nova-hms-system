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
      const fieldNames = errors.map(e => e.field).join(', ');
      const detailedMessage = `Validation failed for: ${fieldNames}`;
      console.error(`❌ ${detailedMessage}`, JSON.stringify({ body: req.body, errors }, null, 2));
      return next(ApiError.badRequest(detailedMessage, errors));
    }

    // Replace body with parsed (and potentially coerced/transformed) data
    req.body = result.data;
    next();
  };
};

module.exports = validate;
