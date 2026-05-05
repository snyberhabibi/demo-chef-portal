import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Session Timeout Handling', () => {
  test.describe('401 Retry Interceptor', () => {
    test('transparently recovers from a single 401 response', async ({ authenticatedPage }) => {
      let requestCount = 0

      // Intercept API calls: fail the first one with 401, then let subsequent ones through
      await authenticatedPage.route('**/api/v1/**', async (route) => {
        requestCount++
        if (requestCount === 1) {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'UnAuthenticated' }),
          })
        } else {
          await route.continue()
        }
      })

      await authenticatedPage.goto('/dashboard', { waitUntil: 'networkidle' })

      // Dashboard should still load successfully after the retry
      const heading = authenticatedPage.locator('[data-testid="dashboard-heading"]')
      await expect(heading).toBeVisible({ timeout: 15000 })

      // No error toast should be visible
      const errorToast = authenticatedPage.locator('[data-sonner-toast][data-type="error"]')
      const hasErrorToast = await errorToast.isVisible().catch(() => false)
      expect(hasErrorToast).toBe(false)
    })

    test('redirects to login when session is fully expired', async ({ authenticatedPage }) => {
      // Intercept ALL API calls with 401 (simulating a truly expired session)
      await authenticatedPage.route('**/api/v1/**', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'UnAuthenticated' }),
        })
      })

      await authenticatedPage.goto('/dashboard', { waitUntil: 'commit' })

      // User should eventually be redirected to the login page
      await authenticatedPage.waitForURL(/\/auth\/login/, { timeout: 30000 })
      expect(authenticatedPage.url()).toContain('/auth/login')
    })
  })

  test.describe('Session Keep-Alive', () => {
    test('fires server action on visibility change after delay', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard', { waitUntil: 'networkidle' })
      await authenticatedPage.waitForSelector('[data-testid="dashboard-heading"]', { timeout: 15000 })

      // Set up a promise to detect a server action call (POST with Next-Action header)
      const serverActionPromise = authenticatedPage.waitForRequest(
        (request) =>
          request.method() === 'POST' &&
          request.headers()['next-action'] !== undefined,
        { timeout: 10000 }
      )

      // Simulate tab being hidden for >2 minutes then becoming visible again
      // We manipulate lastRefreshRef indirectly by moving time forward
      await authenticatedPage.evaluate(() => {
        // Simulate the tab having been hidden long enough (>2 min debounce)
        // First set visibility to hidden
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
          configurable: true,
        })
        document.dispatchEvent(new Event('visibilitychange'))

        // Move time forward by faking the elapsed check:
        // The hook uses Date.now() - lastRefreshRef.current > 2 * 60 * 1000
        // We can't access the ref, so instead we wait and set visible.
        // Alternative: override Date.now temporarily
        const realDateNow = Date.now
        const fakeTime = realDateNow() + 3 * 60 * 1000 // 3 minutes ahead
        Date.now = () => fakeTime

        // Now simulate tab becoming visible
        Object.defineProperty(document, 'visibilityState', {
          value: 'visible',
          writable: true,
          configurable: true,
        })
        document.dispatchEvent(new Event('visibilitychange'))

        // Restore Date.now
        Date.now = realDateNow
      })

      // Verify a server action request was triggered
      const request = await serverActionPromise
      expect(request.method()).toBe('POST')
      expect(request.headers()['next-action']).toBeDefined()
    })
  })
})
