import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { InventoryPage } from './pages/inventory.page.js';

const USERNAME = process.env.USERNAME || 'standard_user';
const PASSWORD = process.env.PASSWORD || 'secret_sauce';

test.describe('Sauce Demo UI flows', () => {
  test('User can login and add an item to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.expectLoaded();
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.expectCartCount(1);
  });

  test('Invalid login shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong_user', 'wrong_pass');
    await loginPage.expectError('Epic sadface: Username and password do not match any user in this service');
  });
});
