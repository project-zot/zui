import { test, expect } from '@playwright/test';
import { hosts, endpoints } from './values/test-constants';
import { getMultiTagRepo } from './utils/test-data-parser';
import { head } from 'lodash';

const testRepo = getMultiTagRepo();

test.describe('Repository page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });

    await page.goto(`${hosts.ui}/image/${testRepo.repo}`);
  });

  test('Repository page data', async ({ page }) => {
    // check metadata
    const firstTag = head(testRepo.tags);
    await expect(page.getByText(firstTag.description).first()).toBeVisible({ timeout: 100000 });
    await expect(page.getByText(firstTag.source).first()).toBeVisible({ timeout: 100000 });

    // check tags and tags search
    for (let tag of testRepo.tags) {
      await expect(page.getByText(tag.tag, { exact: true })).toBeVisible({ timeout: 100000 });
    }
    await page.getByText('Show more').first().click();
    await expect(page.getByText('linux/amd64')).toBeVisible({ timeout: 100000 });
    await page.getByPlaceholder('Search tags...').click();
    await page.getByPlaceholder('Search tags...').fill(testRepo.tags[0].tag);
    await expect(page.getByText(testRepo.tags[0].tag, { exact: true })).toBeVisible({ timeout: 100000 });
    await expect(page.getByText(testRepo.tags[1].tag, { exact: true })).not.toBeVisible({ timeout: 100000 });
  });

  test('Repository page navigation', async ({ page }) => {
    await expect(page.getByText(testRepo.tags[0].tag, { exact: true })).toBeVisible({ timeout: 100000 });
    const tagPageRequest = page.waitForRequest(
      (request) =>
        request.url() === `${hosts.api}${endpoints.image(`${testRepo.repo}:${testRepo.tags[0].tag}`)}` &&
        request.method() === 'GET'
    );
    await page.getByText(testRepo.tags[0].tag, { exact: true }).click();
    await expect(tagPageRequest).toBeDefined();
    const tagPageResponse = await tagPageRequest;
    expect(tagPageResponse).toBeTruthy();
    await expect(page).toHaveURL(/.*\/image\/.+\/tag\/.*/);
  });
});
