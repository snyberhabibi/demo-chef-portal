import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Bundles Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/bundles', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="bundles-heading"]', { timeout: 15000 })
  })

  test('loads page with all key elements', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/bundles/)
    await expect(authenticatedPage.locator('[data-testid="bundles-heading"]')).toHaveText('Bundles')
    await expect(authenticatedPage.locator('[data-testid="bundles-create-button"]')).toContainText('Create Bundle')
    await expect(authenticatedPage.locator('[data-testid="bundles-search-input"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="bundles-status-filter"]')).toBeVisible()
  })

  test('search filters bundles and updates URL', async ({ authenticatedPage }) => {
    const searchInput = authenticatedPage.locator('[data-testid="bundles-search-input"]')
    await searchInput.fill('test')
    await expect(searchInput).toHaveValue('test')

    await expect(authenticatedPage).toHaveURL(/q=test/, { timeout: 5000 })

    await searchInput.clear()
    await expect(searchInput).toHaveValue('')
  })

  test('status filter pills work and update URL', async ({ authenticatedPage }) => {
    const statusFilter = authenticatedPage.locator('[data-testid="bundles-status-filter"]')
    await expect(statusFilter).toBeVisible()

    await statusFilter.locator('button').filter({ hasText: 'Draft' }).click()
    await expect(authenticatedPage).toHaveURL(/status=draft/, { timeout: 5000 })

    await statusFilter.locator('button').filter({ hasText: 'All' }).click()
    await authenticatedPage.waitForTimeout(500)
    expect(authenticatedPage.url()).not.toContain('status=')
  })

  test('displays bundle cards or empty state', async ({ authenticatedPage }) => {
    const bundleCards = authenticatedPage.locator('[data-testid*="bundle-card"], [class*="card"]').first()
    const emptyState = authenticatedPage.locator(':has-text("No bundles"), :has-text("no results"), :has-text("Create your first")')

    const hasCards = await bundleCards.isVisible({ timeout: 2000 }).catch(() => false)
    const hasEmpty = await emptyState.first().isVisible({ timeout: 2000 }).catch(() => false)
    expect(hasCards || hasEmpty).toBeTruthy()
  })

  test('create button navigates to new bundle form', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="bundles-create-button"]').click()
    await authenticatedPage.waitForURL(/\/dashboard\/bundles\/new/, { timeout: 15000 })
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/bundles\/new/)
  })
})

test.describe('Create Bundle Form', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/bundles/new', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="form-wizard-title"]', { timeout: 15000 })
  })

  test('form loads with wizard steps and key fields', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/bundles\/new/)
    await expect(authenticatedPage.locator('[data-testid="form-wizard-title"]')).toContainText('Create New Bundle')

    // Wizard steps visible
    await expect(authenticatedPage.locator('[data-testid="wizard-step-details"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-media"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-items"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-specs"]')).toBeVisible()

    // Key form fields
    await expect(authenticatedPage.locator('input#bundle-name')).toBeVisible()
    await expect(authenticatedPage.locator('textarea#bundle-description')).toBeVisible()
  })

  test('can fill bundle details', async ({ authenticatedPage }) => {
    const nameInput = authenticatedPage.locator('input#bundle-name')
    await nameInput.fill('Test Bundle Name')
    await expect(nameInput).toHaveValue('Test Bundle Name')

    const descInput = authenticatedPage.locator('textarea#bundle-description')
    await descInput.fill('This is a test bundle description')
    await expect(descInput).toHaveValue('This is a test bundle description')
  })

  test('wizard step navigation works', async ({ authenticatedPage }) => {
    const steps = ['media', 'items', 'specs']
    for (const step of steps) {
      await authenticatedPage.locator(`[data-testid="wizard-step-${step}"]`).click()
      await authenticatedPage.waitForTimeout(300)
      await expect(authenticatedPage.locator(`[data-testid="wizard-step-${step}"]`)).toBeVisible()
    }
  })

  test('form validation shows errors on empty submit', async ({ authenticatedPage }) => {
    const saveButton = authenticatedPage.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first()
    await saveButton.click()

    const errors = authenticatedPage.locator('[data-sonner-toast], .text-destructive:not(.invisible), [role="alert"]')
    await expect(errors.first()).toBeVisible({ timeout: 5000 })
  })

  // TODO: Re-enable when shipping feature is ready
  test.skip('shipping section toggle reveals fields', async () => {})
})
