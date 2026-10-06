const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be 200 characters or fewer'),
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be 5000 characters or fewer')
});

module.exports = { createPostSchema };
