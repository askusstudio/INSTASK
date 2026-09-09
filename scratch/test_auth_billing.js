// Test script for Multi-Channel Auth, Brand Onboarding, Stripe Checkout & Webhook Activation
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
  console.log('🚀 Starting INSTASK Auth & Billing Funnel Verification...\n');
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
    // 1. Test OTP Send Endpoint
    console.log('1. Testing Phone OTP Generation (/api/auth/otp/send)...');
    const otpRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/otp/send',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: '+1 555 987 6543' });

    assert(otpRes.status === 200, `OTP Endpoint returned HTTP 200 (Got ${otpRes.status})`);
    assert(otpRes.body?.success === true, 'OTP response marked success');
    assert(Boolean(otpRes.body?.demoHint), `OTP provided verification hint (${otpRes.body?.demoHint})`);

    // 2. Test Brand Profile Creation
    console.log('\n2. Testing Brand Profile Creation (/api/brand)...');
    const brandRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/brand',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      userId: 'usr_demo_001',
      brandName: 'Artisan Sourdough & Roast',
      industry: 'Artisan Bakery',
      country: 'United States',
      currency: 'USD',
      website: 'https://artisansourdough.example.com',
      instagramHandle: '@artisan_sourdough',
    });

    assert(brandRes.status === 200, `Brand POST returned HTTP 200 (Got ${brandRes.status})`);
    assert(brandRes.body?.success === true, 'Brand profile saved successfully');
    assert(brandRes.body?.brand?.brandName === 'Artisan Sourdough & Roast', 'Brand name properly saved');
    assert(brandRes.body?.brand?.instagramHandle === 'artisan_sourdough', 'Instagram handle normalized');

    // 3. Test Brand Profile Retrieval
    console.log('\n3. Testing Brand Profile Retrieval (/api/brand?userId=usr_demo_001)...');
    const getBrandRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/brand?userId=usr_demo_001',
      method: 'GET',
    });

    assert(getBrandRes.status === 200, `Brand GET returned HTTP 200 (Got ${getBrandRes.status})`);
    assert(getBrandRes.body?.brand?.brandName === 'Artisan Sourdough & Roast', 'Retrieved saved brand record');

    // 4. Test Stripe Checkout Pricing & 50% Off Calculation
    console.log('\n4. Testing Dynamic Pricing & 50% Off First Month (/api/billing/checkout)...');
    const checkoutRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/billing/checkout',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      userId: 'usr_new_test_001',
      currency: 'usd',
    });

    assert(checkoutRes.status === 200, `Checkout returned HTTP 200 (Got ${checkoutRes.status})`);
    assert(checkoutRes.body?.discountApplied === true, '50% discount automatically detected and applied');
    assert(checkoutRes.body?.discountPercent === 50, 'Discount percentage is 50%');
    assert(checkoutRes.body?.discountedPrice === 24.50, 'Discounted price is $24.50 (base $49)');
    assert(Boolean(checkoutRes.body?.checkoutUrl), `Generated valid checkout URL: ${checkoutRes.body?.checkoutUrl}`);

    // 5. Test Instant Sandbox Activation
    console.log('\n5. Testing Sandbox Plan Activation (/api/billing/simulate-activate)...');
    const activateRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/billing/simulate-activate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { userId: 'usr_new_test_001' });

    assert(activateRes.status === 200, `Simulate activation returned HTTP 200 (Got ${activateRes.status})`);
    assert(activateRes.body?.success === true, 'Activation succeeded');
    assert(activateRes.body?.user?.subscriptionStatus === 'ACTIVE', 'User subscription status changed to ACTIVE');
    assert(activateRes.body?.user?.isFirstMonthDiscountApplied === true, 'isFirstMonthDiscountApplied set to true');

    // 6. Test Webhook Verification Handler
    console.log('\n6. Testing Stripe Webhook Handler (/api/webhooks/stripe)...');
    const webhookRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhooks/stripe',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'usr_demo_001',
          subscription: 'sub_live_stripe_999',
          customer: 'cus_live_stripe_888',
        },
      },
    });

    assert(webhookRes.status === 200, `Webhook simulation returned HTTP 200 (Got ${webhookRes.status})`);
    assert(webhookRes.body?.received === true, 'Webhook received & processed successfully');

    console.log(`\n======================================================`);
    console.log(`🎯 Test Summary: ${passCount} / ${totalCount} tests passed!`);
    console.log(`======================================================\n`);

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
