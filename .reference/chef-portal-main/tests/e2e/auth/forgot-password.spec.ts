import { test, expect } from '@playwright/test'

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password', { waitUntil: 'networkidle' })
    await page.waitForSelector('[data-testid="forgot-password-email-input"]', { timeout: 15000 })
  })

  test('displays forgot password form', async ({ page }) => {
    await expect(page.locator('[data-testid="forgot-password-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="forgot-password-email-input"]')).toBeVisible()
  })

  test('shows validation error for empty email', async ({ page }) => {
    // Remove HTML5 validation to allow form submission with empty email
    await page.evaluate(() => {
      const form = document.querySelector('[data-testid="forgot-password-form"]') as HTMLFormElement
      if (form) form.noValidate = true
    })

    await page.click('[data-testid="forgot-password-submit-button"]')

    // Wait for react-hook-form validation error to appear
    const errorMessage = page.locator('p.text-destructive:has-text("Invalid email address")')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('shows validation error for invalid email format', async ({ page }) => {
    // Remove HTML5 validation to allow form submission and trigger zod validation
    await page.evaluate(() => {
      const form = document.querySelector('[data-testid="forgot-password-form"]') as HTMLFormElement
      if (form) form.noValidate = true
      // Also remove type="email" to prevent browser-level validation blocking fill
      const emailInput = document.querySelector('[data-testid="forgot-password-email-input"]') as HTMLInputElement
      if (emailInput) emailInput.type = 'text'
    })

    await page.fill('[data-testid="forgot-password-email-input"]', 'not-an-email')
    await page.click('[data-testid="forgot-password-submit-button"]')

    // The error <p> has text-destructive class and invisible class is removed when error is shown
    const errorMessage = page.locator('p.text-destructive:not(.invisible)')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('submits reset request for valid email', async ({ page }) => {
    await page.fill('[data-testid="forgot-password-email-input"]', 'demo.chef@gmail.com')
    await page.click('[data-testid="forgot-password-submit-button"]')

    // Should show success message or redirect
    const successIndicator = page.locator('[data-sonner-toast], :has-text("sent"), :has-text("check your email"), :has-text("success")')
    await expect(successIndicator.first()).toBeVisible({ timeout: 15000 })
  })

  test('has link back to login', async ({ page }) => {
    const loginLink = page.locator('[data-testid="forgot-password-back-to-login"]')
    await expect(loginLink).toBeVisible()
  })
})
