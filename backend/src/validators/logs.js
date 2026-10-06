const { z } = require('zod');

const submitLogSchema = z.object({
  glucose: z.coerce
    .number({ invalid_type_error: 'Glucose must be a number' })
    .min(1.0, 'Glucose must be at least 1.0 mmol/L')
    .max(35.0, 'Glucose must be at most 35.0 mmol/L'),
  weight: z.coerce
    .number({ invalid_type_error: 'Weight must be a number' })
    .min(20, 'Weight must be at least 20 kg')
    .max(500, 'Weight must be at most 500 kg'),
  meal: z.string().max(1000, 'Meal description must be 1000 characters or fewer').optional()
});

module.exports = { submitLogSchema };
