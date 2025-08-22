import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

let response: Response;
let responseBody: any;

Given('I send a GET request to {string}', { timeout: 10000 }, async function (url: string) {
  console.log(`📤 Sending GET request to: ${url}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`❌ Request failed with status ${response.status}`);
    }

    responseBody = await response.json();
    console.log(`📥 Received response with status: ${response.status}`);
    console.log(`🧾 Parsed response body:`, responseBody);

    this.attach(JSON.stringify(responseBody, null, 2), 'application/json');
  } catch (error: any) {
    console.error('🚨 Fetch error:', error.message);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
});

Then('the response status should be {int}', { timeout: 5000 }, async function (statusCode: number) {
  console.log(`✅ Asserting response status === ${statusCode}`);
  expect(response.status).toBe(statusCode);
});

Then('the response should contain {string}', { timeout: 5000 }, async function (key: string) {
  console.log(`🔎 Checking if response JSON contains key: "${key}"`);
  expect(responseBody).toHaveProperty(key);
});
