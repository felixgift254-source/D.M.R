const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/community/posts
 * Returns community posts. Requires authentication (authMiddleware in app.js).
 * Author email is intentionally NOT exposed — only role is returned.
 */
const getPosts = async (req, res) => {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        author: {
          select: { role: true } // Email omitted — it is PHI and must not be publicly accessible
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    // authorId comes from the verified JWT via authMiddleware — never trust the body
    const authorId = req.user.userId;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newPost = await prisma.communityPost.create({
      data: { title, content, authorId },
      include: {
        author: { select: { role: true } } // Email omitted here too
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

module.exports = { getPosts, createPost };
