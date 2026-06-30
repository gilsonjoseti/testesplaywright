import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { InventoryPage } from './pages/inventory.page.js';
import loginData from './fixtures/login-data.json' assert { type: 'json' };

const apiUrl = process.env.API_URL || 'https://jsonplaceholder.typicode.com';

test.describe('UI integration with API data', () => {
  test('Should create an API post and verify UI login', async ({ request, page }) => {
    const postPayload = {
      userId: 1,
      title: `Integration-${Date.now()}`,
      body: 'Created via API for UI integration'
    };

    const apiResponse = await request.post(`${apiUrl}/posts`, {
      data: postPayload
    });
    expect(apiResponse.status()).toBe(201);
    const created = await apiResponse.json();
    expect(created).toHaveProperty('id');

    const user = loginData[0];
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.expectLoaded();

    expect(created.title).toContain('Integration-');
  });
});
