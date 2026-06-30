import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.inventoryHeader = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.addToCartButtons = page.locator('button[id^="add-to-cart-"]');
  }

  async expectLoaded() {
    await expect(this.inventoryHeader).toHaveText('Products');
    await expect(this.addToCartButtons).toHaveCount(6, { timeout: 20000 });
  }

  async addFirstProductToCart() {
    const button = this.addToCartButtons.first();
    await expect(button).toBeVisible({ timeout: 20000 });
    await button.click();
  }

  async addProductsToCart(indexes) {
    const items = this.page.locator('.inventory_item');
    await expect(items).toHaveCount(6, { timeout: 20000 });
    for (const index of indexes) {
      const product = items.nth(index);
      const button = product.locator('button:has-text("Add to cart")');
      await expect(button).toBeVisible({ timeout: 20000 });
      await button.scrollIntoViewIfNeeded();
      await button.click();
    }
  }

  async expectCartCount(count) {
    await expect(this.cartBadge).toHaveText(String(count));
  }
}
