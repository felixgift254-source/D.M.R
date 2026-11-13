const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getGardenGuides = async (req, res) => {
  try {
    const guides = await prisma.gardenGuide.findMany();
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch garden guides' });
  }
};

const plantCrop = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to plant crops' });
    }
    const { gardenGuideId, plantingDate } = req.body;
    if (!gardenGuideId) {
      return res.status(400).json({ error: 'gardenGuideId is required' });
    }
    
    // Check if the guide exists
    const guide = await prisma.gardenGuide.findUnique({ where: { id: gardenGuideId } });
    if (!guide) return res.status(404).json({ error: 'Garden guide not found' });
    
    // Calculate expected harvest date
    let expectedHarvestDate = null;
    if (guide.timeToHarvest) {
      const daysMatch = guide.timeToHarvest.match(/(\d+)/);
      if (daysMatch) {
        const days = parseInt(daysMatch[1]);
        const date = new Date(plantingDate || new Date());
        date.setDate(date.getDate() + days);
        expectedHarvestDate = date;
      }
    }

    const crop = await prisma.userGardenCrop.create({
      data: {
        userId,
        gardenGuideId,
        plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
        expectedHarvestDate
      },
      include: {
        gardenGuide: true
      }
    });
    res.json(crop);
  } catch (error) {
    console.error('Failed to plant crop:', error);
    res.status(500).json({ error: 'Failed to plant crop' });
  }
};

const getMyCrops = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      // Unauthenticated or guest preview returns empty array
      return res.json([]);
    }
    const crops = await prisma.userGardenCrop.findMany({
      where: { userId },
      include: { gardenGuide: true },
      orderBy: { plantingDate: 'desc' }
    });
    res.json(crops);
  } catch (error) {
    console.error('Failed to fetch my crops:', error);
    res.status(500).json({ error: 'Failed to fetch my crops' });
  }
};

module.exports = { getGardenGuides, plantCrop, getMyCrops };
