import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="dashboard-heading"]', { timeout: 15000 })
  })

  test('sidebar is visible with navigation links', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('[data-testid="app-sidebar"]')).toBeVisible()
  })

  test('navigates to all pages correctly', async ({ authenticatedPage }) => {
    test.setTimeout(120000) // 2 min for iterating all pages

    const pages = [
      { testId: 'sidebar-link-orders', url: '/dashboard/orders' },
      { testId: 'sidebar-link-dishes', url: '/dashboard/dishes' },
      { testId: 'sidebar-link-bundles', url: '/dashboard/bundles' },
      { testId: 'sidebar-link-custom-menu-sections', url: '/dashboard/custom-menu-sections' },
      { testId: 'sidebar-link-modifier-groups', url: '/dashboard/modifier-groups' },
      { testId: 'sidebar-link-address-management', url: '/dashboard/addresses' },
      { testId: 'sidebar-link-reviews', url: '/dashboard/reviews' },
      { testId: 'sidebar-link-tutorials', url: '/dashboard/tutorials' },
      { testId: 'sidebar-link-buy-packaging', url: '/dashboard/buy-packaging' },
      { testId: 'sidebar-link-portal-guide', url: '/dashboard/portal-guide' },
      { testId: 'sidebar-link-account-settings', url: '/dashboard/account-settings' },
      { testId: 'sidebar-link-profile', url: '/dashboard/profile' },
      { testId: 'sidebar-link-payment-methods', url: '/dashboard/payment-methods' },
    ]

    for (const { testId, url } of pages) {
      await authenticatedPage.goto('/dashboard', { waitUntil: 'domcontentloaded' })
      await authenticatedPage.waitForSelector('[data-testid="dashboard-heading"]', { timeout: 15000 })

      const link = authenticatedPage.locator(`[data-testid="${testId}"]`)
      await link.click()
      await authenticatedPage.waitForURL(new RegExp(url), { timeout: 10000 })
      await expect(authenticatedPage).toHaveURL(new RegExp(url))
    }
  })
})
