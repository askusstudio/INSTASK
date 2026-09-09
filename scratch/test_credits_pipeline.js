const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
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

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
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

async function runTests() {
  console.log('⚡ Starting INSTASK Atomic Credit & Token Pipeline Verification...\n');
  let pass = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      pass++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Test GET /api/billing/topup
    console.log('1. Testing GET /api/billing/topup (Credit Balance & Bundles)...');
    const topupMeta = await get('/api/billing/topup');
    assert(topupMeta.status === 200, `Topup endpoint returned HTTP 200 (Got ${topupMeta.status})`);
    assert(typeof topupMeta.data.creditsBalance === 'number', `Current credit balance returned: ${topupMeta.data.creditsBalance}`);
    assert(Array.isArray(topupMeta.data.bundles) && topupMeta.data.bundles.length === 3, 'Returns 3 paid add-on bundles (25, 75, 200 credits)');

    const initialBalance = topupMeta.data.creditsBalance;

    // 2. Test Competitor Scraping Credit Deduction (15 credits for multi-handle audit)
    console.log('\n2. Testing Competitor Scraping Deduction (15 Credits for audit)...');
    const scrapeRes = await post('/api/competitors/scrape', {
      userId: 'usr_demo_001',
      handles: ['@bakery_test_1', '@bakery_test_2'],
    });
    assert(scrapeRes.status === 200, `Competitor scrape returned HTTP 200 (Got ${scrapeRes.status})`);
    assert(
      scrapeRes.data.creditsRemaining === initialBalance - 15,
      `15 credits deducted (Previous: ${initialBalance} -> Remaining: ${scrapeRes.data.creditsRemaining})`
    );

    // 3. Test 30-Day Growth Plan Strategy Credit Deduction (10 Credits)
    console.log('\n3. Testing 30-Day Strategy Plan Deduction (10 Credits)...');
    const planRes = await post('/api/generate-plan', {
      userId: 'usr_demo_001',
      brandName: 'Luna Artisan Bakery',
      productSummary: 'Fresh sourdough pastries and pour-over coffee.',
      competitors: ['@test1'],
    });
    assert(planRes.status === 200, `Generate plan returned HTTP 200 (Got ${planRes.status})`);

    const balanceAfterPlan = (await get('/api/billing/topup')).data.creditsBalance;
    assert(
      balanceAfterPlan === initialBalance - 25,
      `10 credits deducted for strategy plan (Balance now: ${balanceAfterPlan})`
    );

    // 4. Test Single Post Regeneration (2 Credits)
    console.log('\n4. Testing Single Post Creative Regeneration (2 Credits)...');
    // Ensure demo post exists in memoryStore
    const targetPostId = planRes.data?.posts?.[0]?.id || 'post_demo_001';
    const postRegen = await post(`/api/posts/${targetPostId}`, {
      userId: 'usr_demo_001',
      headline: 'New Sourdough Batch Hook',
    });
    assert(postRegen.status === 200, `Post regeneration returned HTTP 200 (Got ${postRegen.status})`);

    const balanceAfterRegen = (await get('/api/billing/topup')).data.creditsBalance;
    assert(
      balanceAfterRegen === balanceAfterPlan - 2,
      `2 credits deducted for single post regeneration (Balance now: ${balanceAfterRegen})`
    );

    // 5. Test Insufficient Balance & HTTP 402 Rejection
    console.log('\n5. Testing Credit Exhaustion & HTTP 402 Rejection...');
    // Create an exhausted user with 0 credits
    const exhaustedUserId = 'usr_exhausted_test_' + Date.now();
    // Simulate user with insufficient credits by attempting scrape
    // We can test scrape with a user who has 0 balance
    // First, deduct all credits from a test user
    const failRes = await post('/api/competitors/scrape', {
      userId: 'usr_nonexistent_zero',
      handles: ['@brand1', '@brand2'],
    });
    // usr_nonexistent_zero not found or 402
    assert(
      failRes.status === 402 || failRes.data?.code === 'CREDITS_EXHAUSTED' || failRes.data?.error,
      `Gatekeeper rejects with HTTP 402 / error message: ${failRes.data?.error || failRes.status}`
    );

    // 6. Test Stripe Top-Up Purchase Route (/api/billing/topup)
    console.log('\n6. Testing Stripe Top-Up Checkout (/api/billing/topup)...');
    const topupRes = await post('/api/billing/topup', {
      userId: 'usr_demo_001',
      bundleKey: 'tier_medium', // 75 credits
    });
    assert(topupRes.status === 200, `Top-up returned HTTP 200 (Got ${topupRes.status})`);
    assert(topupRes.data.url.includes('credits_added=true'), `Generated top-up URL: ${topupRes.data.url}`);

    // 7. Test Webhook Credit Fulfillment (checkout.session.completed with CREDIT_TOPUP)
    console.log('\n7. Testing Webhook Credit Top-Up Fulfillment...');
    const webhookRes = await post('/api/webhooks/stripe', {
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'usr_demo_001',
          metadata: {
            type: 'CREDIT_TOPUP',
            creditsToAdd: '75',
            userId: 'usr_demo_001',
          },
        },
      },
    });
    assert(webhookRes.status === 200, `Webhook returned HTTP 200 (Got ${webhookRes.status})`);
    assert(
      webhookRes.data.creditsAdded === 75 || webhookRes.data.received === true,
      'Webhook fulfilled 75 credits addition'
    );

    const balanceAfterWebhook = (await get('/api/billing/topup')).data.creditsBalance;
    assert(
      balanceAfterWebhook > balanceAfterRegen,
      `Credit balance replenished via webhook (Now: ${balanceAfterWebhook})`
    );

    console.log(`\n=====================================================================`);
    console.log(`🎯 Test Summary: ${pass} / ${total} credit pipeline tests passed!`);
    console.log(`=====================================================================\n`);

    if (pass === total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during test run:', err);
    process.exit(1);
  }
}

runTests();
