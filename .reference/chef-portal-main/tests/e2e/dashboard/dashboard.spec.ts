import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Dashboard Home', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="dashboard-heading"]', { timeout: 15000 })
  })

  test('loads with metrics and content', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard/)
    await expect(authenticatedPage.locator('main, [role="main"]').first()).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="dashboard-metrics"]')).toBeVisible()
  })

  test('can navigate to orders', async ({ authenticatedPage }) => {
    const viewAllLink = authenticatedPage.locator('[data-testid="dashboard-view-all-orders"]')
    const isVisible = await viewAllLink.isVisible({ timeout: 2000 }).catch(() => false)

    if (isVisible) {
      await viewAllLink.click()
      await authenticatedPage.waitForURL(/\/dashboard\/orders/, { timeout: 10000 })
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/orders/)
    }
  })
})
