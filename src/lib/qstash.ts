// INSTASK - Upstash QStash Webhook & Scheduler Integration
// Handles cryptographic signature verification and scheduling of 15-minute cron triggers.

import { Receiver, Client } from '@upstash/qstash';

export function getQStashReceiver(): Receiver | null {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    return null;
  }

  return new Receiver({
    currentSigningKey: currentKey,
    nextSigningKey: nextKey,
  });
}

export function getQStashClient(): Client | null {
  const token = process.env.QSTASH_TOKEN;
  if (!token) return null;

  return new Client({ token });
}

/**
 * Validates either QStash cryptographic signature or Bearer CRON_SECRET token
 */
export async function verifyCronRequest(request: Request): Promise<{ authorized: boolean; reason?: string }> {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'instask_secure_cron_secret_key_change_in_production';

  // 1. Direct Bearer token check
  if (authHeader && authHeader.replace(/^Bearer\s+/i, '') === cronSecret) {
    return { authorized: true };
  }

  // 2. QStash signature verification
  const receiver = getQStashReceiver();
  const signature = request.headers.get('upstash-signature');

  if (receiver && signature) {
    try {
      const cloned = request.clone();
      const body = await cloned.text();
      const isValid = await receiver.verify({
        signature,
        body,
        url: request.url,
      });

      if (isValid) {
        return { authorized: true };
      }
    } catch (err: any) {
      return { authorized: false, reason: `QStash verification failed: ${err.message}` };
    }
  }

  // For development convenience, allow local requests
  const host = request.headers.get('host') || '';
  if (process.env.NODE_ENV !== 'production' && (host.includes('localhost') || host.includes('127.0.0.1'))) {
    return { authorized: true, reason: 'Allowed for local development' };
  }

  return { authorized: false, reason: 'Missing or invalid authorization header' };
}
