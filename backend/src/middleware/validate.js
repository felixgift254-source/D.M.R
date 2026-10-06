const { z } = require('zod');

/**
 * Generic validation middleware factory.
 * Accepts a Zod schema and validates req.body against it.
 * On success, req.body is replaced with the parsed (sanitized) data.
 * On failure, returns 400 with structured error details.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message
      }))
    });
  }
  req.body = result.data; // Use sanitized, coerced data
  next();
};

module.exports = validate;
