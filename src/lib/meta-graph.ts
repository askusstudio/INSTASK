// INSTASK - Meta Instagram Graph API (v21.0) Auto-Publisher
// Implements the official 2-step container publishing workflow,
// 60-day long-lived token exchange, and container status polling.

const META_GRAPH_VERSION = 'v21.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export interface PublishInput {
  igUserId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}

export interface PublishResult {
  success: boolean;
  livePostId?: string;
  containerId?: string;
  error?: string;
  isSimulated?: boolean;
}

export interface LongLivedTokenResult {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number; // usually 5184000 (60 days)
  expiresAt: Date;
}

// Utility delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes official 2-step container publishing workflow for Instagram Graph API v21.0
 */
export async function publishToInstagram(input: PublishInput): Promise<PublishResult> {
  const { igUserId, accessToken, imageUrl, caption } = input;

  // Safe simulation mode if real Meta credentials are not configured
  if (!accessToken || !igUserId || accessToken.startsWith('your_') || igUserId.startsWith('your_')) {
    // Generate realistic simulated live post ID
    const simulatedContainerId = `ig_container_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const simulatedPostId = `178414${Math.floor(10000000000 + Math.random() * 90000000000)}`;

    return {
      success: true,
      containerId: simulatedContainerId,
      livePostId: simulatedPostId,
      isSimulated: true,
    };
  }

  try {
    // Step 1: Create media container
    // POST https://graph.facebook.com/v21.0/{ig-user-id}/media
    const containerRes = await fetch(`${GRAPH_BASE_URL}/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();

    if (!containerRes.ok || !containerData.id) {
      const errMsg = containerData.error?.message || `Failed to create container (status: ${containerRes.status})`;
      // Check for common error codes like 36003 (aspect ratio) or 190 (token expired)
      const errCode = containerData.error?.code;
      if (errCode === 36003) {
        throw new Error(`Meta Error 36003: Invalid image aspect ratio. Only 1:1 or 4:5 supported.`);
      }
      if (errCode === 190) {
        throw new Error(`Meta Error 190: Access token expired. Please refresh token via dashboard.`);
      }
      throw new Error(errMsg);
    }

    const containerId = containerData.id;

    // Step 2: Poll container status until FINISHED (with max 5 attempts)
    // Wait minimum 5 seconds as specified by Meta documentation
    await delay(5000);

    let isReady = false;
    let attempts = 0;

    while (!isReady && attempts < 5) {
      attempts++;
      const statusRes = await fetch(
        `${GRAPH_BASE_URL}/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();

      if (statusData.status_code === 'FINISHED') {
        isReady = true;
        break;
      } else if (statusData.status_code === 'ERROR') {
        throw new Error(`Container processing failed: ${statusData.status || 'Unknown error'}`);
      }

      await delay(2000);
    }

    // Step 3: Publish media container
    // POST https://graph.facebook.com/v21.0/{ig-user-id}/media_publish
    const publishRes = await fetch(`${GRAPH_BASE_URL}/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();

    if (!publishRes.ok || !publishData.id) {
      throw new Error(publishData.error?.message || `Publishing container failed (status: ${publishRes.status})`);
    }

    return {
      success: true,
      containerId,
      livePostId: publishData.id,
      isSimulated: false,
    };
  } catch (err: any) {
    console.error('Meta Graph API publishing error:', err);
    return {
      success: false,
      error: err.message || 'Unknown Meta publishing error',
    };
  }
}

/**
 * Exchange a short-lived User token for a 60-day Long-Lived Token
 * GET /oauth/access_token?grant_type=fb_exchange_token
 */
export async function exchangeForLongLivedToken(
  shortLivedToken: string,
  appId?: string,
  appSecret?: string
): Promise<LongLivedTokenResult> {
  const finalAppId = appId || process.env.META_APP_ID;
  const finalAppSecret = appSecret || process.env.META_APP_SECRET;

  if (!finalAppId || !finalAppSecret || !shortLivedToken) {
    // Return mock 60-day token for testing
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    return {
      accessToken: `EAA_MOCK_LONG_LIVED_${Date.now()}`,
      tokenType: 'bearer',
      expiresInSeconds: 5184000,
      expiresAt,
    };
  }

  const url = `${GRAPH_BASE_URL}/oauth/access_token?grant_type=fb_exchange_token&client_id=${finalAppId}&client_secret=${finalAppSecret}&fb_exchange_token=${shortLivedToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error(data.error?.message || 'Failed to exchange long-lived Meta token');
  }

  const expiresIn = data.expires_in || 5184000;
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  return {
    accessToken: data.access_token,
    tokenType: data.token_type || 'bearer',
    expiresInSeconds: expiresIn,
    expiresAt,
  };
}

/**
 * Checks token validity and remaining expiration days
 */
export function evaluateTokenHealth(tokenExpiresAt?: Date | string | null): {
  isExpiringSoon: boolean;
  daysRemaining: number;
  status: 'HEALTHY' | 'EXPIRING_SOON' | 'EXPIRED';
} {
  if (!tokenExpiresAt) {
    return { isExpiringSoon: false, daysRemaining: 60, status: 'HEALTHY' };
  }

  const expiry = new Date(tokenExpiresAt).getTime();
  const now = Date.now();
  const msRemaining = expiry - now;
  const daysRemaining = Math.max(0, Math.floor(msRemaining / (1000 * 60 * 60 * 24)));

  if (daysRemaining <= 0) {
    return { isExpiringSoon: true, daysRemaining: 0, status: 'EXPIRED' };
  }
  if (daysRemaining <= 7) {
    return { isExpiringSoon: true, daysRemaining, status: 'EXPIRING_SOON' };
  }

  return { isExpiringSoon: false, daysRemaining, status: 'HEALTHY' };
}
