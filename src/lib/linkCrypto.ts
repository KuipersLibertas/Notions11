/**
 * AES-256-GCM encryption/decryption for link access passwords.
 *
 * Why not bcrypt? The link password must remain readable to the owner (shown in
 * the Manage Links UI), so one-way hashing is not an option. AES-256-GCM with
 * a random IV provides authenticated encryption: a DB breach exposes only
 * ciphertext, not the plaintext passwords.
 *
 * The encryption key is derived from NEXTAUTH_SECRET via SHA-256 so no extra
 * environment variable is needed.
 *
 * Stored format: "enc:<base64(iv || authTag || ciphertext)>"
 * Legacy plaintext passwords (no prefix) are returned as-is so existing links
 * keep working. New passwords saved via saveLink / updateLink will be encrypted.
 */

import crypto from 'crypto';

const ALGO   = 'aes-256-gcm';
const PREFIX = 'enc:';

function getKey(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET must be set to encrypt link passwords');
  return crypto.createHash('sha256').update(secret).digest();
}

/** Encrypt a plaintext link password before storing in the database. */
export function encryptLinkPassword(plaintext: string): string {
  if (!plaintext) return plaintext;
  const key      = getKey();
  const iv       = crypto.randomBytes(12);
  const cipher   = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag  = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

/** Decrypt a stored link password for display or comparison.
 *  Falls back to returning the value as-is for legacy plaintext entries. */
export function decryptLinkPassword(stored: string | null): string {
  if (!stored) return '';
  if (!stored.startsWith(PREFIX)) return stored; // legacy plaintext — pass through
  try {
    const key      = getKey();
    const buf      = Buffer.from(stored.slice(PREFIX.length), 'base64');
    const iv       = buf.subarray(0, 12);
    const authTag  = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted).toString('utf8') + decipher.final('utf8');
  } catch {
    // Decryption failed — return empty string rather than crashing
    return '';
  }
}

/** Compare a user-supplied plaintext password against a stored (possibly
 *  encrypted) value. Works for both legacy plaintext and encrypted entries. */
export function verifyLinkPassword(stored: string | null, supplied: string): boolean {
  const plaintext = decryptLinkPassword(stored);
  return plaintext === supplied;
}
