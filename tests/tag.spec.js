import { test, expect } from '@playwright/test';
import { getTagWithDependencies, getTagWithDependents, getTagWithVulnerabilities } from './utils/test-data-parser';
import { hosts, pageSizes } from './values/test-constants';

const getImageName = (tagData) => tagData.repo || tagData.title;
const layersTabRegex = /^(Layers|Artifact Files)$/;

const assertLayersPanelVisible = async (page, layersTab) => {
  const layersTabLabel = await layersTab.innerText();
  await layersTab.click();
  if (layersTabLabel === 'Artifact Files') {
    await expect(page.getByTestId('artifact-files-container')).toBeVisible({ timeout: 100000 });
    return;
  }
  await expect(page.getByTestId('layer-card-container')).toBeVisible({ timeout: 100000 });
};

test.describe('Tag page test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });
  });

  test('Tag page with dependents', async ({ page }) => {
    const tagWithDependents = getTagWithDependents();
    await page.goto(`${hosts.ui}/image/${getImageName(tagWithDependents)}/tag/${tagWithDependents.tag}`);
    const layersTab = page.getByRole('tab', { name: layersTabRegex });
    await expect(layersTab).toBeVisible({ timeout: 100000 });
    await assertLayersPanelVisible(page, layersTab);
    await page.getByRole('tab', { name: 'Used by' }).click();
    await expect(page.getByTestId('dependents-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(page.getByText('Tag').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(await page.getByText('Tag').count()).toBeGreaterThan(0);
  });

  test('Tag page with dependencies', async ({ page }) => {
    const tagWithDependencies = getTagWithDependencies();
    await page.goto(`${hosts.ui}/image/${getImageName(tagWithDependencies)}/tag/${tagWithDependencies.tag}`);
    const layersTab = page.getByRole('tab', { name: layersTabRegex });
    await expect(layersTab).toBeVisible({ timeout: 100000 });
    await assertLayersPanelVisible(page, layersTab);

    await page.getByRole('tab', { name: 'Uses' }).click();
    await expect(page.getByTestId('depends-on-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(await page.getByText('Tag').count()).toBeGreaterThan(0);
  });

  test('Tag page with vulnerabilities', async ({ page }) => {
    const tagWithVulnerabilities = getTagWithVulnerabilities();
    await page.goto(`${hosts.ui}/image/${getImageName(tagWithVulnerabilities)}/tag/${tagWithVulnerabilities.tag}`);
    const vulnerabilityTab = page.getByRole('tab', { name: 'Vulnerabilities' });
    await expect(vulnerabilityTab).toBeVisible({ timeout: 100000 });
    await vulnerabilityTab.click();
    await expect(page.getByTestId('vulnerability-container').locator('div').nth(1)).toBeVisible({ timeout: 100000 });
    await expect(page.getByText(/CVE-/).nth(0)).toBeVisible({ timeout: 100000 });
    await expect(await page.getByText(/CVE-/).count()).toBeGreaterThan(0);
    await expect(await page.getByText(/CVE-/).count()).toBeLessThanOrEqual(pageSizes.EXPLORE);
  });
});
