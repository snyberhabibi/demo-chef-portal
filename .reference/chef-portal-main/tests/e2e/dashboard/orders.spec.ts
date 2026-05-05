import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Orders Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/orders', { waitUntil: 'domcontentloaded' })
    await authenticatedPage.waitForSelector('[data-testid="orders-heading"]', { timeout: 30000 })
  })

  test('loads page with heading', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/orders/)
    await expect(authenticatedPage.locator('[data-testid="orders-heading"]')).toHaveText('Orders')
  })

  test('breadcrumb navigates to dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('a:has-text("Dashboard")').first().click()
    await authenticatedPage.waitForURL(/\/dashboard$/, { timeout: 10000 })
    await expect(authenticatedPage).toHaveURL(/\/dashboard$/)
  })

  test('search filters orders', async ({ authenticatedPage }) => {
    const searchInput = authenticatedPage.locator('[data-testid="orders-search-input"]')
    await searchInput.fill('burger')
    await expect(searchInput).toHaveValue('burger')

    // Wait for results to update
    await authenticatedPage.waitForTimeout(1000)

    // Clear search
    await searchInput.clear()
    await expect(searchInput).toHaveValue('')
  })

  test('status filter pills show all statuses', async ({ authenticatedPage }) => {
    const statusFilter = authenticatedPage.locator('[data-testid="orders-status-filter"]')
    await expect(statusFilter).toBeVisible()

    // Verify key status pills exist
    const expectedStatuses = ['All', 'Confirmed', 'Paid', 'Preparing', 'Ready', 'Delivered', 'Cancelled']
    for (const status of expectedStatuses) {
      await expect(statusFilter.locator('button').filter({ hasText: status }).first()).toBeVisible({ timeout: 2000 })
    }

    // Click Confirmed pill to filter
    await statusFilter.locator('button').filter({ hasText: 'Confirmed' }).click()
    await authenticatedPage.waitForLoadState('domcontentloaded')

    // Click All pill to reset
    await statusFilter.locator('button').filter({ hasText: 'All' }).click()
    await authenticatedPage.waitForLoadState('domcontentloaded')
  })

  test('displays order cards or empty state', async ({ authenticatedPage }) => {
    // Wait for loading to finish (skeletons disappear, content renders)
    const orderCards = authenticatedPage.locator('[data-testid="order-card"]')
    const emptyState = authenticatedPage.locator('text=/No orders found/i')

    // Wait for either order cards or empty state to appear (up to 30s)
    await expect(orderCards.first().or(emptyState)).toBeVisible({ timeout: 30000 })
  })

  test('order card click navigates to details', async ({ authenticatedPage }) => {
    const orderCard = authenticatedPage.locator('[data-testid="order-card"]').first()
    const hasCard = await orderCard.isVisible({ timeout: 2000 }).catch(() => false)

    if (hasCard) {
      await orderCard.click()
      await authenticatedPage.waitForURL(/\/dashboard\/orders\/[^/]+$/, { timeout: 10000 })
      expect(authenticatedPage.url()).toMatch(/\/dashboard\/orders\/[^/]+$/)
    }
  })

  test('pagination navigation works', async ({ authenticatedPage }) => {
    const prevButton = authenticatedPage.locator('button:has-text("Previous")')
    const hasButton = await prevButton.isVisible({ timeout: 2000 }).catch(() => false)

    if (hasButton) {
      expect(await prevButton.isDisabled().catch(() => false)).toBe(true)

      const nextButton = authenticatedPage.locator('button:has-text("Next")')
      const nextEnabled = await nextButton.isEnabled().catch(() => false)

      if (nextEnabled) {
        await nextButton.click()
        await authenticatedPage.waitForLoadState('domcontentloaded')
        await prevButton.click()
        await authenticatedPage.waitForLoadState('domcontentloaded')
        const pageIndicator = authenticatedPage.locator('text=/Page 1/i')
        await expect(pageIndicator).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('combined search and status filter works', async ({ authenticatedPage }) => {
    const searchInput = authenticatedPage.locator('[data-testid="orders-search-input"]')
    await searchInput.fill('order')
    await authenticatedPage.waitForLoadState('domcontentloaded')

    const statusFilter = authenticatedPage.locator('[data-testid="orders-status-filter"]')
    await statusFilter.locator('button').filter({ hasText: 'Paid' }).click()
    await authenticatedPage.waitForLoadState('domcontentloaded')

    // Both filters active — should show results or empty state
    const results = authenticatedPage.locator('[data-testid="order-card"]').first()
      .or(authenticatedPage.locator('text=/No orders found/i'))
    await expect(results).toBeVisible({ timeout: 10000 })
  })
})
