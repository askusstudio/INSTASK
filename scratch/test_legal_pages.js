// Test verification script for Instask (Operated by INSTASK) Legal Compliance Suite
const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data), text: data });
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
  console.log('⚖️ Starting Instask Legal Compliance & Chargeback Protection Verification...\n');
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
    // 1. Test Refund Policy Page (/refund-policy)
    console.log('1. Testing Refund & Cancellation Policy (/refund-policy)...');
    const refundRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/refund-policy',
      method: 'GET',
    });
    assert(refundRes.status === 200, `Refund policy returned HTTP 200 (Got ${refundRes.status})`);
    assert(refundRes.text.includes('Strict No-Refund Policy'), 'Contains "Strict No-Refund Policy"');
    assert(refundRes.text.includes('INSTASK'), 'Contains legal entity operator "INSTASK"');
    assert(refundRes.text.includes('cooling-off'), 'Contains statutory cooling-off forfeiture clause');
    assert(refundRes.text.includes('non-refundable'), 'Affirms non-refundable digital compute consumption');

    // 2. Test Terms of Service Page (/terms)
    console.log('\n2. Testing Terms of Service (/terms)...');
    const termsRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/terms',
      method: 'GET',
    });
    assert(termsRes.status === 200, `Terms page returned HTTP 200 (Got ${termsRes.status})`);
    assert(termsRes.text.includes('Terms of Service'), 'Contains "Terms of Service"');
    assert(termsRes.text.includes('Meta / Instagram Platform Compliance'), 'Contains Meta platform compliance clause');
    assert(termsRes.text.includes('AI-Generated Output &amp; Review Obligation') || termsRes.text.includes('AI-Generated Output'), 'Contains AI editorial review obligation');
    assert(termsRes.text.includes('Chargebacks and Disputes'), 'Contains contractual chargeback and dispute terms');

    // 3. Test Privacy Policy Page (/privacy)
    console.log('\n3. Testing Privacy Policy (/privacy)...');
    const privacyRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/privacy',
      method: 'GET',
    });
    assert(privacyRes.status === 200, `Privacy page returned HTTP 200 (Got ${privacyRes.status})`);
    assert(privacyRes.text.includes('Privacy Policy'), 'Contains "Privacy Policy"');
    assert(privacyRes.text.includes('Information We Collect'), 'Outlines data collection scope');
    assert(privacyRes.text.includes('Stripe'), 'Specifies Stripe payment isolation');
    assert(privacyRes.text.includes('Meta Graph API'), 'Specifies Meta Graph API authorized posting');

    // 4. Test Mandatory Pre-Payment Checkout Checkbox on /pricing
    console.log('\n4. Testing Mandatory Pre-Payment Checkbox (/pricing)...');
    const pricingRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/pricing',
      method: 'GET',
    });
    assert(pricingRes.status === 200, `Pricing page returned HTTP 200 (Got ${pricingRes.status})`);
    assert(pricingRes.text.includes('INSTASK'), 'Explicitly names "INSTASK" in billing authorization');
    assert(pricingRes.text.includes('all sales are final and non-refundable'), 'Explicitly mandates non-refundable consent');
    assert(pricingRes.text.includes('/terms') && pricingRes.text.includes('/refund-policy'), 'Embeds clickable links to /terms and /refund-policy');
    assert(refundRes.text.includes('All services, compute processing, and subscription memberships are provided directly by') && refundRes.text.includes('INSTASK'), 'Contains explicit INSTASK direct service provision clause');
    assert(refundRes.text.includes('All transactions made on INSTASK are strictly final and non-refundable'), 'Contains explicit strictly final and non-refundable clause');

    console.log(`\n=====================================================================`);
    console.log(`🎯 Test Summary: ${passCount} / ${totalCount} legal compliance tests passed!`);
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
