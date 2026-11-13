const prismaClient = require('../utils/prismaClient');
const { analyzeMetabolicProgress } = require('../services/reversalEngine');
const { encrypt, decrypt } = require('../utils/encryption');
const { createHypoAlert, createHyperAlert, createPhasePendingAlert } = require('../services/alertService');

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
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

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

    // 3. Fire clinical alerts if glucose breaches safe thresholds
    const glucoseNum = parseFloat(glucose);
    let alertType = null;
    let alertInstructions = null;

    if (!isNaN(glucoseNum)) {
      if (glucoseNum <= 4.0) {
        await createHypoAlert(userId, glucoseNum);
        alertType = 'HYPO';
        alertInstructions = 'Hypoglycemia Alert (<= 4.0 mmol/L): Immediately consume 15g of fast-acting sugar (e.g. 3-4 glucose tablets or 150ml fruit juice). Rest for 15 minutes, then re-test your glucose. Your clinician has been notified.';
      } else if (glucoseNum >= 11.1) {
        await createHyperAlert(userId, glucoseNum);
        alertType = 'HYPER';
        alertInstructions = 'Hyperglycemia Risk Alert (>= 11.1 mmol/L): Your blood sugar is high. Drink plenty of water to help kidneys flush excess glucose, avoid carbohydrates, rest, and recheck your level. Your clinician has been alerted.';
      }
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
      log: {
        glucose: parseFloat(glucose),
        weight: parseFloat(weight),
        meal: finalMeal || null,
        loggedAt: new Date().toISOString()
      },
      alertType,
      alertInstructions,
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
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch the most recent 60 logs and return in chronological order (oldest to newest)
    const logs = await prismaClient.healthLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: 60
    });

    const history = logs
      .map(log => ({
        id: log.id,
        loggedAt: log.loggedAt,
        glucose: parseFloat(safeDecrypt(log.glucoseEncrypted)) || 0,
        weight: parseFloat(safeDecrypt(log.weightEncrypted)) || 0
      }))
      .reverse();

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
