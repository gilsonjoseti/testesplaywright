import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name','performance_glitch_user');
  await page.fill('#password','secret_sauce');
  await page.click('#login-button');
  await page.waitForSelector('.inventory_list');
  const buttonCount = await page.locator('button[id^="add-to-cart-"]').count();
  console.log('button count', buttonCount);
  for (let i = 0; i < buttonCount; i++) {
    console.log(i, await page.locator('button[id^="add-to-cart-"]').nth(i).textContent());
  }
  await page.screenshot({ path: 'd:/TestesIA/debug-saucedemo.png', fullPage: true });
  await browser.close();
})();
