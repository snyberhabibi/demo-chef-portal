import { Page, expect } from '@playwright/test'

/**
 * Wait for page to be fully loaded and hydrated
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to dashboard and wait for it to load
 */
export async function navigateToDashboard(page: Page): Promise<void> {
  await page.goto('/dashboard')
  await waitForPageReady(page)
}

/**
 * Navigate to a specific dashboard page
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await waitForPageReady(page)
}

/**
 * Click a sidebar navigation link by text
 */
export async function clickSidebarLink(page: Page, linkText: string): Promise<void> {
  const sidebar = page.locator('[data-sidebar]').first()
  const link = sidebar.locator(`a, button`).filter({ hasText: linkText }).first()
  try {
    await link.click()
  } catch (error) {
    throw new Error(`Failed to click sidebar link "${linkText}": ${(error as Error).message}`)
  }
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Search in a searchable list page
 */
export async function searchFor(page: Page, query: string): Promise<void> {
  const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first()
  await searchInput.fill(query)
  await expect(page.locator('text=/Search:/i').first()).toBeVisible({ timeout: 5000 })
}

/**
 * Wait for a toast notification
 */
export async function waitForToast(page: Page, textMatch?: string | RegExp): Promise<void> {
  const toastLocator = textMatch
    ? page.locator('[data-sonner-toast]').filter({ hasText: textMatch })
    : page.locator('[data-sonner-toast]').first()
  await toastLocator.waitFor({ state: 'visible', timeout: 10000 })
}

/**
 * Confirm a dialog (click the confirm/continue button)
 */
export async function confirmDialog(page: Page): Promise<void> {
  const dialog = page.locator('[role="alertdialog"], [role="dialog"]').last()
  await dialog.waitFor({ state: 'visible', timeout: 5000 })
  const confirmButton = dialog.locator('button').filter({ hasText: /confirm|continue|delete|yes|ok/i }).first()
  await confirmButton.click()
}

/**
 * Cancel a dialog
 */
export async function cancelDialog(page: Page): Promise<void> {
  const dialog = page.locator('[role="alertdialog"], [role="dialog"]').last()
  await dialog.waitFor({ state: 'visible', timeout: 5000 })
  const cancelButton = dialog.locator('button').filter({ hasText: /cancel|no|close/i }).first()
  await cancelButton.click()
}

/**
 * Select a value from a dropdown/select
 */
export async function selectOption(page: Page, triggerSelector: string, optionText: string): Promise<void> {
  await page.locator(triggerSelector).click()
  await expect(page.locator('[role="option"], [role="menuitem"]').first()).toBeVisible({ timeout: 5000 })
  await page.locator('[role="option"], [role="menuitem"]').filter({ hasText: optionText }).first().click()
}

/**
 * Check pagination exists and has items
 */
export async function hasPagination(page: Page): Promise<boolean> {
  const pagination = page.locator('nav[aria-label*="pagination"], [data-testid*="pagination"], button:has-text("Next")')
  return await pagination.first().isVisible().catch(() => false)
}
