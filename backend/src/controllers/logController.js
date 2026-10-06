const prismaClient = require('../utils/prismaClient');
const { analyzeMetabolicProgress } = require('../services/reversalEngine');
const { encrypt, decrypt } = require('../utils/encryption');
const { createHypoAlert, createPhasePendingAlert } = require('../services/alertService');

const safeDecrypt = (val) => {
  if (!val) return val;
  try {
    if (typeof val === 'string' && val.includes(':')) {
      return decrypt(val);
    }
    return val;
  } catch (err) {
    console.warn('Failed to decrypt log value, using raw string:', err.message);
    return val;
  }
};

const submitLog = async (req, res) => {
  try {
    const { glucose, weight, meal, proportions } = req.body;
    const userId = req.user.userId;

    if (!glucose || !weight) {
      return res.status(400).json({ error: 'Glucose and weight are required' });
    }

    let finalMeal = meal || '';
    if (finalMeal && proportions) {
      finalMeal += ` (Portion: ${proportions})`;
    } else if (proportions) {
      finalMeal = `(Portion: ${proportions})`;
    }

    // 1. Fetch current user
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Save Health and Dietary Logs with AES-256 Encryption
    await prismaClient.healthLog.create({
      data: {
        userId,
        weightEncrypted: encrypt(String(weight)),
        glucoseEncrypted: encrypt(String(glucose))
      }
    });

    if (meal) {
      await prismaClient.dietaryLog.create({
        data: {
          userId,
          mealDetailsEncrypted: encrypt(String(meal))
        }
      });
    }

    // 3. Fire hypo alert if glucose is critically low
    const glucoseNum = parseFloat(glucose);
    if (glucoseNum < 4.0) {
      await createHypoAlert(userId, glucoseNum);
    }

    // 4. Evaluate Phase Progression
    const healthLogs = await prismaClient.healthLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: 5
    });

    const recentDietaryLogs = await prismaClient.dietaryLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: 3
    });

    const logsForEngine = healthLogs.map(log => ({
      ...log,
      glucoseDecrypted: safeDecrypt(log.glucoseEncrypted),
      weightDecrypted: safeDecrypt(log.weightEncrypted)
    }));

    const dietaryLogsForEngine = recentDietaryLogs.map(log => ({
      ...log,
      mealDetailsDecrypted: safeDecrypt(log.mealDetailsEncrypted)
    }));

    // Pass medications so engine can gate phase advancement for high-risk patients
    const result = analyzeMetabolicProgress(logsForEngine, dietaryLogsForEngine, user.currentPhase, user.medications);

    if (result.requiresDoctorApproval) {
      // Set a pending flag — doctor must approve via /api/doctor/patients/:id/approve-phase
      await prismaClient.user.update({
        where: { id: userId },
        data: { phaseAdvancementPending: true }
      });
      await createPhasePendingAlert(userId, user.currentPhase);
    } else if (result.nextPhase !== user.currentPhase) {
      await prismaClient.user.update({
        where: { id: userId },
        data: { currentPhase: result.nextPhase }
      });
    }

    res.status(201).json({
      message: 'Log saved successfully',
      nudges: result.nudges,
      newPhase: (!result.requiresDoctorApproval && result.nextPhase !== user.currentPhase) ? result.nextPhase : null,
      disclaimerTriggered: result.disclaimerTriggered,
      phaseAdvancementPending: result.requiresDoctorApproval || undefined
    });

  } catch (error) {
    console.error('Error submitting log:', error);
    res.status(500).json({ error: 'Failed to submit log' });
  }
};

const getLogHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await prismaClient.healthLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'asc' },
      take: 30
    });

    const history = logs.map(log => ({
      id: log.id,
      loggedAt: log.loggedAt,
      glucose: parseFloat(safeDecrypt(log.glucoseEncrypted)) || 0,
      weight: parseFloat(safeDecrypt(log.weightEncrypted)) || 0
    }));

    res.json({ history });
  } catch (error) {
    console.error('Error fetching log history:', error);
    res.status(500).json({ error: 'Failed to fetch log history' });
  }
};

module.exports = {
  submitLog,
  getLogHistory
};
