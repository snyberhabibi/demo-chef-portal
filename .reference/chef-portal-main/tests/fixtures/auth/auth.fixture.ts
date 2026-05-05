import { test as base, Page, BrowserContext } from '@playwright/test'
import { getTestUserForWorker, getStorageStatePath } from './test-users'

export interface AuthFixtures {
  authenticatedPage: Page
  authenticatedContext: BrowserContext
  testUser: { email: string; password: string; index: number }
}

export const test = base.extend<AuthFixtures>({
  testUser: async ({}, provide) => {
    const user = getTestUserForWorker(0)
    await provide(user)
  },

  authenticatedContext: async ({ browser, testUser }, provide) => {
    const storageStatePath = getStorageStatePath(0)

    let context: BrowserContext

    try {
      context = await browser.newContext({
        storageState: storageStatePath,
      })
    } catch {
      // Storage state doesn't exist, attempt login to create it
      context = await browser.newContext()
      const page = await context.newPage()

      try {
        await page.goto('/auth/login', { waitUntil: 'networkidle' })
        await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 30000 })

        await page.fill('[data-testid="login-email-input"]', testUser.email)
        await page.fill('[data-testid="login-password-input"]', testUser.password)
        await page.click('[data-testid="login-submit-button"]')

        await page.waitForURL((url) => url.pathname.startsWith('/dashboard'), {
          timeout: 30000,
        })

        await context.storageState({ path: storageStatePath })
      } catch {
        await page.close()
        await context.close()
        throw new Error(
          'Failed to authenticate test user. Ensure the dev server is running and test credentials are valid.'
        )
      }

      await page.close()
    }

    await provide(context)
    await context.close()
  },

  authenticatedPage: async ({ authenticatedContext }, provide) => {
    const page = await authenticatedContext.newPage()
    await provide(page)
    await page.close()
  },
})

export { expect } from '@playwright/test'
