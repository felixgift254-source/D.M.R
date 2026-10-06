const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch {
  nodemailer = null;
}
const prismaClient = require('../utils/prismaClient');

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_COOKIE_NAME = 'dmr_refresh';

/**
 * Creates a short-lived access token (2h) and a long-lived refresh token (7d).
 */
const issueTokens = (user) => {
  const payload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

/**
 * Sets the refresh token as an HTTP-only, Secure, SameSite=Strict cookie.
 * HTTP-only prevents XSS from reading it; Secure ensures HTTPS-only transmission.
 */
const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body; // Validated by Zod middleware

    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prismaClient.user.create({
      data: {
        email,
        passwordHash,
        role: 'PATIENT' // Role is always PATIENT on self-registration; promotion is admin-only
      }
    });

    const { accessToken, refreshToken } = issueTokens(user);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        currentPhase: user.currentPhase
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Validated by Zod middleware

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = issueTokens(user);
    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        currentPhase: user.currentPhase
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * POST /api/auth/refresh
 * Issues a new access token using the refresh token stored in the HTTP-only cookie.
 */
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, currentPhase: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = issueTokens(user);
    setRefreshCookie(res, newRefreshToken); // Rotate refresh token on each use

    res.json({ token: accessToken });
  } catch (error) {
    // Clear the invalid cookie
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        role: true,
        currentPhase: true
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

/**
 * POST /api/auth/forgot-password
 * Generates a time-limited reset token and emails it to the user.
 * Always returns 200 (even if email not found) to prevent email enumeration.
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prismaClient.user.findUnique({ where: { email } });

    // Always respond 200 to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate a cryptographically secure raw token (sent in email)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Invalidate any existing tokens for this user
    await prismaClient.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }
    });

    await prismaClient.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt }
    });

    // Send reset email if SMTP is configured
    if (process.env.SMTP_HOST && nodemailer) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: `"DMR System" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset your DMR password',
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="background:#0d9488;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Reset Password</a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">If you did not request this, please ignore this email. Your password will not change.</p>
        `
      });
    }

    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

/**
 * POST /api/auth/reset-password
 * Validates the reset token and updates the user's password.
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await prismaClient.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prismaClient.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    });

    // Mark token as used — single-use only
    await prismaClient.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    // Clear any active refresh cookie so old sessions are invalidated
    res.clearCookie(REFRESH_COOKIE_NAME);

    res.json({ message: 'Password reset successfully. Please log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  getMe,
  forgotPassword,
  resetPassword
};
