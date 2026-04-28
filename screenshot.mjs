import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const outDir = './temporary screenshots';

if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const existing = await readdir(outDir).catch(() => []);
const nums = existing
  .map(f => f.match(/^screenshot-(\d+)/)?.[1])
  .filter(Boolean).map(Number);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const fname = label
  ? `${outDir}/screenshot-${next}-${label}.png`
  : `${outDir}/screenshot-${next}.png`;

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Mobile viewport (iPhone 14 Pro size) since this is mobile-first
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', msg => {
  if (msg.type() === 'error') errors.push('console: ' + msg.text());
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
// Wait for Babel to finish compiling and React to render
await new Promise(r => setTimeout(r, 1500));

await page.screenshot({ path: fname, fullPage: true });
await browser.close();

console.log(`Saved: ${fname}`);
if (errors.length) {
  console.log('\nErrors detected:');
  errors.forEach(e => console.log('  ' + e));
  process.exit(1);
}
