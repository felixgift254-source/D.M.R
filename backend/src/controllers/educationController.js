const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getEducationalContent = async (req, res) => {
  try {
    const { lowDataMode } = req.query;
    let query = {};
    
    // Filter for low-data content if requested
    if (lowDataMode === 'true') {
      query.where = { isLowData: true };
    }

    const content = await prisma.educationalContent.findMany(query);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch educational content' });
  }
};

module.exports = { getEducationalContent };
