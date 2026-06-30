import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userName = page.locator('#user-name');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectError(message) {
    await expect(this.errorMessage).toHaveText(message);
  }
}
