/**
 * Utility for Idempotency Key Generation
 * Backend API requires `idempotencyKey` string for /api/transactions
 */

export function generateIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `ik_${crypto.randomUUID()}`;
  }
  
  // Fallback UUID v4 generator
  return 'ik_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
