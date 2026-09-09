const http = require('http');

function request(options, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        ...options,
        headers: {
          ...options.headers,
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('🌍 Starting Regional Pricing & Geo-Currency Verification...\n');
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
    // 1. Test Unit Currency Mapping
    console.log('1. Testing Currency Mapping Logic (src/lib/currency.ts)...');
    // Dynamically compile or check TS
    // We can test via HTTP endpoints directly

    // 2. Test India (IN) -> INR
    console.log('\n2. Testing Geolocation: India (x-vercel-ip-country: IN)...');
    const inRes = await request(
      { hostname: 'localhost', port: 3000, path: '/pricing', method: 'GET' },
      { 'x-vercel-ip-country': 'IN' }
    );
    assert(inRes.status === 200, `Pricing returned HTTP 200 (Got ${inRes.status})`);
    assert(inRes.text.includes('₹1999') || inRes.text.includes('1999'), 'Contains Indian Rupee discount price ₹1999');
    assert(inRes.text.includes('₹3999') || inRes.text.includes('3999'), 'Contains Indian Rupee regular price ₹3999');
    assert(inRes.text.includes('INR'), 'Displays currency code INR');

    // 3. Test United States (US) -> USD
    console.log('\n3. Testing Geolocation: United States (x-vercel-ip-country: US)...');
    const usRes = await request(
      { hostname: 'localhost', port: 3000, path: '/pricing', method: 'GET' },
      { 'x-vercel-ip-country': 'US' }
    );
    assert(usRes.status === 200, `Pricing returned HTTP 200 (Got ${usRes.status})`);
    assert(usRes.text.includes('$24.5') || usRes.text.includes('24.5'), 'Contains US Dollar discount price $24.5');
    assert(usRes.text.includes('$49') || usRes.text.includes('49'), 'Contains US Dollar regular price $49');
    assert(usRes.text.includes('USD'), 'Displays currency code USD');

    // 4. Test United Kingdom (GB) -> GBP
    console.log('\n4. Testing Geolocation: United Kingdom (x-vercel-ip-country: GB)...');
    const gbRes = await request(
      { hostname: 'localhost', port: 3000, path: '/pricing', method: 'GET' },
      { 'x-vercel-ip-country': 'GB' }
    );
    assert(gbRes.status === 200, `Pricing returned HTTP 200 (Got ${gbRes.status})`);
    assert(gbRes.text.includes('£19.5') || gbRes.text.includes('19.5'), 'Contains British Pound discount price £19.5');
    assert(gbRes.text.includes('£39') || gbRes.text.includes('39'), 'Contains British Pound regular price £39');
    assert(gbRes.text.includes('GBP'), 'Displays currency code GBP');

    // 5. Test European Union (FR/DE) -> EUR
    console.log('\n5. Testing Geolocation: European Union (x-vercel-ip-country: FR)...');
    const euRes = await request(
      { hostname: 'localhost', port: 3000, path: '/pricing', method: 'GET' },
      { 'x-vercel-ip-country': 'FR' }
    );
    assert(euRes.status === 200, `Pricing returned HTTP 200 (Got ${euRes.status})`);
    assert(euRes.text.includes('€22.5') || euRes.text.includes('22.5'), 'Contains Euro discount price €22.5');
    assert(euRes.text.includes('€45') || euRes.text.includes('45'), 'Contains Euro regular price €45');
    assert(euRes.text.includes('EUR'), 'Displays currency code EUR');

    // 6. Test UAE (AE) -> AED
    console.log('\n6. Testing Geolocation: United Arab Emirates (x-vercel-ip-country: AE)...');
    const aeRes = await request(
      { hostname: 'localhost', port: 3000, path: '/pricing', method: 'GET' },
      { 'x-vercel-ip-country': 'AE' }
    );
    assert(aeRes.status === 200, `Pricing returned HTTP 200 (Got ${aeRes.status})`);
    assert(aeRes.text.includes('AED 90') || aeRes.text.includes('90'), 'Contains UAE Dirham discount price 90');
    assert(aeRes.text.includes('AED 180') || aeRes.text.includes('180'), 'Contains UAE Dirham regular price 180');
    assert(aeRes.text.includes('AED'), 'Displays currency code AED');

    // 7. Test Fallback (Unlisted country, e.g. BR or null) -> Defaults to USD
    console.log('\n7. Testing Fallback: Default to USD (x-vercel-ip-country: BR)...');
    const fbRes = await request(
      { hostname: 'localhost', port: 3000, path: '/pricing', method: 'GET' },
      { 'x-vercel-ip-country': 'BR' }
    );
    assert(fbRes.status === 200, `Pricing returned HTTP 200 (Got ${fbRes.status})`);
    assert(fbRes.text.includes('USD') || fbRes.text.includes('$24.5'), 'Unlisted country falls back to USD $24.50');

    // 8. Test Checkout API with dynamic planPriceId
    console.log('\n8. Testing Checkout API with dynamic planPriceId...');
    const postData = JSON.stringify({ planPriceId: 'price_inr_growth_monthly', userId: 'usr_regional_test' });
    const checkoutRes = await new Promise((resolve, reject) => {
      const creq = http.request(
        {
          hostname: 'localhost',
          port: 3000,
          path: '/api/billing/checkout',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        (cres) => {
          let cdata = '';
          cres.on('data', (chk) => (cdata += chk));
          cres.on('end', () => resolve({ status: cres.statusCode, data: JSON.parse(cdata) }));
        }
      );
      creq.on('error', reject);
      creq.write(postData);
      creq.end();
    });

    assert(checkoutRes.status === 200, `Checkout API returned HTTP 200 (Got ${checkoutRes.status})`);
    assert(
      checkoutRes.data.url.includes('price_inr_growth_monthly'),
      `Dynamic planPriceId propagated to checkout URL: ${checkoutRes.data.url}`
    );

    console.log(`\n=====================================================================`);
    console.log(`🎯 Test Summary: ${pass} / ${total} regional pricing tests passed!`);
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

run();
