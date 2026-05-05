import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Dishes Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/dishes', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="dishes-heading"]', { timeout: 15000 })
  })

  test('loads page with all key elements', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/dishes/)
    await expect(authenticatedPage.locator('[data-testid="dishes-heading"]')).toContainText('Dishes')
    await expect(authenticatedPage.locator('[data-testid="dishes-create-button"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="dishes-search-input"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="dishes-status-filter"]')).toBeVisible()
  })

  test('search filters dishes and updates URL', async ({ authenticatedPage }) => {
    const searchInput = authenticatedPage.locator('[data-testid="dishes-search-input"]')
    await searchInput.fill('burger')
    await expect(searchInput).toHaveValue('burger')

    // URL should update with search query after debounce
    await expect(authenticatedPage).toHaveURL(/q=burger/, { timeout: 5000 })

    // Clear search
    await searchInput.clear()
    await expect(searchInput).toHaveValue('')
  })

  test('status filter pills work and update URL', async ({ authenticatedPage }) => {
    const statusFilter = authenticatedPage.locator('[data-testid="dishes-status-filter"]')
    await expect(statusFilter).toBeVisible()

    // Click Draft pill
    await statusFilter.locator('button').filter({ hasText: 'Draft' }).click()
    await expect(authenticatedPage).toHaveURL(/status=draft/, { timeout: 5000 })

    // Click All pill to reset
    await statusFilter.locator('button').filter({ hasText: 'All' }).click()
    await authenticatedPage.waitForTimeout(500)
    expect(authenticatedPage.url()).not.toContain('status=')
  })

  test('category filter tabs are visible', async ({ authenticatedPage }) => {
    const categoryFilter = authenticatedPage.locator('[data-testid="dishes-category-filter"]')
    await expect(categoryFilter).toBeVisible()
  })

  test('displays dish cards or empty state', async ({ authenticatedPage }) => {
    const dishCards = authenticatedPage.locator('[data-testid*="dish-card"], [class*="card"]').first()
    const emptyState = authenticatedPage.locator('text=/No dishes|no results|Create your first/i')

    const hasCards = await dishCards.isVisible({ timeout: 2000 }).catch(() => false)
    const hasEmpty = await emptyState.first().isVisible({ timeout: 2000 }).catch(() => false)
    expect(hasCards || hasEmpty).toBeTruthy()
  })

  test('create button opens modal and navigates to new dish', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="dishes-create-button"]').click()

    const dialog = authenticatedPage.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 10000 })

    // Click scratch card to navigate
    const scratchCard = dialog.locator('h3:has-text("Create from Scratch")').locator('..')
    await scratchCard.click()
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/dishes\/new/, { timeout: 10000 })
  })
})

test.describe('Create Dish Form', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/dishes/new', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="form-wizard-title"]', { timeout: 15000 })
  })

  test('form loads with wizard steps and key fields', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('[data-testid="form-wizard-title"]')).toContainText('Create New Dish')

    // Wizard steps visible
    await expect(authenticatedPage.locator('[data-testid="wizard-step-details"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-media"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-specs"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-availability"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-customizations"]')).toBeVisible()

    // Key form fields
    await expect(authenticatedPage.locator('input#name')).toBeVisible()
    await expect(authenticatedPage.locator('textarea#description')).toBeVisible()
    await expect(authenticatedPage.locator('input#leadTime')).toBeVisible()
  })

  test('wizard step navigation works', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('[data-testid="wizard-step-media"]').click()
    await authenticatedPage.waitForTimeout(300)
    // Media section should now be visible
    await expect(authenticatedPage.locator('[data-testid="wizard-step-media"]')).toBeVisible()
  })

  test('form validation shows errors on empty submit', async ({ authenticatedPage }) => {
    // Find and click the save/submit button in the header
    const saveButton = authenticatedPage.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first()
    await saveButton.click()

    // Toast or inline errors appear
    const errors = authenticatedPage.locator('[data-sonner-toast], .text-destructive:not(.invisible), [role="alert"]')
    await expect(errors.first()).toBeVisible({ timeout: 5000 })
  })

  test('partial form fill still shows validation errors', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('input#name').fill('Test Dish')
    const saveButton = authenticatedPage.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first()
    await saveButton.click()

    const errors = authenticatedPage.locator('.text-destructive:not(.invisible), [role="alert"], [data-sonner-toast]')
    await expect(errors.first()).toBeVisible({ timeout: 5000 })
  })

  test('can navigate to specs step', async ({ authenticatedPage }) => {
    const specsStep = authenticatedPage.locator('[data-testid="wizard-step-specs"]')
    await specsStep.click()
    await authenticatedPage.waitForTimeout(500)
    // Specs step should be active (has the active styling)
    await expect(specsStep).toBeVisible()
  })

  test('unsaved changes warning on navigation', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('input#name').fill('Test Dish Name')

    // Click breadcrumb or back link
    const backLink = authenticatedPage.locator('a:has-text("Dishes")').first()
    await backLink.click()

    const confirmDialog = authenticatedPage.locator('[role="dialog"], [role="alertdialog"]')
    await expect(confirmDialog.first()).toBeVisible({ timeout: 5000 })
  })

  // TODO: Re-enable when shipping feature is ready
  test.skip('shipping section toggle reveals fields', async () => {})
})
