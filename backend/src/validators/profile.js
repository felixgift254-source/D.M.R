const { z } = require('zod');

const updateProfileSchema = z.object({
  medications: z.string().max(500, 'Medications field must be 500 characters or fewer').optional(),
  dietaryPreferences: z.string().max(500, 'Dietary preferences must be 500 characters or fewer').optional(),
  targetWeight: z.coerce
    .number()
    .min(30, 'Target weight must be at least 30 kg')
    .max(300, 'Target weight must be at most 300 kg')
    .optional()
    .nullable()
});

module.exports = { updateProfileSchema };
