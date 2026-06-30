import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { InventoryPage } from './pages/inventory.page.js';
import { CartPage } from './pages/cart.page.js';
import { NavbarPage } from './pages/navbar.page.js';
import { CheckoutPage } from './pages/checkout.page.js';
import checkoutData from './fixtures/checkout-data.json' assert { type: 'json' };

for (const scenario of checkoutData) {
  test(`Checkout flow for ${scenario.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const navbarPage = new NavbarPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(scenario.username, scenario.password);
    await inventoryPage.expectLoaded();

    await inventoryPage.addProductsToCart(scenario.productIndexes);
    await inventoryPage.expectCartCount(scenario.productIndexes.length);

    await navbarPage.goToCart();
    await cartPage.expectItemCount(scenario.productIndexes.length);
    await cartPage.checkout();

    await checkoutPage.fillCheckoutInformation(
      scenario.firstName,
      scenario.lastName,
      scenario.postalCode
    );
    await checkoutPage.finishCheckout();
    await checkoutPage.expectComplete();
  });
}
