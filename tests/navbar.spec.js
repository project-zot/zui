import { test, expect } from '@playwright/test';
import { hosts, endpoints, sortCriteria } from './values/test-constants';
import { getRepoListOrderedAlpha } from './utils/test-data-parser';

test.describe('navbar test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });
  });

  test('nav search', async ({ page }) => {
    const alphaOrderedData = getRepoListOrderedAlpha();
    await page.goto(`${hosts.ui}/home`);
    // search results
    const searchRequest = page.waitForRequest(
      (request) =>
        request.url() ===
          `${hosts.api}${endpoints.globalSearch(
            alphaOrderedData[0].repo.substring(0, 3),
            sortCriteria.relevance,
            1,
            9
          )}` && request.method() === 'GET'
    );
    await page.getByPlaceholder('Search for content...').click();
    await page.getByPlaceholder('Search for content...').fill(alphaOrderedData[0].repo.substring(0, 3));
    const searchResponse = await searchRequest;
    expect(searchResponse).toBeTruthy();
    const searchSuggestion = await page.getByRole('option', { name: alphaOrderedData[0].repo });
    await expect(searchSuggestion).toBeVisible({ timeout: 100000 });

    // clicking a search result

    await searchSuggestion.click();
    await expect(page).toHaveURL(/.*\/image.*/);
  });
});
