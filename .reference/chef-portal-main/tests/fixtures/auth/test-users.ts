export interface TestUser {
  email: string
  password: string
  index: number
}

function getTestUser(index: number): TestUser {
  const email = process.env[`TEST_USER_EMAIL_${index}`]
  const password = process.env[`TEST_USER_PASSWORD_${index}`]

  if (!email || !password) {
    throw new Error(
      `Missing test user credentials for index ${index}. ` +
        `Set TEST_USER_EMAIL_${index} and TEST_USER_PASSWORD_${index} environment variables.`
    )
  }

  return { email, password, index }
}

export function getAllTestUsers(): TestUser[] {
  return [0].map(getTestUser)
}

export function getTestUserForWorker(_workerIndex: number = 0): TestUser {
  return getTestUser(0)
}

export function getStorageStatePath(_workerIndex: number = 0): string {
  return `tests/fixtures/auth/storage-state/worker-0.json`
}

export function validateTestUsers(): void {
  const missingVars: string[] = []

  if (!process.env.TEST_USER_EMAIL_0) missingVars.push('TEST_USER_EMAIL_0')
  if (!process.env.TEST_USER_PASSWORD_0) missingVars.push('TEST_USER_PASSWORD_0')

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required test user environment variables:\n${missingVars.join('\n')}\n\n` +
        'Create a .env.test file or set these in CI secrets.'
    )
  }
}
