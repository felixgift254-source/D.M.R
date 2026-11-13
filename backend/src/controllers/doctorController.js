const prismaClient = require('../utils/prismaClient');
const { decrypt } = require('../utils/encryption');

const safeDecrypt = (val) => {
  if (!val) return val;
  try {
    if (typeof val === 'string' && val.includes(':')) {
      return decrypt(val);
    }
    return val;
  } catch (err) {
    return val;
  }
};

/**
 * GET /api/doctor/patients
 * Returns all patients with their current phase, active medications, latest glucose log,
 * hypo warning status, and phase advancement pending flag.
 * Requires DOCTOR role (enforced by authorizeRole middleware in app.js).
 */
const getPatients = async (req, res) => {
  try {
    const patients = await prismaClient.user.findMany({
      where: { role: 'PATIENT' },
      select: {
        id: true,
        email: true,
        currentPhase: true,
        medications: true,
        targetWeight: true,
        dietaryPreferences: true,
        phaseAdvancementPending: true,
        createdAt: true,
        healthLogs: {
          orderBy: { loggedAt: 'desc' },
          take: 1
        }
      }
    });

    const formattedPatients = patients.map(p => {
      const latestLog = p.healthLogs[0] || null;
      const latestGlucose = latestLog ? parseFloat(safeDecrypt(latestLog.glucoseEncrypted)) || 0 : null;
      const latestWeight = latestLog ? parseFloat(safeDecrypt(latestLog.weightEncrypted)) || 0 : null;
      const hasHypoAlert = latestGlucose !== null && latestGlucose <= 4.0;
      const hasHyperAlert = latestGlucose !== null && latestGlucose >= 11.1;

      return {
        id: p.id,
        email: p.email,
        currentPhase: p.currentPhase,
        medications: p.medications || 'None',
        targetWeight: p.targetWeight,
        dietaryPreferences: p.dietaryPreferences,
        phaseAdvancementPending: p.phaseAdvancementPending,
        createdAt: p.createdAt,
        latestGlucose,
        latestWeight,
        lastLoggedAt: latestLog ? latestLog.loggedAt : null,
        hasHypoAlert,
        hasHyperAlert
      };
    });

    res.json({ patients: formattedPatients });
  } catch (error) {
    console.error('Error in doctor getPatients:', error);
    res.status(500).json({ error: 'Failed to fetch patients roster' });
  }
};

/**
 * GET /api/doctor/patients/:patientId/logs
 * Returns decrypted health log history for a specific patient.
 * Requires DOCTOR role (enforced by authorizeRole middleware in app.js).
 */
const getPatientLogs = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch the most recent 60 logs and return in chronological order
    const logs = await prismaClient.healthLog.findMany({
      where: { userId: patientId },
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
    console.error('Error in doctor getPatientLogs:', error);
    res.status(500).json({ error: 'Failed to fetch patient logs' });
  }
};

/**
 * POST /api/doctor/patients/:patientId/phase
 * Doctor override to advance or adjust patient phase.
 * Requires DOCTOR role (enforced by authorizeRole middleware in app.js).
 */
const updatePatientPhase = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { phase } = req.body;

    if (!['PHASE_1', 'PHASE_2', 'PHASE_3'].includes(phase)) {
      return res.status(400).json({ error: 'Invalid protocol phase' });
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: patientId },
      data: { currentPhase: phase, phaseAdvancementPending: false },
      select: { id: true, email: true, currentPhase: true }
    });

    res.json({ message: `Successfully updated patient phase to ${phase}`, user: updatedUser });
  } catch (error) {
    console.error('Error updating patient phase:', error);
    res.status(500).json({ error: 'Failed to update patient phase' });
  }
};

/**
 * POST /api/doctor/patients/:patientId/approve-phase
 * Approves pending phase advancement for a medicated patient.
 * Clears phaseAdvancementPending, advances to the next phase.
 * Requires DOCTOR role.
 */
const approvePhaseAdvancement = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await prismaClient.user.findUnique({
      where: { id: patientId },
      select: { currentPhase: true, phaseAdvancementPending: true, email: true }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    if (!patient.phaseAdvancementPending) {
      return res.status(400).json({ error: 'No pending phase advancement for this patient' });
    }

    const nextPhaseMap = { PHASE_1: 'PHASE_2', PHASE_2: 'PHASE_3' };
    const nextPhase = nextPhaseMap[patient.currentPhase];
    if (!nextPhase) {
      return res.status(400).json({ error: 'Patient is already in the final phase' });
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: patientId },
      data: { currentPhase: nextPhase, phaseAdvancementPending: false },
      select: { id: true, email: true, currentPhase: true }
    });

    // Acknowledge any open phase-pending alerts for this patient
    await prismaClient.alert.updateMany({
      where: { patientId, type: 'PHASE_PENDING', acknowledged: false },
      data: { acknowledged: true }
    });

    res.json({
      message: `Phase advancement approved. ${patient.email} is now in ${nextPhase}.`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error approving phase advancement:', error);
    res.status(500).json({ error: 'Failed to approve phase advancement' });
  }
};

/**
 * GET /api/doctor/alerts
 * Returns all unacknowledged alerts for the doctor (all patients), newest first.
 * Requires DOCTOR role.
 */
const getAlerts = async (req, res) => {
  try {
    const alerts = await prismaClient.alert.findMany({
      where: { acknowledged: false },
      include: {
        patient: { select: { id: true, email: true, currentPhase: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

/**
 * PUT /api/doctor/alerts/:alertId/acknowledge
 * Marks a specific alert as seen/acknowledged.
 * Requires DOCTOR role.
 */
const acknowledgeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await prismaClient.alert.update({
      where: { id: alertId },
      data: { acknowledged: true }
    });
    res.json({ message: 'Alert acknowledged', alert });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
};

module.exports = {
  getPatients,
  getPatientLogs,
  updatePatientPhase,
  approvePhaseAdvancement,
  getAlerts,
  acknowledgeAlert
};
