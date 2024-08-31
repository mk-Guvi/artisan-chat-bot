import { test, expect } from 'playwright/test';

test.describe('Chatbot integration tests', () => {
  test('Open chatbot, add new message, and end chat', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#chatbot', { state: 'visible' });
    await page.click('#chatbot');
    await page.click('button:has-text("New Chat")');
    await page.waitForSelector('button:has-text("Generate Report")');
    await page.click('button:has-text("Generate Report")');
    await page.waitForSelector('button:has-text("No")');
    await page.click('button:has-text("No")');
    const endMessageVisible = await page.waitForSelector('text=Thank You.', {
      state: 'visible',
    });
    expect(endMessageVisible).toBeTruthy();
  });
});
