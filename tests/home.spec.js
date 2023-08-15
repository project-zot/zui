// @ts-check
import { test, expect } from '@playwright/test';
import { hosts, endpoints, sortCriteria } from './values/test-constants';

test.describe('homepage test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });
  });

  test('homepage viewall navigation', async ({ page }) => {
    await page.goto(`${hosts.ui}/home`);
    const popularRequest = page.waitForRequest(
      (request) =>
        request.url() === `${hosts.api}${endpoints.globalSearch('', sortCriteria.downloads)}` &&
        request.method() === 'GET'
    );
    const viewAllButton = page.getByText('View all').first();
    await viewAllButton.click();
    const popularResponse = await popularRequest;
    expect(popularResponse).toBeTruthy();
    await expect(page).toHaveURL(`${hosts.ui}/explore?sortby=${sortCriteria.downloads}`);
  });
});
