const prismaClient = require('../utils/prismaClient');
const { decrypt } = require('../utils/encryption');

const safeDecrypt = (val) => {
  if (!val) return val;
  try {
    if (typeof val === 'string' && val.includes(':')) return decrypt(val);
    return val;
  } catch {
    return val;
  }
};

const getStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { currentPhase: true, role: true, medications: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user status' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        currentPhase: true,
        medications: true,
        dietaryPreferences: true,
        targetWeight: true,
        userGardenCrops: { select: { gardenGuide: { select: { id: true, title: true } } } }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { medications, dietaryPreferences, targetWeight } = req.body;

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        ...(medications !== undefined && { medications }),
        ...(dietaryPreferences !== undefined && { dietaryPreferences }),
        ...(targetWeight !== undefined && { targetWeight: parseFloat(targetWeight) || null })
      },
      select: {
        id: true,
        email: true,
        role: true,
        currentPhase: true,
        medications: true,
        dietaryPreferences: true,
        targetWeight: true
      }
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

/**
 * GET /api/user/export
 * Streams all health logs for the authenticated user as a CSV download.
 * Glucose and weight are decrypted before export.
 * Patient data portability — allows users to download their own PHI.
 */
const exportData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await prismaClient.healthLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' }
    });

    const rows = logs.map(log => {
      const glucose = parseFloat(safeDecrypt(log.glucoseEncrypted)) || '';
      const weight = parseFloat(safeDecrypt(log.weightEncrypted)) || '';
      return `${log.loggedAt.toISOString()},${glucose},${weight}`;
    });

    const csv = ['Date,Fasting Glucose (mmol/L),Weight (kg)', ...rows].join('\n');

    res.setHeader('Content-Disposition', 'attachment; filename="dmr-health-export.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    console.error('exportData error:', error);
    res.status(500).json({ error: 'Failed to export health data' });
  }
};

module.exports = {
  getStatus,
  getProfile,
  updateProfile,
  exportData
};
