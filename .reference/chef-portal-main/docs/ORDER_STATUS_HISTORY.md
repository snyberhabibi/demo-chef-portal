# Order Status History Management

## Overview

This document describes the expected behavior for order status history and how duplicate entries are handled.

## Problem Statement

Duplicate status history entries can occur when:
1. The backend API creates duplicate entries for the same status change
2. Both customer and chef-portal endpoints are called for the same action
3. Race conditions in concurrent requests

## Expected Behavior

### Status Flow for Rescheduling Scenario

1. **Order Created** → Status: `pending`
   - Endpoint: System (automatic)
   - Status History Entry: `pending` (previousStatus: `null`)

2. **Payment Completed** → Status: `paid`
   - Endpoint: Payment system (automatic)
   - Status History Entry: `paid` (previousStatus: `pending`)

3. **Chef Proposes Reschedule** → Status: `rescheduling`
   - Endpoint: `POST /v1/chef-portal/orders/{id}/action`
   - Action: `propose_reschedule`
   - Status History Entry: `rescheduling` (previousStatus: `paid`)
   - Should include: `changedBy` (chef info), `reason` (optional)

4. **Customer Accepts Reschedule** → Status: `confirmed`
   - Endpoint: `POST /v1/customer/orders/{id}/action`
   - Action: `accept_reschedule`
   - Status History Entry: `confirmed` (previousStatus: `rescheduling`)
   - Should include: `changedBy` (customer info), `reason` (optional)
   - **IMPORTANT**: Only ONE entry should be created

## Endpoint Specifications

### Chef Portal Endpoint
- **Path**: `/v1/chef-portal/orders/{id}/action`
- **Method**: `POST`
- **Actions Available**:
  - `confirm` - Confirm a paid order (status: `paid` → `confirmed`)
  - `propose_reschedule` - Propose new delivery time (status: `paid` → `rescheduling`)
  - `accept_reschedule` - Accept a reschedule proposal (status: `rescheduling` → `confirmed`)
  - `reject_reschedule` - Reject a reschedule proposal (status: `rescheduling` → `cancelled`)
  - `reject` - Reject an order (status: `paid` → `rejected`)
  - `start_preparing` - Start preparing order (status: `confirmed` → `preparing`)
  - `mark_ready` - Mark order as ready (status: `preparing` → `ready`)
  - `send_for_delivery` - Send for delivery (status: `ready` → `outForDelivery`)
  - `mark_delivered` - Mark as delivered (status: `outForDelivery` → `delivered`)
  - `cancel` - Cancel order (various statuses → `cancelled`)

### Customer Endpoint
- **Path**: `/v1/customer/orders/{id}/action`
- **Method**: `POST`
- **Actions Available**:
  - `accept_reschedule` - Accept a reschedule proposal (status: `rescheduling` → `confirmed`)
  - `reject_reschedule` - Reject a reschedule proposal (status: `rescheduling` → `cancelled`)

## Duplicate Detection

The frontend includes automatic duplicate detection and removal:

### Detection Criteria
- Same `status` and `previousStatus`
- Timestamps within 5 seconds of each other
- Same or similar `changedBy` information

### Handling
- Duplicates are automatically removed when orders are fetched
- Warnings are logged in development mode
- The most recent entry with complete information is kept

### Implementation
See `lib/order-utils.ts` for the deduplication logic.

## Backend Requirements

The backend API should ensure:

1. **Idempotency**: Calling the same action endpoint multiple times should not create duplicate status history entries
2. **Single Source of Truth**: Only one endpoint should handle a given action (customer OR chef-portal, not both)
3. **Validation**: Check if a status history entry already exists before creating a new one
4. **Transaction Safety**: Use database transactions to prevent race conditions

### Recommended Backend Fix

```typescript
// Pseudo-code for backend validation
async function handleOrderAction(orderId: string, action: string, user: User) {
  const order = await getOrder(orderId);
  
  // Check if this action would create a duplicate status history entry
  const lastHistoryEntry = await getLastStatusHistoryEntry(orderId);
  
  if (lastHistoryEntry) {
    const timeDiff = Date.now() - new Date(lastHistoryEntry.changedAt).getTime();
    const isDuplicate = 
      lastHistoryEntry.status === expectedNewStatus &&
      lastHistoryEntry.previousStatus === order.status &&
      timeDiff < 5000; // 5 seconds
    
    if (isDuplicate) {
      // Return existing entry instead of creating a new one
      return { order, message: "Status already updated" };
    }
  }
  
  // Proceed with status update...
}
```

## Frontend Validation

The frontend validates status history and:
- Detects duplicate entries
- Removes duplicates automatically
- Logs warnings in development mode
- Validates status transitions

## Testing

To test for duplicate entries:

1. Create an order and complete payment
2. Have chef propose a reschedule
3. Have customer accept the reschedule
4. Check status history - should only have ONE `confirmed` entry from `rescheduling`

## Related Files

- `lib/order-utils.ts` - Duplicate detection and validation utilities
- `services/orders.service.ts` - Order service with deduplication
- `types/orders.types.ts` - Type definitions for status history



