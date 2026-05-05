import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Profile Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/profile', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="form-wizard-title"]', { timeout: 15000 })
  })

  test('loads page with all key elements', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/profile/)
    // Title shows the chef's business name (or "Chef Profile" as fallback)
    await expect(authenticatedPage.locator('[data-testid="form-wizard-title"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="profile-save-button"]')).toBeVisible()

    // Wizard steps visible
    await expect(authenticatedPage.locator('[data-testid="wizard-step-basic-info"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-about-you"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-cuisines"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-branding"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="wizard-step-operations"]')).toBeVisible()
  })

  test('wizard step navigation shows different content', async ({ authenticatedPage }) => {
    // Navigate to Operations step
    await authenticatedPage.locator('[data-testid="wizard-step-operations"]').click()
    await authenticatedPage.waitForTimeout(500)
    await expect(authenticatedPage.locator('label:has-text("Timezone")').first()).toBeVisible({ timeout: 5000 })

    // Navigate back to Basic Info step
    await authenticatedPage.locator('[data-testid="wizard-step-basic-info"]').click()
    await authenticatedPage.waitForTimeout(500)
  })

  test('save button enables on field modification', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('[data-testid="profile-save-button"]')).toBeDisabled()

    // Navigate to About You to access the bio field
    await authenticatedPage.locator('[data-testid="wizard-step-about-you"]').click()
    await authenticatedPage.waitForTimeout(500)

    const bioField = authenticatedPage.locator('input[name="bio"]')
    await bioField.fill('Modified bio')
    await expect(authenticatedPage.locator('[data-testid="profile-save-button"]')).toBeEnabled()
  })

  test('form fields are editable', async ({ authenticatedPage }) => {
    // Basic Info fields
    const businessName = authenticatedPage.locator('input[name="businessName"]')
    await businessName.fill('Test Business Name')
    await expect(businessName).toHaveValue('Test Business Name')

    // Navigate to About You for bio/story fields
    await authenticatedPage.locator('[data-testid="wizard-step-about-you"]').click()
    await authenticatedPage.waitForTimeout(500)

    const bio = authenticatedPage.locator('input[name="bio"]')
    await bio.fill('Test bio content')
    await expect(bio).toHaveValue('Test bio content')
  })

  test('dirty state persists across wizard steps', async ({ authenticatedPage }) => {
    // Navigate to About You and modify bio
    await authenticatedPage.locator('[data-testid="wizard-step-about-you"]').click()
    await authenticatedPage.waitForTimeout(500)

    await authenticatedPage.locator('input[name="bio"]').fill('Modified bio')
    await expect(authenticatedPage.locator('[data-testid="profile-save-button"]')).toBeEnabled()

    // Switch to operations and back
    await authenticatedPage.locator('[data-testid="wizard-step-operations"]').click()
    await authenticatedPage.waitForTimeout(300)
    await expect(authenticatedPage.locator('[data-testid="profile-save-button"]')).toBeEnabled()

    await authenticatedPage.locator('[data-testid="wizard-step-basic-info"]').click()
    await authenticatedPage.waitForTimeout(300)
    await expect(authenticatedPage.locator('[data-testid="profile-save-button"]')).toBeEnabled()
  })
})
