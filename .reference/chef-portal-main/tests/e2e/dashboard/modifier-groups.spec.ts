import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Modifier Groups Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/modifier-groups', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="modifier-groups-heading"]', { timeout: 15000 })
  })

  test('loads page with groups or empty state', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/modifier-groups/)
    await expect(authenticatedPage.locator('[data-testid="modifier-groups-heading"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="modifier-groups-create-button"]')).toBeVisible()

    const groups = authenticatedPage.locator('[class*="card"], [data-testid*="modifier"], tr, li')
    const emptyState = authenticatedPage.locator(':has-text("No modifier"), :has-text("no groups"), :has-text("Create your first")')

    const hasGroups = await groups.first().isVisible({ timeout: 2000 }).catch(() => false)
    const hasEmpty = await emptyState.first().isVisible({ timeout: 2000 }).catch(() => false)
    expect(hasGroups || hasEmpty).toBeTruthy()
  })

  test('create button navigates to form', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="modifier-groups-create-button"]').click()
    await authenticatedPage.waitForURL(/\/dashboard\/modifier-groups\/new/, { timeout: 10000 })
    await expect(authenticatedPage).toHaveURL(/\/modifier-groups\/new/)
  })
})
