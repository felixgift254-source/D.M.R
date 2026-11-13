const prisma = require('../utils/prismaClient');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch {
  nodemailer = null;
}

/**
 * High-risk medications that require doctor approval before phase advancement.
 * These drugs directly lower blood sugar and can cause hypoglycemia if phase
 * changes are made without adjusting doses.
 */
const HIGH_RISK_MEDS = [
  'insulin',
  'sulfonylurea',
  'glibenclamide',
  'glipizide',
  'gliclazide',
  'glimepiride',
  'tolbutamide',
];

/**
 * Returns true if the medication string contains any high-risk drug name.
 */
const hasHighRiskMedication = (medications) => {
  if (!medications || medications === 'None') return false;
  const lower = medications.toLowerCase();
  return HIGH_RISK_MEDS.some(med => lower.includes(med));
};

/**
 * Creates a hypo alert record in the database and optionally sends an email
 * to the configured ALERT_EMAIL_TO address. Triggered when glucose <= 4.0 mmol/L.
 */
const createHypoAlert = async (userId, glucoseVal) => {
  try {
    await prisma.alert.create({
      data: {
        patientId: userId,
        type: 'HYPO',
        glucoseVal,
        message: `Hypoglycemia Alert: Patient glucose logged at ${glucoseVal} mmol/L (<= 4.0 mmol/L). Patient instructed on Rule of 15 (take 15g fast-acting sugar, retest in 15 mins). Clinical review recommended.`,
      },
    });

    // Fire email notification if SMTP is configured
    if (process.env.SMTP_HOST && process.env.ALERT_EMAIL_TO) {
      await sendHypoEmail(userId, glucoseVal);
    }
  } catch (err) {
    // Alert creation must never crash the main log submission
    console.error('[AlertService] Failed to create hypo alert:', err.message);
  }
};

/**
 * Creates a hyper alert record in the database and optionally sends an email
 * to the configured ALERT_EMAIL_TO address. Triggered when glucose >= 11.1 mmol/L.
 */
const createHyperAlert = async (userId, glucoseVal) => {
  try {
    await prisma.alert.create({
      data: {
        patientId: userId,
        type: 'HYPER',
        glucoseVal,
        message: `Hyperglycemia Risk Alert: Patient glucose logged at ${glucoseVal} mmol/L (>= 11.1 mmol/L). High glucose risk flagged; hydration and clinical review recommended.`,
      },
    });

    if (process.env.SMTP_HOST && process.env.ALERT_EMAIL_TO) {
      await sendHyperEmail(userId, glucoseVal);
    }
  } catch (err) {
    console.error('[AlertService] Failed to create hyper alert:', err.message);
  }
};

/**
 * Creates a phase-pending alert so doctors know a patient is ready to advance
 * but requires their explicit approval due to high-risk medications.
 */
const createPhasePendingAlert = async (userId, currentPhase) => {
  try {
    const nextPhaseMap = { PHASE_1: 'PHASE_2', PHASE_2: 'PHASE_3' };
    const nextPhase = nextPhaseMap[currentPhase] || 'next phase';

    await prisma.alert.create({
      data: {
        patientId: userId,
        type: 'PHASE_PENDING',
        message: `Patient has met the metabolic criteria for ${nextPhase} but is on high-risk medication. Doctor approval required before advancement.`,
      },
    });

    if (process.env.SMTP_HOST && process.env.ALERT_EMAIL_TO) {
      await sendPhasePendingEmail(userId, nextPhase);
    }
  } catch (err) {
    console.error('[AlertService] Failed to create phase-pending alert:', err.message);
  }
};

/**
 * Sends a hypo alert email using nodemailer.
 */
const sendHypoEmail = async (userId, glucoseVal) => {
  try {
    if (!nodemailer) {
      console.warn('[AlertService] nodemailer not installed; skipping email dispatch.');
      return;
    }
    const patient = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"DMR Alert System" <${process.env.SMTP_USER}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject: `🚨 HYPO ALERT — Patient glucose ${glucoseVal} mmol/L`,
      html: `
        <h2 style="color:#dc2626">Hypoglycemia Alert</h2>
        <p>A patient under your care has logged a critical glucose reading.</p>
        <table>
          <tr><td><strong>Patient:</strong></td><td>${patient?.email || userId}</td></tr>
          <tr><td><strong>Glucose:</strong></td><td style="color:#dc2626;font-weight:bold">${glucoseVal} mmol/L (below 4.0)</td></tr>
          <tr><td><strong>Time:</strong></td><td>${new Date().toLocaleString()}</td></tr>
        </table>
        <p>Please review this patient's recent logs and contact them as appropriate.</p>
        <p style="color:#6b7280;font-size:12px">Digital Metabolic Reversal System — Kenya</p>
      `,
    });
  } catch (err) {
    console.error('[AlertService] Failed to send hypo email:', err.message);
  }
};

/**
 * Sends a phase-pending email notification.
 */
const sendPhasePendingEmail = async (userId, nextPhase) => {
  try {
    if (!nodemailer) {
      console.warn('[AlertService] nodemailer not installed; skipping email dispatch.');
      return;
    }
    const patient = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"DMR Alert System" <${process.env.SMTP_USER}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject: `📋 Phase Advancement Approval Required — ${patient?.email || userId}`,
      html: `
        <h2>Phase Advancement Requires Your Approval</h2>
        <p>A medicated patient has met the metabolic criteria for advancement to <strong>${nextPhase}</strong>.</p>
        <p><strong>Patient:</strong> ${patient?.email || userId}</p>
        <p>Due to their high-risk medication profile (Insulin or Sulfonylurea), please review their glucose logs and approve or defer the phase advancement from the Clinician Portal.</p>
        <p style="color:#6b7280;font-size:12px">Digital Metabolic Reversal System — Kenya</p>
      `,
    });
  } catch (err) {
    console.error('[AlertService] Failed to send phase-pending email:', err.message);
  }
};

/**
 * Sends a hyper alert email using nodemailer.
 */
const sendHyperEmail = async (userId, glucoseVal) => {
  try {
    if (!nodemailer) {
      console.warn('[AlertService] nodemailer not installed; skipping email dispatch.');
      return;
    }
    const patient = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"DMR Alert System" <${process.env.SMTP_USER}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject: `⚠️ HYPERGLYCEMIA ALERT — Patient glucose ${glucoseVal} mmol/L`,
      html: `
        <h2 style="color:#ea580c">Hyperglycemia Risk Alert</h2>
        <p>A patient under your supervision has logged a critically high blood glucose reading.</p>
        <table>
          <tr><td><strong>Patient:</strong></td><td>${patient?.email || userId}</td></tr>
          <tr><td><strong>Glucose:</strong></td><td style="color:#ea580c;font-weight:bold">${glucoseVal} mmol/L (>= 11.1)</td></tr>
          <tr><td><strong>Time:</strong></td><td>${new Date().toLocaleString()}</td></tr>
        </table>
        <p>Please review this patient's recent logs, check hydration and carbohydrate adherence, and contact them as appropriate.</p>
        <p style="color:#6b7280;font-size:12px">Digital Metabolic Reversal System — Kenya</p>
      `,
    });
  } catch (err) {
    console.error('[AlertService] Failed to send hyper email:', err.message);
  }
};

const createTransporter = () =>
  nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

module.exports = { createHypoAlert, createHyperAlert, createPhasePendingAlert, hasHighRiskMedication };
