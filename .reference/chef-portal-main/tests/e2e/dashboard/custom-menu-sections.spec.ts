import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Custom Menu Sections Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/custom-menu-sections', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="custom-menu-sections-heading"]', { timeout: 15000 })
  })

  test('loads page with sections or empty state', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/custom-menu-sections/)
    await expect(authenticatedPage.locator('[data-testid="custom-menu-sections-heading"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="custom-menu-sections-create-button"]')).toBeVisible()

    const sections = authenticatedPage.locator('[class*="card"], [data-testid*="section"], tr, li')
    const emptyState = authenticatedPage.locator(':has-text("No custom"), :has-text("no sections"), :has-text("Create your first")')

    const hasSections = await sections.first().isVisible({ timeout: 2000 }).catch(() => false)
    const hasEmpty = await emptyState.first().isVisible({ timeout: 2000 }).catch(() => false)
    expect(hasSections || hasEmpty).toBeTruthy()
  })

  test('create button navigates to form', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="custom-menu-sections-create-button"]').click()
    await authenticatedPage.waitForURL(/\/dashboard\/custom-menu-sections\/new/, { timeout: 10000 })
    await expect(authenticatedPage).toHaveURL(/\/custom-menu-sections\/new/)
  })
})
