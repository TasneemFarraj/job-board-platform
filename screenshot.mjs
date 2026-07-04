import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1320, height: 300 });
await page.goto('http://localhost:5177');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'C:/Users/TasneemFarraj/AppData/Local/Temp/filters-current.png' });
await browser.close();
console.log('done');
