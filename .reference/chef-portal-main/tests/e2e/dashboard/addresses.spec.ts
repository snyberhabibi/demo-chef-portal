import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Addresses Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/addresses', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="addresses-heading"]', { timeout: 15000 })
  })

  test('loads page with addresses or empty state', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/addresses/)
    await expect(authenticatedPage.locator('[data-testid="addresses-heading"]')).toBeVisible()

    const addresses = authenticatedPage.locator('[class*="card"], [data-testid*="address"], tr, li')
    const emptyState = authenticatedPage.locator(':has-text("No addresses"), :has-text("Add your"), :has-text("no address")')

    const hasAddresses = await addresses.first().isVisible({ timeout: 2000 }).catch(() => false)
    const hasEmpty = await emptyState.first().isVisible({ timeout: 2000 }).catch(() => false)
    expect(hasAddresses || hasEmpty).toBeTruthy()
  })
})
