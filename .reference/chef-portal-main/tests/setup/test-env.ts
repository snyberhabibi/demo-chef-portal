import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Load test environment variables
 * Priority: existing env vars > .env.test > .env.test.local
 */
export function loadTestEnv(): void {
  const localEnvPath = path.resolve(process.cwd(), 'tests/.env.test.local')
  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath, override: false })
  }

  const testEnvPath = path.resolve(process.cwd(), 'tests/.env.test')
  if (fs.existsSync(testEnvPath)) {
    dotenv.config({ path: testEnvPath, override: false })
  }

  const rootTestEnvPath = path.resolve(process.cwd(), '.env.test')
  if (fs.existsSync(rootTestEnvPath)) {
    dotenv.config({ path: rootTestEnvPath, override: false })
  }
}

export function validateTestEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  if (!process.env.TEST_USER_EMAIL_0) missing.push('TEST_USER_EMAIL_0')
  if (!process.env.TEST_USER_PASSWORD_0) missing.push('TEST_USER_PASSWORD_0')

  return { valid: missing.length === 0, missing }
}

export function setupTestEnv(): void {
  loadTestEnv()
  const { valid, missing } = validateTestEnv()

  if (!valid) {
    console.error('\n❌ Missing required test environment variables:')
    console.error(missing.map((v) => `  - ${v}`).join('\n'))
    console.error('\nCreate a tests/.env.test file with these variables.\n')
    if (!process.env.CI) {
      throw new Error('Missing required test environment variables')
    }
  }
}

if (process.env.NODE_ENV === 'test') {
  loadTestEnv()
}
