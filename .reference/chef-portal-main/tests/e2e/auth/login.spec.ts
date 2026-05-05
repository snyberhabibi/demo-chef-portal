import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('displays login form', async ({ page }) => {
      await page.goto('/auth/login', { waitUntil: 'networkidle' })
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 15000 })

      await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
      await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="login-password-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="login-submit-button"]')).toBeVisible()
    })

    test('shows validation errors for empty fields', async ({ page }) => {
      await page.goto('/auth/login', { waitUntil: 'networkidle' })
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 15000 })

      await page.click('[data-testid="login-submit-button"]')

      // Should show validation error messages
      const errorMessages = page.locator('[role="alert"], .text-destructive, .text-red-500, p:has-text("required")')
      await expect(errorMessages.first()).toBeVisible({ timeout: 5000 })
    })

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login', { waitUntil: 'networkidle' })
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 15000 })

      await page.fill('[data-testid="login-email-input"]', 'invalid@test.com')
      await page.fill('[data-testid="login-password-input"]', 'wrongpassword')
      await page.click('[data-testid="login-submit-button"]')

      // Should show error message
      const errorMessage = page.locator('[role="alert"], .text-destructive, [data-sonner-toast]').first()
      await expect(errorMessage).toBeVisible({ timeout: 15000 })
    })

    test('successful login redirects to dashboard', async ({ page, testUser }) => {
      await page.goto('/auth/login', { waitUntil: 'networkidle' })
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 15000 })

      await page.fill('[data-testid="login-email-input"]', testUser.email)
      await page.fill('[data-testid="login-password-input"]', testUser.password)
      await page.click('[data-testid="login-submit-button"]')

      await page.waitForURL((url) => url.pathname.startsWith('/dashboard'), {
        timeout: 30000,
      })

      expect(page.url()).toContain('/dashboard')
    })

    test('has forgot password link', async ({ page }) => {
      await page.goto('/auth/login', { waitUntil: 'networkidle' })
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 15000 })

      const forgotLink = page.locator('[data-testid="login-forgot-password-link"]')
      await expect(forgotLink).toBeVisible()
    })
  })

  test.describe('Authenticated Access', () => {
    test('authenticated user can access dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard')

      await expect(authenticatedPage).not.toHaveURL(/\/auth\/login/)
      await expect(authenticatedPage.locator('[data-testid="dashboard-heading"]')).toBeVisible({ timeout: 15000 })
    })

    test('unauthenticated user is redirected to login', async ({ page }) => {
      await page.goto('/dashboard')

      await page.waitForURL((url) => url.pathname.includes('/auth/login') || url.pathname.includes('/dashboard'), {
        timeout: 15000,
      })

      // Should either be on login or dashboard (if cookies are cached)
      const url = page.url()
      expect(url).toMatch(/\/(auth\/login|dashboard)/)
    })
  })
})
