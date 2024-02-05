import { test, expect } from '@playwright/test';
import { getTagWithDependencies, getTagWithDependents, getTagWithVulnerabilities } from './utils/test-data-parser';
import { hosts, pageSizes } from './values/test-constants';

test.describe('Tag page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });
  });

  test('Tag page with dependents', async ({ page }) => {
    const tagWithDependents = getTagWithDependents();
    await page.goto(`${hosts.ui}/image/${tagWithDependents.title}/tag/${tagWithDependents.tag}`);
    await expect(page.getByRole('tab', { name: 'Layers' })).toBeVisible({ timeout: 100000 });
    await page.getByRole('tab', { name: 'Layers' }).click();
    await expect(page.getByTestId('layer-card-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await page.getByRole('tab', { name: 'Used by' }).click();
    await expect(page.getByTestId('dependents-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(page.getByText('Tag').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(await page.getByText('Tag').count()).toBeGreaterThan(0);
  });

  test('Tag page with dependencies', async ({ page }) => {
    const tagWithDependencies = getTagWithDependencies();
    await page.goto(`${hosts.ui}/image/${tagWithDependencies.title}/tag/${tagWithDependencies.tag}`);
    await expect(page.getByRole('tab', { name: 'Layers' })).toBeVisible({ timeout: 100000 });
    await page.getByRole('tab', { name: 'Layers' }).click();
    await expect(page.getByTestId('layer-card-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await page.getByRole('tab', { name: 'Uses' }).click();
    await expect(page.getByTestId('depends-on-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(page.getByText('Tag')).toHaveCount(1, { timeout: 100000 });
  });

  test('Tag page with vulnerabilities', async ({ page }) => {
    const tagWithVulnerabilities = getTagWithVulnerabilities();
    await page.goto(`${hosts.ui}/image/${tagWithVulnerabilities.title}/tag/${tagWithVulnerabilities.tag}`);
    await page.getByRole('tab', { name: 'Vulnerabilities' }).click();
    await expect(page.getByTestId('vulnerability-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(page.getByText(/CVE-/).nth(0)).toBeVisible({ timeout: 100000 });
    await expect(await page.getByText(/CVE-/).count()).toBeGreaterThan(0);
    await expect(await page.getByText(/CVE-/).count()).toBeLessThanOrEqual(pageSizes.EXPLORE);
  });
});
