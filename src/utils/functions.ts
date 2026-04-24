import crypto from 'crypto';

/**
 * Generate a cryptographically secure random password.
 * Uses crypto.randomBytes() instead of Math.random() so the output is
 * unpredictable even if an attacker can observe other outputs from the
 * same session.
 */
export const generatePassword = (): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?/';
  const bytes   = crypto.randomBytes(16);
  return Array.from(bytes, (b) => charset[b % charset.length]).join('');
};

/**
 * Generate a cryptographically secure random link slug (8 chars).
 * Uses crypto.randomBytes() for the same reason as generatePassword().
 */
export const generateLink = (): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes   = crypto.randomBytes(8);
  return Array.from(bytes, (b) => charset[b % charset.length]).join('');
};
