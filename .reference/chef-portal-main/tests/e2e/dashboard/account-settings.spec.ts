import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Account Settings Page', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/account-settings', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="account-settings-heading"]', { timeout: 15000 })
  })

  test('loads page and password change dialog works', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/account-settings/)
    await expect(authenticatedPage.locator('[data-testid="account-settings-heading"]')).toBeVisible()

    // Open password dialog
    const changePasswordButton = authenticatedPage.locator('button:has-text("Change Password")')
    await expect(changePasswordButton).toBeVisible()
    await changePasswordButton.click()
    await authenticatedPage.waitForTimeout(500)

    const passwordInputs = authenticatedPage.locator('[role="dialog"] input[type="password"]')
    expect(await passwordInputs.count()).toBeGreaterThanOrEqual(2)
  })
})
