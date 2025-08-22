import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('the user navigates to the SauceDemo login page', async function () {
  console.log('🔗 Navigating to SauceDemo login page...');
 console.time('PageLoad');
await this.page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
console.timeEnd('PageLoad');
    console.log('✅ Navigated to SauceDemo login page.');
});

When('the user logs in with username {string} and password {string}', async function (username, password) {
  console.log(`🔐 Logging in with username: ${username}`);
  await this.page.fill('#user-name', username);
  await this.page.fill('#password', password);
  await this.page.click('#login-button');
});

Then('the user should see the Products page', async function () {
  await this.page.waitForSelector('.title');
  const title = await this.page.textContent('.title');
  expect(title?.trim()).toBe('Products');
  console.log('✅ Products page verified.');
});
