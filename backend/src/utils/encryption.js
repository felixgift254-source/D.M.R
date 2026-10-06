const crypto = require('crypto');

// === Startup Validation ===
const keySource = process.env.ENCRYPTION_KEY;
if (!keySource || Buffer.from(keySource, 'utf-8').length !== 32) {
  console.error('FATAL ERROR: ENCRYPTION_KEY must be set and exactly 32 bytes (UTF-8).');
  console.error('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'latin1\'))"');
  process.exit(1);
}
const secretKey = Buffer.from(keySource, 'utf-8');

// AES-256-GCM — provides both confidentiality AND integrity (authenticated encryption).
// Format (hex): iv:authTag:ciphertext
const GCM_ALGORITHM = 'aes-256-gcm';
const GCM_IV_LENGTH = 12; // 96-bit IV is recommended for GCM

// Legacy CBC constants — used only for backward-compatible decryption of old data.
const CBC_ALGORITHM = 'aes-256-cbc';
const CBC_IV_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * @param {string} text - Plaintext to encrypt
 * @returns {string} Hex-encoded "iv:authTag:ciphertext"
 */
const encrypt = (text) => {
  const iv = crypto.randomBytes(GCM_IV_LENGTH);
  const cipher = crypto.createCipheriv(GCM_ALGORITHM, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts an encrypted string.
 * Supports both new GCM format (3-part: iv:authTag:ciphertext)
 * and legacy CBC format (2-part: iv:ciphertext) for backward compatibility.
 * @param {string} hash - Hex-encoded encrypted string
 * @returns {string} Decrypted plaintext
 */
const decrypt = (hash) => {
  const parts = hash.split(':');

  if (parts.length === 3) {
    // New AES-256-GCM format
    const [ivHex, authTagHex, ciphertext] = parts;
    const decipher = crypto.createDecipheriv(
      GCM_ALGORITHM,
      secretKey,
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  if (parts.length === 2) {
    // Legacy AES-256-CBC format — read-only, existing data only
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(CBC_ALGORITHM, secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  throw new Error('Invalid encrypted value format');
};

module.exports = { encrypt, decrypt };
