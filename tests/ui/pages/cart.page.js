import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async expectItemCount(count) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
