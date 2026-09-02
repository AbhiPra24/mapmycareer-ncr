/**
 * Playwright headless verification for company-clustered map view.
 *
 * Tests:
 *  1. Page loads correctly with jobs
 *  2. Map renders (leaflet container visible)
 *  3. Company cluster markers appear (custom-company-cluster-pin class)
 *  4. Companies + positions badge is visible in bottom-right
 *  5. Cluster marker popup opens with company info (via JS dispatch)
 *  6. Popup shows "open positions" text
 *  7. Popup has scrollable job rows
 *  8. Left panel job list shows all individual jobs
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3001';
const TIMEOUT   = 20_000;

let browser, page;

async function setup() {
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  page = await ctx.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
}

async function teardown() {
  await browser.close();
}

function pass(label) { console.log(`  ✅ PASS: ${label}`); }
function fail(label, err) { console.error(`  ❌ FAIL: ${label}\n        ${err}`); process.exitCode = 1; }

async function test(label, fn) {
  try {
    await fn();
    pass(label);
  } catch (err) {
    fail(label, err.message || err);
  }
}

(async () => {
  console.log('\n🧪 Company Clustered Map View — Playwright Verification\n');

  await setup();

  // 1. Loading screen resolves
  await test('Loading screen resolves and main layout renders', async () => {
    await page.waitForSelector('[class*="grid"]', { timeout: TIMEOUT });
  });

  // 2. Leaflet map container visible
  await test('Leaflet map container is visible', async () => {
    await page.waitForSelector('.leaflet-container', { timeout: TIMEOUT });
    const visible = await page.isVisible('.leaflet-container');
    if (!visible) throw new Error('leaflet-container not visible');
  });

  // 3. Cluster markers appear
  await test('Company cluster marker pins are rendered in the DOM', async () => {
    await page.waitForTimeout(2500);
    const count = await page.evaluate(() =>
      document.querySelectorAll('.custom-company-cluster-pin').length
    );
    if (count === 0) throw new Error('No cluster pins found — expected at least 1');
    console.log(`       (found ${count} cluster markers)`);
  });

  // 4. Companies + positions badge
  await test('Bottom-right "companies · positions" count badge is visible', async () => {
    const badgeText = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const found = divs.find(d => d.textContent && d.textContent.includes('companies') && d.textContent.includes('positions'));
      return found ? found.textContent.trim().substring(0, 100) : null;
    });
    if (!badgeText) throw new Error('Badge text not found');
    console.log(`       (badge snippet: "${badgeText}")`);
  });

  // 5. Trigger popup via JS click on first marker (bypasses viewport constraint)
  await test('Programmatic click on first cluster marker triggers popup', async () => {
    const opened = await page.evaluate(() => {
      const pin = document.querySelector('.custom-company-cluster-pin');
      if (!pin) return 'no_pin';
      // Dispatch a click on the marker icon element's parent (the leaflet marker)
      const marker = pin.closest('.leaflet-marker-icon');
      if (!marker) return 'no_marker';
      marker.click();
      return 'clicked';
    });
    if (opened !== 'clicked') throw new Error(`Could not click marker: ${opened}`);
    // Wait for popup to appear
    await page.waitForTimeout(800);
  });

  // 6. Popup contains "open position"
  await test('Popup is present and contains "open position" text', async () => {
    const text = await page.evaluate(() => {
      const popup = document.querySelector('.leaflet-popup-content');
      return popup ? popup.textContent : null;
    });
    if (!text) throw new Error('Popup has no text content — popup may not have opened');
    if (!text.includes('open position')) throw new Error(`Missing "open position" in popup. Got: ${text.substring(0, 200)}`);
    console.log(`       (popup snippet: "${text.substring(0, 100).trim()}")`);
  });

  // 7. Popup has job rows
  await test('Popup contains individual job rows with cursor-pointer', async () => {
    const rowCount = await page.evaluate(() => {
      const popup = document.querySelector('.leaflet-popup-content');
      if (!popup) return 0;
      return popup.querySelectorAll('[class*="cursor-pointer"]').length;
    });
    if (rowCount === 0) throw new Error('No job rows found inside popup');
    console.log(`       (${rowCount} job row(s) in popup)`);
  });

  // 8. Left panel shows individual job cards
  await test('Left panel job list renders individual job cards', async () => {
    const cardCount = await page.evaluate(() =>
      document.querySelectorAll('[class*="rounded-xl"][class*="border"][class*="cursor-pointer"]').length
    );
    if (cardCount === 0) throw new Error('No job cards found in left panel');
    console.log(`       (${cardCount} job cards visible in panel)`);
  });

  // 9. Clicking job row in popup triggers job details modal
  await test('Clicking job row inside popup opens job details modal', async () => {
    // The popup from test 7 is still open — directly click a job row
    // If it's closed (e.g. due to test ordering), re-open it first
    let hasPopup = await page.evaluate(() => !!document.querySelector('.leaflet-popup-content'));
    if (!hasPopup) {
      await page.evaluate(() => {
        const pin = document.querySelector('.custom-company-cluster-pin');
        if (pin) pin.closest('.leaflet-marker-icon')?.click();
      });
      await page.waitForTimeout(1000);
    }

    // Click first job row in popup via JS
    const clicked = await page.evaluate(() => {
      const popup = document.querySelector('.leaflet-popup-content');
      if (!popup) return 'no_popup';
      const row = popup.querySelector('[class*="cursor-pointer"]');
      if (!row) return 'no_row';
      row.click();
      return 'clicked';
    });
    if (clicked !== 'clicked') throw new Error(`Could not click popup row: ${clicked}`);

    await page.waitForTimeout(800);
    const modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('[class*="fixed"][class*="inset-0"]');
      return modal ? modal.classList.toString().substring(0, 120) : null;
    });
    if (!modalVisible) throw new Error('Job details modal did not appear after clicking popup row');
    console.log(`       (modal class: "${modalVisible}")`);
  });

  // 10. Screenshot
  await test('Screenshot captured for visual review', async () => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await page.screenshot({
      path: '/Users/abhipra/Developer/Github/mapmycareer-ncr/web/playwright_cluster_map_verified.png',
      fullPage: false,
    });
  });

  await teardown();
  console.log('\n✅ Verification complete.\n');
})();
