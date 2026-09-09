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

async function runTests() {
  console.log('💳 Starting INSTASK Multi-Tier Autopay & Progressive Discount Verification...\n');
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
    // 1. Test Frontend Multi-Period Pricing Selector (/pricing)
    console.log('1. Testing Frontend Multi-Period Pricing Selector (/pricing)...');
    const pricingPage = await get('/pricing');
    assert(pricingPage.status === 200, `Pricing page returned HTTP 200 (Got ${pricingPage.status})`);
    assert(pricingPage.raw.includes('Select Your INSTASK Growth Plan'), 'Contains title "Select Your INSTASK Growth Plan"');
    assert(pricingPage.raw.includes('5% SAVINGS'), 'Displays 5% SAVINGS badge for Quarterly tier');
    assert(pricingPage.raw.includes('10% POPULAR'), 'Displays 10% POPULAR badge for Semi-Annual tier');
    assert(pricingPage.raw.includes('15% BEST VALUE'), 'Displays 15% BEST VALUE badge for Annual tier');
    assert(pricingPage.raw.includes('180') && pricingPage.raw.includes('Total Generation Credits'), 'Displays 180 Total Generation Credits');
    assert(pricingPage.raw.includes('360') && pricingPage.raw.includes('Total Generation Credits'), 'Displays 360 Total Generation Credits');
    assert(pricingPage.raw.includes('720') && pricingPage.raw.includes('Total Generation Credits'), 'Displays 720 Total Generation Credits');
    assert(pricingPage.raw.includes('Automatic Autopay Protection'), 'Contains Automatic Autopay Protection clause');
    assert(pricingPage.raw.includes('256-bit encrypted card billing handled by Stripe'), 'Contains Stripe 256-bit SSL trust seal');

    // 2. Test Checkout API: Quarterly Plan (3 Months, 5% Off, 180 Credits)
    console.log('\n2. Testing Checkout API: Quarterly Plan (3 Months)...');
    const quarterlyRes = await post('/api/billing/checkout', {
      userId: 'usr_tier_test',
      planKey: 'quarterly',
      currency: 'usd',
    });
    assert(quarterlyRes.status === 200, `Quarterly checkout returned HTTP 200 (Got ${quarterlyRes.status})`);
    assert(quarterlyRes.data.creditsGranted === 180, `Grants 180 credits (Got ${quarterlyRes.data.creditsGranted})`);
    assert(quarterlyRes.data.discountPercent === 5, `Applies 5% discount (Got ${quarterlyRes.data.discountPercent}%)`);
    assert(quarterlyRes.data.planKey === 'quarterly', 'planKey confirmed as quarterly');
    assert(quarterlyRes.data.url.includes('planKey=quarterly'), 'planKey propagated in checkout URL');

    // 3. Test Checkout API: Semi-Annual Plan (6 Months, 10% Off, 360 Credits, INR Currency)
    console.log('\n3. Testing Checkout API: Semi-Annual Plan (6 Months, INR)...');
    const semiAnnualRes = await post('/api/billing/checkout', {
      userId: 'usr_tier_test',
      planKey: 'semi_annual',
      currency: 'inr',
    });
    assert(semiAnnualRes.status === 200, `Semi-annual checkout returned HTTP 200 (Got ${semiAnnualRes.status})`);
    assert(semiAnnualRes.data.creditsGranted === 360, `Grants 360 credits (Got ${semiAnnualRes.data.creditsGranted})`);
    assert(semiAnnualRes.data.discountPercent === 10, `Applies 10% discount (Got ${semiAnnualRes.data.discountPercent}%)`);
    assert(semiAnnualRes.data.originalPrice === 21594, `INR total billed price is ₹21,594 (Got ${semiAnnualRes.data.originalPrice})`);
    assert(semiAnnualRes.data.planKey === 'semi_annual', 'planKey confirmed as semi_annual');

    // 4. Test Checkout API: Annual Plan (12 Months, 15% Off, 720 Credits)
    console.log('\n4. Testing Checkout API: Annual Plan (12 Months)...');
    const annualRes = await post('/api/billing/checkout', {
      userId: 'usr_tier_test',
      planKey: 'annual',
      currency: 'usd',
    });
    assert(annualRes.status === 200, `Annual checkout returned HTTP 200 (Got ${annualRes.status})`);
    assert(annualRes.data.creditsGranted === 720, `Grants 720 credits (Got ${annualRes.data.creditsGranted})`);
    assert(annualRes.data.discountPercent === 15, `Applies 15% discount (Got ${annualRes.data.discountPercent}%)`);
    assert(annualRes.data.originalPrice === 499.8, `USD total billed price is $499.80 (Got ${annualRes.data.originalPrice})`);
    assert(annualRes.data.planKey === 'annual', 'planKey confirmed as annual');

    // 5. Test Webhook Autopay Fulfillment for Quarterly (180 Credits, QUARTERLY cycle)
    console.log('\n5. Testing Webhook Fulfillment: Quarterly Activation...');
    const webhookQuarterly = await post('/api/webhooks/stripe', {
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'usr_tier_test',
          subscription: 'sub_quarterly_001',
          customer: 'cus_tier_001',
          metadata: {
            userId: 'usr_tier_test',
            planKey: 'quarterly',
            creditsGranted: '180',
          },
        },
      },
    });
    assert(webhookQuarterly.status === 200, `Webhook returned HTTP 200 (Got ${webhookQuarterly.status})`);
    assert(webhookQuarterly.data.billingCycle === 'QUARTERLY', `Billing cycle set to QUARTERLY (Got ${webhookQuarterly.data.billingCycle})`);
    assert(webhookQuarterly.data.creditsAdded === 180, `Added 180 credits (Got ${webhookQuarterly.data.creditsAdded})`);

    // 6. Test Webhook Autopay Fulfillment for Annual (720 Credits, ANNUAL cycle)
    console.log('\n6. Testing Webhook Fulfillment: Annual Activation...');
    const webhookAnnual = await post('/api/webhooks/stripe', {
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'usr_tier_test',
          subscription: 'sub_annual_001',
          customer: 'cus_tier_001',
          metadata: {
            userId: 'usr_tier_test',
            planKey: 'annual',
            creditsGranted: '720',
          },
        },
      },
    });
    assert(webhookAnnual.status === 200, `Webhook returned HTTP 200 (Got ${webhookAnnual.status})`);
    assert(webhookAnnual.data.billingCycle === 'ANNUAL', `Billing cycle set to ANNUAL (Got ${webhookAnnual.data.billingCycle})`);
    assert(webhookAnnual.data.creditsAdded === 720, `Added 720 credits (Got ${webhookAnnual.data.creditsAdded})`);

    console.log(`\n=====================================================================`);
    console.log(`🎯 Test Summary: ${pass} / ${total} multi-tier billing tests passed!`);
    console.log(`=====================================================================\n`);

    if (pass === total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during multi-tier test run:', err);
    process.exit(1);
  }
}

runTests();
