import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Reviews Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/reviews', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="reviews-heading"]', { timeout: 15000 })
  })

  test('loads page with heading and tab filter', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/reviews/)
    await expect(authenticatedPage.locator('[data-testid="reviews-heading"]')).toHaveText('Reviews')
    await expect(authenticatedPage.locator('[data-testid="reviews-tab-filter"]')).toBeVisible()
  })

  test('tab filter shows chef, dishes, and bundles tabs', async ({ authenticatedPage }) => {
    const tabFilter = authenticatedPage.locator('[data-testid="reviews-tab-filter"]')
    await expect(tabFilter.locator('button').filter({ hasText: 'Chef Profile' })).toBeVisible()
    await expect(tabFilter.locator('button').filter({ hasText: 'Dishes' })).toBeVisible()
    await expect(tabFilter.locator('button').filter({ hasText: 'Bundles' })).toBeVisible()
  })

  test('chef tab shows rating summary or empty state', async ({ authenticatedPage }) => {
    // Chef tab is active by default
    const ratingSummary = authenticatedPage.locator('[data-testid="reviews-rating-summary"]')
    const emptyState = authenticatedPage.locator('[data-testid="reviews-empty-state"]')
    const skeleton = authenticatedPage.locator('.animate-pulse')

    // Wait for loading to finish
    await expect(ratingSummary.or(emptyState)).toBeVisible({ timeout: 15000 })
  })

  test('chef tab has sort dropdown when reviews exist', async ({ authenticatedPage }) => {
    const ratingSummary = authenticatedPage.locator('[data-testid="reviews-rating-summary"]')
    const hasReviews = await ratingSummary.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasReviews) {
      await expect(authenticatedPage.locator('[data-testid="reviews-sort"]')).toBeVisible()
    }
  })

  test('switching to dishes tab shows dish list', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="reviews-tab-filter"]')
      .locator('button').filter({ hasText: 'Dishes' }).click()

    // Should show target items (dish cards) or empty state
    const targetItems = authenticatedPage.locator('[data-testid="target-item"]').first()
    const emptyState = authenticatedPage.locator('text=/No dishes/i')
    const skeleton = authenticatedPage.locator('.animate-pulse').first()

    await expect(targetItems.or(emptyState)).toBeVisible({ timeout: 15000 })
  })

  test('switching to bundles tab shows bundle list', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="reviews-tab-filter"]')
      .locator('button').filter({ hasText: 'Bundles' }).click()

    const targetItems = authenticatedPage.locator('[data-testid="target-item"]').first()
    const emptyState = authenticatedPage.locator('text=/No bundles/i')

    await expect(targetItems.or(emptyState)).toBeVisible({ timeout: 15000 })
  })

  test('dish/bundle item expands to show reviews on click', async ({ authenticatedPage }) => {
    // Switch to dishes tab
    await authenticatedPage.locator('[data-testid="reviews-tab-filter"]')
      .locator('button').filter({ hasText: 'Dishes' }).click()

    const firstItem = authenticatedPage.locator('[data-testid="target-item"]').first()
    const hasItems = await firstItem.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasItems) {
      // Click to expand
      await firstItem.locator('button').click()
      // Should show reviews sort dropdown or empty state inside
      const reviewsContent = firstItem.locator('[data-testid="reviews-sort"]')
        .or(firstItem.locator('[data-testid="reviews-empty-state"]'))
        .or(firstItem.locator('.animate-pulse').first())
      await expect(reviewsContent).toBeVisible({ timeout: 10000 })
    }
  })
})
