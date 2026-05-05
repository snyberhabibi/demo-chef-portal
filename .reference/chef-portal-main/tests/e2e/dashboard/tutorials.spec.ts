import { test, expect } from '../../fixtures/auth/auth.fixture'

test.describe('Tutorials Hub', () => {
  test.describe.configure({ timeout: 60000 })

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/tutorials', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('[data-testid="tutorials-heading"]', { timeout: 15000 })
  })

  test('loads page with heading and progress', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/tutorials/)
    await expect(authenticatedPage.locator('[data-testid="tutorials-heading"]')).toHaveText('Tutorials')
    await expect(authenticatedPage.locator('[data-testid="tutorials-progress"]')).toBeVisible()
  })

  test('displays tutorial cards', async ({ authenticatedPage }) => {
    const cards = authenticatedPage.locator('[data-testid="tutorial-card"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('tutorial cards show title and description', async ({ authenticatedPage }) => {
    const firstCard = authenticatedPage.locator('[data-testid="tutorial-card"]').first()
    await expect(firstCard).toBeVisible()
    // Card should have text content
    const text = await firstCard.textContent()
    expect(text?.length).toBeGreaterThan(10)
  })

  test('clicking a tutorial card navigates to that tutorial', async ({ authenticatedPage }) => {
    // Click the first non-order tutorial card (order tutorial has a different URL)
    const cards = authenticatedPage.locator('[data-testid="tutorial-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Click second card (first might be "Managing Orders" which goes to /order-tutorial)
    const card = cards.nth(count > 1 ? 1 : 0)
    await card.click()

    await authenticatedPage.waitForURL(/\/dashboard\/tutorials\//, { timeout: 10000 })
    expect(authenticatedPage.url()).toMatch(/\/dashboard\/(tutorials\/|order-tutorial)/)
  })
})

test.describe('Individual Tutorial Pages', () => {
  test.describe.configure({ timeout: 60000 })

  const tutorialPaths = [
    '/dashboard/tutorials/dishes',
    '/dashboard/tutorials/bundles',
    '/dashboard/tutorials/modifiers',
    '/dashboard/tutorials/menus',
    '/dashboard/tutorials/profile',
    '/dashboard/tutorials/account',
    '/dashboard/tutorials/addresses',
  ]

  for (const path of tutorialPaths) {
    const name = path.split('/').pop()

    test(`${name} tutorial loads with start button and language selector`, async ({ authenticatedPage }) => {
      await authenticatedPage.goto(path, { waitUntil: 'networkidle' })

      // Landing page should have Start Tutorial button
      await expect(authenticatedPage.locator('button:has-text("Start Tutorial")')).toBeVisible({ timeout: 15000 })

      // Language selector should be visible
      await expect(authenticatedPage.locator('button:has-text("English")')).toBeVisible()
      await expect(authenticatedPage.locator('button:has-text("العربية")')).toBeVisible()
      await expect(authenticatedPage.locator('button:has-text("اردو")')).toBeVisible()
    })
  }

  test('order tutorial loads with start button and language selector', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/order-tutorial', { waitUntil: 'networkidle' })

    await expect(authenticatedPage.locator('button:has-text("Start Tutorial")')).toBeVisible({ timeout: 15000 })
    await expect(authenticatedPage.locator('button:has-text("English")')).toBeVisible()
    await expect(authenticatedPage.locator('button:has-text("العربية")')).toBeVisible()
  })

  test('starting a tutorial shows driver.js overlay', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/tutorials/dishes', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('button:has-text("Start Tutorial")', { timeout: 15000 })

    await authenticatedPage.locator('button:has-text("Start Tutorial")').click()

    // Driver.js overlay should appear
    await expect(authenticatedPage.locator('.driver-popover')).toBeVisible({ timeout: 5000 })

    // Exit Tutorial button should be visible
    await expect(authenticatedPage.locator('button:has-text("Exit Tutorial")')).toBeVisible()
    // Restart Tutorial button should be visible
    await expect(authenticatedPage.locator('button:has-text("Restart Tutorial")')).toBeVisible()
  })

  test('language selector persists selection', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/tutorials/modifiers', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('button:has-text("Start Tutorial")', { timeout: 15000 })

    // Select Arabic
    await authenticatedPage.locator('button:has-text("العربية")').click()

    // Navigate away and back
    await authenticatedPage.goto('/dashboard/tutorials/dishes', { waitUntil: 'networkidle' })
    await authenticatedPage.waitForSelector('button:has-text("Start Tutorial")', { timeout: 15000 })

    // Arabic should still be selected (persisted in localStorage)
    const arabicButton = authenticatedPage.locator('button:has-text("العربية")')
    // The selected button has the brand bg color
    await expect(arabicButton).toHaveClass(/text-white/)

    // Reset to English for other tests
    await authenticatedPage.locator('button:has-text("English")').click()
  })
})
