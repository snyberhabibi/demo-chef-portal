import { test, expect } from '../../fixtures/auth/auth.fixture'
import { type Page } from '@playwright/test'

test.describe('Order Details Page', () => {
  test.describe.configure({ timeout: 60000 })

  const navigateToFirstOrder = async (page: Page) => {
    await page.goto('/dashboard/orders', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="orders-heading"]', { timeout: 30000 })
    const orderCard = page.locator('[data-testid="order-card"]').first()
    await expect(orderCard).toBeVisible({ timeout: 30000 })
    await orderCard.click()
    await page.waitForURL(/\/dashboard\/orders\//, { timeout: 30000 })
    await page.waitForSelector('[data-testid="order-detail-heading"]', { timeout: 30000 })
  }

  const findOrderWithStatus = async (page: Page, targetStatus: string): Promise<boolean> => {
    await page.goto('/dashboard/orders', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="orders-heading"]', { timeout: 30000 })
    const orderCards = page.locator('[data-testid="order-card"]')
    const count = await orderCards.count()

    for (let i = 0; i < Math.min(count, 8); i++) {
      await orderCards.nth(i).click()
      await page.waitForURL(/\/dashboard\/orders\//, { timeout: 30000 })
      await page.waitForSelector('[data-testid="order-detail-heading"]', { timeout: 30000 })

      const badge = page.locator('[data-testid="order-status-badge"]')
      const status = await badge.getAttribute('data-status')
      if (status === targetStatus) {
        return true
      }

      await page.goBack({ waitUntil: 'domcontentloaded' })
      await page.waitForSelector('[data-testid="orders-heading"]', { timeout: 30000 })
    }
    return false
  }

  const findOrderWithAction = async (page: Page, actionTestId: string): Promise<boolean> => {
    await page.goto('/dashboard/orders', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="orders-heading"]', { timeout: 30000 })
    const orderCards = page.locator('[data-testid="order-card"]')
    const count = await orderCards.count()

    for (let i = 0; i < Math.min(count, 8); i++) {
      await orderCards.nth(i).click()
      await page.waitForURL(/\/dashboard\/orders\//, { timeout: 30000 })
      await page.waitForSelector('[data-testid="order-detail-heading"]', { timeout: 30000 })

      const targetBtn = page.locator(`[data-testid="${actionTestId}"]`)
      if (await targetBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        return true
      }

      await page.goBack({ waitUntil: 'domcontentloaded' })
      await page.waitForSelector('[data-testid="orders-heading"]', { timeout: 30000 })
    }
    return false
  }

  test('displays order detail with all sections', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)

    // Heading with order number
    const heading = authenticatedPage.locator('[data-testid="order-detail-heading"]')
    await expect(heading).toBeVisible()
    expect(await heading.textContent()).toMatch(/Order #/)

    // Status badge
    const badge = authenticatedPage.locator('[data-testid="order-status-badge"]')
    await expect(badge).toBeVisible()
    const status = await badge.getAttribute('data-status')
    expect(['paid', 'confirmed', 'preparing', 'ready', 'readyForPickup', 'outForDelivery', 'delivered', 'pickedUp', 'cancelled', 'rejected', 'rescheduling']).toContain(status)

    // All major sections
    await expect(authenticatedPage.locator('[data-testid="order-header"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="order-items-list"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="order-customer-details"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="order-activity-timeline"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="order-summary"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="print-label-button"]')).toBeVisible()
  })

  test('back link navigates to orders list', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)
    await authenticatedPage.locator('a[href="/dashboard/orders"]').first().click()
    await authenticatedPage.waitForURL(/\/dashboard\/orders$/, { timeout: 10000 })
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/orders$/)
  })

  test('order items show quantity and price', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)

    const itemsList = authenticatedPage.locator('[data-testid="order-items-list"]')
    await expect(itemsList.locator('text=Ordered items')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="order-total-units"]')).toBeVisible()

    // Items show qty labels and prices
    expect(await itemsList.locator('text=/qty/i').count()).toBeGreaterThanOrEqual(1)
    expect(await itemsList.locator('text=/\\$\\d+\\.\\d{2}/').count()).toBeGreaterThanOrEqual(1)
  })

  test('customer details show name', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)
    const customerName = authenticatedPage.locator('[data-testid="customer-name"]')
    await expect(customerName).toBeVisible()
    expect((await customerName.textContent())!.trim().length).toBeGreaterThan(0)
  })

  test('order summary shows total', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)
    const total = authenticatedPage.locator('[data-testid="order-total"]')
    await expect(total).toBeVisible()
    expect(await total.textContent()).toMatch(/\$\d+\.\d{2}/)
  })

  test('action buttons match order status', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)

    const badge = authenticatedPage.locator('[data-testid="order-status-badge"]')
    const status = await badge.getAttribute('data-status')

    if (status === 'paid') {
      await expect(authenticatedPage.locator('[data-testid="order-action-confirm"]')).toBeVisible()
      await expect(authenticatedPage.locator('[data-testid="order-action-reschedule"]')).toBeVisible()
      await expect(authenticatedPage.locator('[data-testid="order-action-reject"]')).toBeVisible()
    } else if (status === 'confirmed') {
      await expect(authenticatedPage.locator('[data-testid="order-action-start_preparing"]')).toBeVisible()
      await expect(authenticatedPage.locator('[data-testid="order-action-reschedule"]')).toBeVisible()
      await expect(authenticatedPage.locator('[data-testid="order-action-cancel"]')).toBeVisible()
    } else if (status === 'preparing') {
      await expect(authenticatedPage.locator('[data-testid="order-action-mark_ready"]')).toBeVisible()
      await expect(authenticatedPage.locator('[data-testid="order-action-cancel"]')).toBeVisible()
    } else if (status === 'readyForPickup') {
      // chefPickup orders show "Mark as Picked Up", yallaSpot orders show empty
      const markPickedUpBtn = authenticatedPage.locator('[data-testid="order-action-mark_picked_up"]')
      const emptyActions = authenticatedPage.locator('[data-testid="chef-order-actions-empty"]')
      await expect(markPickedUpBtn.or(emptyActions)).toBeAttached({ timeout: 5000 })
    } else if (['ready', 'delivered', 'pickedUp', 'cancelled', 'rejected', 'outForDelivery'].includes(status!)) {
      await expect(authenticatedPage.locator('[data-testid="chef-order-actions-empty"]')).toBeAttached()
    }
  })

  test('confirmation dialog flow for primary action', async ({ authenticatedPage }) => {
    await navigateToFirstOrder(authenticatedPage)

    const badge = authenticatedPage.locator('[data-testid="order-status-badge"]')
    const status = await badge.getAttribute('data-status')

    let primaryTestId = ''
    if (status === 'paid') primaryTestId = 'order-action-confirm'
    else if (status === 'confirmed') primaryTestId = 'order-action-start_preparing'
    else if (status === 'preparing') primaryTestId = 'order-action-mark_ready'
    else if (status === 'readyForPickup') primaryTestId = 'order-action-mark_picked_up'

    if (!primaryTestId) { test.skip(); return }

    await authenticatedPage.locator(`[data-testid="${primaryTestId}"]`).click()

    const dialog = authenticatedPage.locator('[data-testid="confirmation-dialog"]')
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await expect(authenticatedPage.locator('[data-testid="confirmation-confirm"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="confirmation-cancel"]')).toBeVisible()

    // Cancel closes dialog
    await authenticatedPage.locator('[data-testid="confirmation-cancel"]').click()
    await expect(dialog).not.toBeVisible()
  })

  test('cancel order modal flow', async ({ authenticatedPage }) => {
    const found = await findOrderWithAction(authenticatedPage, 'order-cancel-button')
    if (!found) { test.skip(); return }

    await authenticatedPage.locator('[data-testid="order-cancel-button"]').click()

    const modal = authenticatedPage.locator('[data-testid="cancel-order-modal"]')
    await expect(modal).toBeVisible({ timeout: 5000 })
    await expect(modal.getByRole('heading', { name: 'Cancel Order' })).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="cancel-reason-textarea"]')).toBeVisible()

    // Submit disabled without reason
    const submitButton = authenticatedPage.locator('[data-testid="cancel-modal-submit"]')
    await expect(submitButton).toBeDisabled()

    // Enabled with reason
    await authenticatedPage.locator('[data-testid="cancel-reason-textarea"]').fill('Testing cancellation reason')
    await expect(submitButton).toBeEnabled()

    // Go Back closes modal
    await authenticatedPage.locator('[data-testid="cancel-modal-go-back"]').click()
    await expect(modal).not.toBeVisible()
  })

  test('reject action opens confirmation then reason modal', async ({ authenticatedPage }) => {
    const found = await findOrderWithAction(authenticatedPage, 'order-action-reject')
    if (!found) { test.skip(); return }

    await authenticatedPage.locator('[data-testid="order-action-reject"]').click()

    // Confirmation first
    const confirmDialog = authenticatedPage.locator('[data-testid="confirmation-dialog"]')
    await expect(confirmDialog).toBeVisible({ timeout: 5000 })
    await expect(confirmDialog.locator('text=Reject Order')).toBeVisible()

    await authenticatedPage.locator('[data-testid="confirmation-confirm"]').click()

    // Then reason modal
    const reasonModal = authenticatedPage.locator('[data-testid="reason-modal"]')
    await expect(reasonModal).toBeVisible({ timeout: 5000 })
    await expect(authenticatedPage.locator('[data-testid="reason-modal-submit"]')).toBeDisabled()

    await authenticatedPage.locator('[data-testid="reason-textarea"]').fill('Test rejection reason')
    await expect(authenticatedPage.locator('[data-testid="reason-modal-submit"]')).toBeEnabled()

    // Cancel closes
    await authenticatedPage.locator('[data-testid="reason-modal-cancel"]').click()
    await expect(reasonModal).not.toBeVisible()
  })

  test('reschedule modal flow', async ({ authenticatedPage }) => {
    const found = await findOrderWithAction(authenticatedPage, 'order-action-reschedule')
    if (!found) { test.skip(); return }

    await authenticatedPage.locator('[data-testid="order-action-reschedule"]').click()

    // Opens directly (no confirmation)
    const modal = authenticatedPage.locator('[data-testid="reschedule-modal"]')
    await expect(modal).toBeVisible({ timeout: 5000 })
    await expect(authenticatedPage.locator('[data-testid="confirmation-dialog"]')).not.toBeVisible()

    // All elements present
    await expect(modal.getByRole('heading', { name: 'Reschedule Order' })).toBeVisible()
    await expect(modal.locator('button#date')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="reschedule-reason-textarea"]')).toBeVisible()

    // Date is pre-filled
    const dateText = await modal.locator('button#date').textContent()
    expect(dateText).not.toContain('Pick a date')

    // Can fill reason
    const textarea = authenticatedPage.locator('[data-testid="reschedule-reason-textarea"]')
    await textarea.fill('Need to reschedule due to ingredient availability')
    await expect(textarea).toHaveValue('Need to reschedule due to ingredient availability')

    // Date button opens calendar
    await modal.locator('button#date').click()
    await expect(authenticatedPage.locator('[role="grid"]')).toBeVisible({ timeout: 5000 })

    // Cancel closes
    await authenticatedPage.keyboard.press('Escape')
    await authenticatedPage.locator('[data-testid="reschedule-modal-cancel"]').click()
    await expect(modal).not.toBeVisible()
  })

  test('mark as picked up confirmation dialog flow', async ({ authenticatedPage }) => {
    const found = await findOrderWithAction(authenticatedPage, 'order-action-mark_picked_up')
    if (!found) { test.skip(); return }

    await authenticatedPage.locator('[data-testid="order-action-mark_picked_up"]').click()
    await authenticatedPage.waitForTimeout(500)

    // Confirmation dialog should appear
    const dialog = authenticatedPage.locator('[data-testid="confirmation-dialog"]')
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await expect(dialog.locator('text=/picked up/i')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="confirmation-confirm"]')).toBeVisible()
    await expect(authenticatedPage.locator('[data-testid="confirmation-cancel"]')).toBeVisible()

    // Cancel closes dialog without action
    await authenticatedPage.locator('[data-testid="confirmation-cancel"]').click()
    await authenticatedPage.waitForTimeout(500)
    await expect(dialog).not.toBeVisible()

    // Status should still be readyForPickup
    const badge = authenticatedPage.locator('[data-testid="order-status-badge"]')
    expect(await badge.getAttribute('data-status')).toBe('readyForPickup')
  })

  test('pickedUp order shows completed empty state', async ({ authenticatedPage }) => {
    // Find an order with pickedUp status by scanning order detail pages
    const found = await findOrderWithStatus(authenticatedPage, 'pickedUp')
    if (!found) { test.skip(); return }

    // Should show empty actions (order completed)
    await expect(authenticatedPage.locator('[data-testid="chef-order-actions-empty"]')).toBeAttached()
  })

  test('readyForPickup order shows fulfillment-dependent actions', async ({ authenticatedPage }) => {
    // Find an order with readyForPickup status by scanning order detail pages
    const found = await findOrderWithStatus(authenticatedPage, 'readyForPickup')
    if (!found) { test.skip(); return }

    // Should show either mark_picked_up button (chefPickup) or empty actions (yallaSpot)
    const markPickedUpBtn = authenticatedPage.locator('[data-testid="order-action-mark_picked_up"]')
    const emptyActions = authenticatedPage.locator('[data-testid="chef-order-actions-empty"]')
    await expect(markPickedUpBtn.or(emptyActions)).toBeAttached({ timeout: 5000 })
  })

  test('shows error for invalid order ID', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/orders/invalid-order-id-123', { waitUntil: 'domcontentloaded' })
    const errorAlert = authenticatedPage.locator('[role="alert"]')
    await expect(errorAlert.first()).toBeVisible({ timeout: 15000 })
  })
})
