// Test suite for Route Protection, Public Landing Page, and Live Stripe Webhook lifecycle
const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting INSTASK Route Protection & Subscription Lifecycle Verification...\n');
  let passCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Test Public Landing Page (/)
    console.log('1. Testing Public Landing Page (/)...');
    const homeRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
    });
    assert(homeRes.status === 200, `Public landing page returned HTTP 200 (Got ${homeRes.status})`);

    // 2. Test Public Pricing Page (/pricing)
    console.log('\n2. Testing Public Pricing Page (/pricing)...');
    const pricingRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/pricing',
      method: 'GET',
    });
    assert(pricingRes.status === 200, `Public pricing page returned HTTP 200 (Got ${pricingRes.status})`);

    // 3. Test Route Protection: Unauthenticated /dashboard redirects to /login
    console.log('\n3. Testing Route Protection: /dashboard redirects to /login...');
    const dashRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/dashboard',
      method: 'GET',
    });
    assert(dashRes.status === 307, `Unauthenticated /dashboard redirected with HTTP 307 (Got ${dashRes.status})`);
    const location = dashRes.headers?.location || '';
    assert(location.includes('/login'), `Redirect target includes /login (Got ${location})`);
    assert(location.includes('callbackUrl'), `Redirect includes callbackUrl parameter (Got ${location})`);

    // 4. Test Route Protection with i18n (/es/dashboard redirects to /es/login)
    console.log('\n4. Testing i18n Route Protection: /es/dashboard redirects to /es/login...');
    const esDashRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/es/dashboard',
      method: 'GET',
    });
    assert(esDashRes.status === 307, `Unauthenticated /es/dashboard redirected with HTTP 307 (Got ${esDashRes.status})`);
    const esLocation = esDashRes.headers?.location || '';
    assert(esLocation.includes('/es/login'), `Localized redirect target includes /es/login (Got ${esLocation})`);

    // 5. Test Live Stripe Checkout API (/api/billing/checkout)
    console.log('\n5. Testing Stripe Checkout API (/api/billing/checkout)...');
    const checkoutRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/billing/checkout',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      userId: 'usr_sub_verify_001',
      planPriceId: 'price_pro_growth_monthly',
    });
    assert(checkoutRes.status === 200, `Checkout API returned HTTP 200 (Got ${checkoutRes.status})`);
    assert(Boolean(checkoutRes.body?.url), `Generated checkout session URL: ${checkoutRes.body?.url}`);
    assert(checkoutRes.body?.discountApplied === true, 'FIRST50 50% discount applied for first-time subscriber');

    // 6. Test Webhook: Initial Checkout Completed -> ACTIVE
    console.log('\n6. Testing Stripe Webhook Activation (checkout.session.completed)...');
    const subActiveRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhooks/stripe',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'usr_sub_verify_001',
          subscription: 'sub_test_live_001',
          customer: 'cus_test_live_001',
        },
      },
    });
    assert(subActiveRes.status === 200, `Webhook checkout returned HTTP 200 (Got ${subActiveRes.status})`);
    assert(subActiveRes.body?.received === true, 'Webhook received & processed successfully');

    // 7. Test Webhook: Subscription Deleted -> CANCELED
    console.log('\n7. Testing Stripe Webhook Cancellation (customer.subscription.deleted)...');
    const subCancelRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhooks/stripe',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_test_live_001',
          customer: 'cus_test_live_001',
        },
      },
    });
    assert(subCancelRes.status === 200, `Webhook cancel returned HTTP 200 (Got ${subCancelRes.status})`);
    assert(subCancelRes.body?.received === true, 'Cancellation event handled successfully');

    console.log(`\n=====================================================================`);
    console.log(`🎯 Test Summary: ${passCount} / ${totalCount} route & billing tests passed!`);
    console.log(`=====================================================================\n`);

    if (passCount === totalCount) {
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
