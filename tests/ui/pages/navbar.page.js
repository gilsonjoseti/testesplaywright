import { expect } from '@playwright/test';

export class NavbarPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
