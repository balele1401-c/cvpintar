import crypto from 'crypto';

/**
 * Generates SHA256 Digest for DOKU request body (raw base64 format required by DOKU Jokul)
 */
export function generateDokuDigest(body: string): string {
  return crypto.createHash('sha256').update(body, 'utf-8').digest('base64');
}

/**
 * Generates HMAC-SHA256 Signature for DOKU requests & webhooks
 */
export function generateDokuSignature(
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  digest: string,
  secretKey: string
): string {
  // Strip any 'SHA-256=' prefix if present to ensure standard Jokul component format
  const cleanDigest = digest.startsWith('SHA-256=') ? digest.substring(8) : digest;
  const component = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${cleanDigest}`;

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(component);
  const signature = hmac.digest('base64');

  return `HMACSHA256=${signature}`;
}

/**
 * Verifies incoming DOKU notification signature for security
 */
export function verifyDokuSignature(
  incomingSignature: string,
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  rawBody: string,
  secretKey: string
): boolean {
  if (!incomingSignature || !secretKey) return false;

  const digest = generateDokuDigest(rawBody);
  const expectedSignature = generateDokuSignature(
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest,
    secretKey
  );

  return incomingSignature === expectedSignature;
}
