const prismaClient = require('../utils/prismaClient');
const { decrypt } = require('../utils/encryption');

/**
 * Estimates HbA1c (%) from an average plasma glucose (mmol/L).
 *
 * Formula based on the ADAG (A1c-Derived Average Glucose) study:
 *   eAG (mg/dL) = (28.7 × HbA1c) − 46.7
 * Rearranged for HbA1c from mmol/L:
 *   avgGlucose_mgdl = avgGlucose_mmol × 18.0182
 *   HbA1c (%) = (avgGlucose_mgdl + 46.7) / 28.7
 *
 * Widely accepted in clinical practice. Result accurate to ±0.5%.
 */
const estimateHba1c = (avgGlucoseMmol) => {
  const avgGlucoseMgdl = avgGlucoseMmol * 18.0182;
  return ((avgGlucoseMgdl + 46.7) / 28.7).toFixed(1);
};

/**
 * Maps an HbA1c % value to a clinical risk band.
 *
 * Bands based on WHO / ADA guidelines:
 *  < 5.7%  → Non-Diabetic (Normal)
 *  5.7–6.4% → Pre-Diabetic
 *  6.5–7.9% → Diabetic (Controlled)
 *  ≥ 8.0%  → Diabetic (High Risk)
 */
const getRiskBand = (hba1c) => {
  const val = parseFloat(hba1c);
  if (val < 5.7) return { label: 'Non-Diabetic', color: 'emerald', description: 'Your estimated HbA1c is in the normal, non-diabetic range. Excellent metabolic control.' };
  if (val < 6.5) return { label: 'Pre-Diabetic', color: 'amber', description: 'Borderline range. Continue the protocol to push this into the non-diabetic zone.' };
  if (val < 8.0) return { label: 'Diabetic — Controlled', color: 'orange', description: 'Diabetic range but showing control. The protocol is working — keep going.' };
  return { label: 'Diabetic — High Risk', color: 'rose', description: 'Elevated HbA1c. Review recent dietary logs and consult your clinician.' };
};

const safeDecrypt = (val) => {
  if (!val) return null;
  try {
    if (typeof val === 'string' && val.includes(':')) return decrypt(val);
    return val;
  } catch {
    return val;
  }
};

/**
 * GET /api/user/hba1c
 * Returns estimated HbA1c from the last 90 days of logs, a 30-day trend,
 * weekly average breakdown for sparkline charting, and the risk band.
 */
const getHba1c = async (req, res) => {
  try {
    const userId = req.user.userId;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const logs = await prismaClient.healthLog.findMany({
      where: {
        userId,
        loggedAt: { gte: ninetyDaysAgo }
      },
      orderBy: { loggedAt: 'asc' }
    });

    if (logs.length === 0) {
      return res.json({
        estimated: null,
        riskBand: null,
        trend: null,
        weeklyAverages: [],
        logsUsed: 0,
        message: 'Not enough data yet. Log your glucose daily to unlock your HbA1c estimate.'
      });
    }

    // Decrypt and parse all glucose readings
    const readings = logs
      .map(log => parseFloat(safeDecrypt(log.glucoseEncrypted)))
      .filter(v => !isNaN(v) && v > 0);

    if (readings.length === 0) {
      return res.json({ estimated: null, riskBand: null, trend: null, weeklyAverages: [], logsUsed: 0 });
    }

    const avgGlucose = readings.reduce((a, b) => a + b, 0) / readings.length;
    const estimated = estimateHba1c(avgGlucose);
    const riskBand = getRiskBand(estimated);

    // 30-day trend: compare first-half vs second-half of available logs
    const midpoint = Math.floor(readings.length / 2);
    const earlyAvg = readings.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
    const recentAvg = readings.slice(midpoint).reduce((a, b) => a + b, 0) / (readings.length - midpoint);
    const earlyHba1c = parseFloat(estimateHba1c(earlyAvg));
    const recentHba1c = parseFloat(estimateHba1c(recentAvg));
    const trend = (recentHba1c - earlyHba1c).toFixed(2);

    // Build weekly averages for sparkline (bucket logs by ISO week)
    const weeklyMap = {};
    logs.forEach((log, i) => {
      const glucose = readings[i];
      if (glucose === undefined) return;
      const date = new Date(log.loggedAt);
      // Get Monday of the week as key
      const day = date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((day + 6) % 7));
      const weekKey = monday.toISOString().slice(0, 10);
      if (!weeklyMap[weekKey]) weeklyMap[weekKey] = [];
      weeklyMap[weekKey].push(glucose);
    });

    const weeklyAverages = Object.entries(weeklyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, values]) => ({
        week,
        avgGlucose: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)),
        estimatedHba1c: parseFloat(estimateHba1c(values.reduce((a, b) => a + b, 0) / values.length))
      }));

    res.json({
      estimated: parseFloat(estimated),
      avgGlucose: parseFloat(avgGlucose.toFixed(2)),
      riskBand,
      trend: parseFloat(trend),
      weeklyAverages,
      logsUsed: readings.length
    });

  } catch (error) {
    console.error('getHba1c error:', error);
    res.status(500).json({ error: 'Failed to calculate HbA1c estimate' });
  }
};

module.exports = { getHba1c };
