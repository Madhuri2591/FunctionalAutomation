import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

let apiResponse: any;

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  phone: '1234567890'
};

Given('the API is mocked to return user data', async function () {
  console.log('[Given] Preparing to mock API response with user data');
  // No-op: handled in Playwright route interception
});

When('I fetch the user data from the API', async function () {
  console.log('[When] Simulating API call to fetch user data');
  apiResponse = mockUser;
  console.log('[When] API response received:', apiResponse);
});

Then('the API response should contain:', async function (dataTable) {
  const expected = Object.fromEntries(dataTable.rawTable.slice(1));
  console.log('[Then] Validating API response against expected values:', expected);
  for (const key in expected) {
    console.log(`  - Checking ${key}: expected "${expected[key]}", actual "${apiResponse[key]}"`);
    expect(apiResponse[key]).toBe(expected[key]);
  }
  console.log('[Then] API response validation passed');
});

When('I open the user info UI page', async function () {
  console.log('[When] Intercepting API route and navigating to user info UI page');
await this.page.route('**/users/data', (route: import('@playwright/test').Route) => {
    console.log('[Route] Intercepted /users/data, fulfilling with mockUser');
    route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser)
    });
});

  console.log('[When] Navigating to user info UI page');
  await this.page.goto('http://localhost:8080/mock-ui/user.html');
  console.log('[When] Page loaded successfully');
});

Then('the UI should display:', async function (dataTable) {
  const expected = Object.fromEntries(dataTable.rawTable.slice(1));
  console.log('[Then] Validating UI content against expected values:', expected);

  const actualName = await this.page.textContent('#user-name');
  const actualEmail = await this.page.textContent('#user-email');
  const actualUsername = await this.page.textContent('#user-username');
  const actualPhone = await this.page.textContent('#user-phone');

  if (expected.name !== undefined) {
    console.log(`  - Name: expected "${expected.name}", actual "${actualName}"`);
    expect(actualName).toContain(expected.name);
  }
  if (expected.email !== undefined) {
    console.log(`  - Email: expected "${expected.email}", actual "${actualEmail}"`);
    expect(actualEmail).toContain(expected.email);
  }
  if (expected.username !== undefined) {
    console.log(`  - Username: expected "${expected.username}", actual "${actualUsername}"`);
    expect(actualUsername).toContain(expected.username);
  }
  if (expected.phone !== undefined) {
    console.log(`  - Phone: expected "${expected.phone}", actual "${actualPhone}"`);
    expect(actualPhone).toContain(expected.phone);
  }

  console.log('[Then] UI validation passed');
});
