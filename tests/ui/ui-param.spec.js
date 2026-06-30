import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { InventoryPage } from './pages/inventory.page.js';
import loginData from './fixtures/login-data.json' assert { type: 'json' };

for (const user of loginData) {
  test.describe(`Login flow for ${user.username}`, () => {
    test(`${user.expectedSuccess ? 'should login successfully' : 'should show error'} for ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      if (user.expectedSuccess) {
        await inventoryPage.expectLoaded();
      } else {
        await loginPage.expectError(user.expectedError);
      }
    });
  });
}
