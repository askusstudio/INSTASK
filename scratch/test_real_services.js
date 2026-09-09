const http = require('http');
const crypto = require('crypto');

function post(path, body, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const postData = typeof body === 'string' ? body : JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          ...extraHeaders,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runRealServicesTests() {
  console.log('====================================================');
  console.log('  INSTASK REAL SERVICES INTEGRATION SUITE');
  console.log('  Supabase Brand Assets & Razorpay UPI Autopay');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // --- SUITE 1: Brand Assets Storage & Persistence ---
  console.log('\n--- 1. Brand Assets Storage & Persistence (/api/brand/save) ---');
  
  // Test 1.1: Validation failure on missing brand name
  const resEmptyBrand = await post('/api/brand/save', {
    userId: 'usr_demo_001',
    brandName: '',
  });
  assert(resEmptyBrand.status === 400, 'Rejects empty brand name with 400 Bad Request');
  assert(resEmptyBrand.data?.error?.includes('required'), 'Returns informative error for missing brand name');

  // Test 1.2: Save complete brand assets and color palette
  const resSaveBrand = await post('/api/brand/save', {
    userId: 'usr_test_brand_99',
    brandName: 'Artisan Sourdough Co',
    industry: 'Artisan Bakery',
    primaryColor: '#0F172A',
    accentColor: '#F43F5E',
    country: 'India',
    currency: 'INR',
    website: 'https://artisansourdough.in',
    instagramHandle: '@artisan_sourdough_co',
    logoUrl: 'https://hnixeuqxdqrnkahjxfzb.supabase.co/storage/v1/object/public/brand-assets/logos/test_logo.png',
  });
  assert(resSaveBrand.status === 200, 'Saves brand assets successfully with 200 OK');
  assert(resSaveBrand.data?.success === true, 'Returns success: true for saved brand assets');
  assert(resSaveBrand.data?.brand?.brandName === 'Artisan Sourdough Co', 'Persists brand name correctly');
  assert(resSaveBrand.data?.brand?.logoUrl?.includes('test_logo.png'), 'Persists Supabase logoUrl correctly');

  // Test 1.3: Retrieve saved brand via /api/brand
  const resGetBrand = await get('/api/brand?userId=usr_test_brand_99');
  assert(resGetBrand.status === 200, 'Fetches persisted brand profile with 200 OK');
  assert(resGetBrand.data?.brand?.brandName === 'Artisan Sourdough Co', 'Brand profile query matches saved data');

  // --- SUITE 2: Razorpay Subscription Checkout Route ---
  console.log('\n--- 2. Razorpay Subscription Checkout Route (/api/billing/razorpay) ---');

  // Test 2.1: Initiate Monthly subscription
  const resMonthlySub = await post('/api/billing/razorpay', {
    userId: 'usr_demo_001',
    planKey: 'monthly',
  });
  assert(resMonthlySub.status === 200, 'Initiates monthly Razorpay subscription with 200 OK');
  assert(resMonthlySub.data?.success === true, 'Returns success: true for Razorpay subscription');
  assert(Boolean(resMonthlySub.data?.subscriptionId), `Generated subscriptionId: ${resMonthlySub.data?.subscriptionId}`);
  assert(Boolean(resMonthlySub.data?.keyId), `Provided Razorpay Key ID: ${resMonthlySub.data?.keyId}`);

  // Test 2.2: Initiate Quarterly subscription with savings
  const resQuarterlySub = await post('/api/billing/razorpay', {
    userId: 'usr_demo_001',
    planKey: 'quarterly',
  });
  assert(resQuarterlySub.status === 200, 'Initiates quarterly Razorpay subscription with 200 OK');
  assert(resQuarterlySub.data?.creditsGranted === 180, 'Correctly quotes 180 credits for quarterly plan');

  // Test 2.3: Initiate Annual subscription with 15% discount
  const resAnnualSub = await post('/api/billing/razorpay', {
    userId: 'usr_demo_001',
    planKey: 'annual',
  });
  assert(resAnnualSub.status === 200, 'Initiates annual Razorpay subscription with 200 OK');
  assert(resAnnualSub.data?.creditsGranted === 720, 'Correctly quotes 720 credits for annual plan');

  // --- SUITE 3: Razorpay Recurring Webhook Handler ---
  console.log('\n--- 3. Razorpay Recurring Webhook Handler (/api/webhooks/razorpay) ---');

  const testUserId = 'usr_rzp_test_user';
  const testSubId = `sub_rzp_${Date.now()}`;

  // Test 3.1: subscription.authenticated (Mandate Authorized via UPI Autopay / Cards)
  const authEvent = {
    event: 'subscription.authenticated',
    payload: {
      subscription: {
        entity: {
          id: testSubId,
          plan_id: 'plan_quarterly_inr',
          notes: {
            userId: testUserId,
            planKey: 'quarterly',
            creditsGranted: '180',
          },
        },
      },
    },
  };

  const resAuthWebhook = await post('/api/webhooks/razorpay', authEvent);
  assert(resAuthWebhook.status === 200, 'Processes subscription.authenticated with 200 OK');
  assert(resAuthWebhook.data?.creditsAdded === 180, 'Grants 180 upfront credits on authentication');
  assert(resAuthWebhook.data?.billingCycle === 'QUARTERLY', 'Sets billingCycle to QUARTERLY');

  // Verify credit balance
  const resCredits = await get(`/api/billing/topup?userId=${testUserId}`);
  assert(resCredits.status === 200, 'Fetches credit balance after authentication');
  assert(resCredits.data?.creditsBalance >= 180, `Credit balance contains granted credits (balance: ${resCredits.data?.creditsBalance})`);

  // Test 3.2: subscription.charged (Recurring Billing Cycle Charged)
  const chargedEvent = {
    event: 'subscription.charged',
    payload: {
      subscription: {
        entity: {
          id: testSubId,
          notes: {
            userId: testUserId,
            planKey: 'quarterly',
          },
        },
      },
      payment: {
        entity: {
          id: 'pay_rzp_renewal_01',
          subscription_id: testSubId,
        },
      },
    },
  };

  const resChargedWebhook = await post('/api/webhooks/razorpay', chargedEvent);
  assert(resChargedWebhook.status === 200, 'Processes subscription.charged renewal with 200 OK');
  assert(resChargedWebhook.data?.creditsRenewed === 180, 'Renews credits on recurring cycle charged');

  // Test 3.3: subscription.cancelled
  const cancelEvent = {
    event: 'subscription.cancelled',
    payload: {
      subscription: {
        entity: {
          id: testSubId,
          notes: {
            userId: testUserId,
          },
        },
      },
    },
  };

  const resCancelWebhook = await post('/api/webhooks/razorpay', cancelEvent);
  assert(resCancelWebhook.status === 200, 'Processes subscription.cancelled with 200 OK');
  assert(resCancelWebhook.data?.subscriptionStatus === 'CANCELED', 'Subscription status marked as CANCELED');

  // Test 3.4: One-time credit topup via Razorpay payment.captured
  const topupEvent = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_topup_rzp_001',
          notes: {
            type: 'CREDIT_TOPUP',
            userId: testUserId,
            creditsToAdd: '75',
          },
        },
      },
    },
  };

  const resTopupWebhook = await post('/api/webhooks/razorpay', topupEvent);
  assert(resTopupWebhook.status === 200, 'Processes payment.captured for credit topup with 200 OK');
  assert(resTopupWebhook.data?.creditsAdded === 75, 'Successfully added 75 topup credits');

  // Test 3.5: HMAC Signature Verification
  const webhookSecret = 's@6HFpTfj77LDrz';
  const rawBody = JSON.stringify({
    event: 'subscription.charged',
    payload: {
      subscription: {
        entity: {
          id: testSubId,
          notes: { userId: testUserId, planKey: 'monthly' },
        },
      },
    },
  });

  const validSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // Valid signature test
  const resValidSig = await post('/api/webhooks/razorpay', rawBody, {
    'x-razorpay-signature': validSignature,
  });
  assert(resValidSig.status === 200, 'Accepts webhook with valid HMAC-SHA256 signature');

  // Invalid signature test
  const resInvalidSig = await post('/api/webhooks/razorpay', rawBody, {
    'x-razorpay-signature': 'invalid_signature_hex_code_12345',
  });
  assert(resInvalidSig.status === 400, 'Rejects webhook with invalid HMAC signature with 400 Bad Request');

  console.log('\n====================================================');
  console.log(`  RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runRealServicesTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
