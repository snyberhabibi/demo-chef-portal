import { chromium, FullConfig } from '@playwright/test'
import { setupTestEnv } from './test-env'
import { getAllTestUsers, getStorageStatePath, validateTestUsers } from '../fixtures/auth/test-users'
import * as fs from 'fs'
import * as path from 'path'

async function globalSetup(config: FullConfig): Promise<void> {
  setupTestEnv()

  try {
    validateTestUsers()
  } catch (error) {
    console.error('\n❌ Test user validation failed:')
    console.error((error as Error).message)
    console.error('\nSkipping pre-authentication. Tests will authenticate on-demand.\n')
    return
  }

  const testUsers = getAllTestUsers()
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000'

  console.log(`\n🔐 Pre-authenticating ${testUsers.length} test users...`)

  const storageDir = path.resolve(process.cwd(), 'tests/fixtures/auth/storage-state')
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }

  const browser = await chromium.launch()

  for (const user of testUsers) {
    const storageStatePath = getStorageStatePath(user.index)
    const absolutePath = path.resolve(process.cwd(), storageStatePath)

    if (fs.existsSync(absolutePath)) {
      const stats = fs.statSync(absolutePath)
      const ageMs = Date.now() - stats.mtimeMs
      const oneHourMs = 60 * 60 * 1000

      if (ageMs < oneHourMs) {
        console.log(`  ✓ User ${user.index} (${user.email}) - using cached state`)
        continue
      }
    }

    console.log(`  → Authenticating user ${user.index} (${user.email})...`)

    const maxAttempts = 3
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const context = await browser.newContext()
      const page = await context.newPage()

      try {
        await page.goto(`${baseURL}/auth/login`, { waitUntil: 'networkidle' })
        // Wait for React hydration - inputs appear after client components render
        await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 30000 })

        // Fill in credentials - chef portal uses email and password fields
        await page.fill('[data-testid="login-email-input"]', user.email)
        await page.fill('[data-testid="login-password-input"]', user.password)

        await page.click('[data-testid="login-submit-button"]')

        // Wait for redirect to dashboard
        await page.waitForURL((url) => url.pathname.startsWith('/dashboard'), {
          timeout: 30000,
        })

        await context.storageState({ path: absolutePath })
        console.log(`  ✓ User ${user.index} authenticated`)
        lastError = undefined
        break
      } catch (error) {
        lastError = error as Error
        console.warn(`  ⚠ Attempt ${attempt}/${maxAttempts} failed for user ${user.index}: ${lastError.message}`)
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } finally {
        await page.close()
        await context.close()
      }
    }

    if (lastError) {
      console.error(`  ✗ Failed to authenticate user ${user.index} after ${maxAttempts} attempts:`, lastError.message)
    }
  }

  await browser.close()
  console.log('🔐 Pre-authentication complete\n')
}

export default globalSetup
