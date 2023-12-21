// @ts-check
import { test, expect } from '@playwright/test';
import { scroll } from './utils/scroll';
import { getRepoCardNameForLocator, getRepoListOrderedAlpha } from './utils/test-data-parser';
import { hosts, endpoints, sortCriteria } from './values/test-constants';

test.describe('explore page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });
  });

  test('explore data', async ({ page }) => {
    const expectedRequest = `${hosts.api}${endpoints.globalSearch('', sortCriteria.relevance, 1)}`;
    const exploreDataRequest = page.waitForRequest(
      (request) => request.url() === expectedRequest && request.method() === 'GET'
    );
    await page.goto(`${hosts.ui}/explore?search=`);
    const expectDataResponse = await exploreDataRequest;
    expect(expectDataResponse).toBeTruthy();

    // if no search query provided and no filters selected, data should be alphabetical when sorted by relevance
    const alphaOrderedData = getRepoListOrderedAlpha();

    const exploreFirst = page.getByRole('button', {
      name: getRepoCardNameForLocator(alphaOrderedData[0])
    });

    const exploreSecond = page.getByRole('button', {
      name: getRepoCardNameForLocator(alphaOrderedData[1])
    });

    await expect(exploreFirst).toBeVisible({ timeout: 250000 });
    await expect(exploreSecond).toBeVisible({ timeout: 250000 });

    const exploreNextPageRequest = page.waitForRequest(
      (request) =>
        request.url() === `${hosts.api}${endpoints.globalSearch('', sortCriteria.relevance, 2)}` &&
        request.method() === 'GET'
    );
    await page.evaluate(scroll, { direction: 'down', speed: 'fast' });
    const exploreNextPageResponse = await exploreNextPageRequest;
    expect(exploreNextPageResponse).toBeTruthy();

    const postScrollExploreElementOne = page.getByRole('button', {
      name: getRepoCardNameForLocator(alphaOrderedData[alphaOrderedData.length - 1])
    });
    const postScrollExploreElementTwo = page.getByRole('button', {
      name: getRepoCardNameForLocator(alphaOrderedData[alphaOrderedData.length - 2])
    });

    await expect(postScrollExploreElementOne).toBeVisible({ timeout: 250000 });
    await expect(postScrollExploreElementTwo).toBeVisible({ timeout: 250000 });
  });

  test('explore filtering', async ({ page }) => {
    const alphaOrderedData = getRepoListOrderedAlpha();

    await page.goto(`${hosts.ui}/explore?search=`);
    const exploreFirst = page.getByRole('button', {
      name: getRepoCardNameForLocator(alphaOrderedData[0])
    });

    const exploreSecond = page.getByRole('button', {
      name: getRepoCardNameForLocator(alphaOrderedData[1])
    });

    await expect(exploreFirst).toBeVisible({ timeout: 250000 });
    await expect(exploreSecond).toBeVisible({ timeout: 250000 });

    const linuxFilter = page.getByRole('checkbox', { name: 'linux' });
    await linuxFilter.check();

    await expect(linuxFilter).toBeChecked();

    await expect(exploreFirst).toBeVisible({ timeout: 250000 });

    const windowsFilter = page.getByRole('checkbox', { name: 'windows' });
    await linuxFilter.uncheck();
    await windowsFilter.check();
    await expect(exploreFirst).not.toBeVisible({ timeout: 250000 });

    const freebsdFilter = page.getByRole('checkbox', { name: 'freebsd' });
    await windowsFilter.uncheck();
    await freebsdFilter.check();
    await expect(exploreFirst).not.toBeVisible({ timeout: 250000 });
  });
});
