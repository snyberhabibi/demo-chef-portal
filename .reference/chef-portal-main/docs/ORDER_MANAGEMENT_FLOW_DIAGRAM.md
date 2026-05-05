# Order Management Flow Diagram Documentation

## Overview

This document provides a comprehensive flow diagram documentation for order management actions and refund statuses from both **Chef** and **Customer** perspectives. This documentation is designed to be consumed by AI tools and humans for creating visual flow diagrams and understanding the complete order lifecycle.

---

## Table of Contents

1. [Order Status Definitions](#order-status-definitions)
2. [Action Matrix](#action-matrix)
3. [Refund Status Matrix](#refund-status-matrix)
4. [State Transition Diagrams](#state-transition-diagrams)
5. [Chef Actions Flow](#chef-actions-flow)
6. [Customer Actions Flow](#customer-actions-flow)
7. [Rescheduling Workflows](#rescheduling-workflows)
8. [Complete Order Lifecycle](#complete-order-lifecycle)

---

## Order Status Definitions

| Status               | Code             | Description                         | Terminal Status |
| -------------------- | ---------------- | ----------------------------------- | --------------- |
| **Pending**          | `pending`        | Order created, awaiting payment     | No              |
| **Paid**             | `paid`           | Payment completed successfully      | No              |
| **Confirmed**        | `confirmed`      | Order confirmed by chef or customer | No              |
| **Rescheduling**     | `rescheduling`   | Delivery time change proposed       | No              |
| **Preparing**        | `preparing`      | Order preparation started           | No              |
| **Ready**            | `ready`          | Order ready for pickup/delivery     | No              |
| **Out for Delivery** | `outForDelivery` | Order dispatched for delivery       | No              |
| **Delivered**        | `delivered`      | Order successfully delivered        | **Yes**         |
| **Cancelled**        | `cancelled`      | Order cancelled                     | **Yes**         |
| **Rejected**         | `rejected`       | Order rejected by chef              | **Yes**         |

---

## Action Matrix

### Chef Actions

| Action                     | Action Code          | From Status                       | To Status        | Requires Reason | Requires DateTime | Refund Status            |
| -------------------------- | -------------------- | --------------------------------- | ---------------- | --------------- | ----------------- | ------------------------ |
| **Confirm Order**          | `confirm`            | `paid`                            | `confirmed`      | No              | No                | `not_refunded`           |
| **Propose Reschedule**     | `propose_reschedule` | `paid`                            | `rescheduling`   | Optional        | **Yes**           | `not_refunded`           |
| **Propose Different Time** | `propose_reschedule` | `rescheduling`                    | `rescheduling`   | Optional        | **Yes**           | `not_refunded`           |
| **Accept Reschedule**      | `accept_reschedule`  | `rescheduling`                    | `confirmed`      | No              | No                | `not_refunded`           |
| **Reject Reschedule**      | `reject_reschedule`  | `rescheduling`                    | `cancelled`      | **Yes**         | No                | `refunded`               |
| **Reject Order**           | `reject`             | `paid`                            | `rejected`       | **Yes**         | No                | `refunded`               |
| **Start Preparing**        | `start_preparing`    | `confirmed`                       | `preparing`      | No              | No                | `not_refunded`           |
| **Mark Ready**             | `mark_ready`         | `preparing`                       | `ready`          | No              | No                | `not_refunded`           |
| **Send for Delivery**      | `send_for_delivery`  | `ready`                           | `outForDelivery` | No              | No                | `not_refunded`           |
| **Mark Delivered**         | `mark_delivered`     | `outForDelivery` or `ready`       | `delivered`      | No              | No                | `not_refunded`           |
| **Cancel Order**           | `cancel`             | `confirmed`, `preparing`          | `cancelled`      | **Yes**         | No                | `refunded` (conditional) |

### Customer Actions

| Action                 | Action Code          | From Status         | To Status      | Requires Reason | Requires DateTime | Refund Status  |
| ---------------------- | -------------------- | ------------------- | -------------- | --------------- | ----------------- | -------------- |
| **Accept Reschedule**  | `accept_reschedule`  | `rescheduling`      | `confirmed`    | No              | No                | `not_refunded` |
| **Reject Reschedule**  | `reject_reschedule`  | `rescheduling`      | `cancelled`    | No              | No                | `refunded`     |
| **Propose Reschedule** | `propose_reschedule` | `paid`, `confirmed` | `rescheduling` | Optional        | **Yes**           | `not_refunded` |

---

## Refund Status Matrix

### Refund Status Definitions

| Refund Status    | Code           | Description               |
| ---------------- | -------------- | ------------------------- |
| **Not Refunded** | `not_refunded` | No refund has been issued |
| **Refunded**     | `refunded`     | Refund has been processed |

### Actions That Trigger Refunds

| Action                           | Actor    | Refund Status            | Refund Amount    | Refund Date |
| -------------------------------- | -------- | ------------------------ | ---------------- | ----------- |
| **Reject Reschedule** (Customer) | Customer | `refunded`               | Full order total | Action date |
| **Reject Reschedule** (Chef)     | Chef     | `refunded`               | Full order total | Action date |
| **Reject Order**                 | Chef     | `refunded`               | Full order total | Action date |
| **Cancel Order**                 | Chef     | `refunded` (conditional) | Full order total | Action date |

### Actions That Do NOT Trigger Refunds

| Action                 | Actor         | Refund Status  |
| ---------------------- | ------------- | -------------- |
| **Confirm Order**      | Chef          | `not_refunded` |
| **Propose Reschedule** | Chef/Customer | `not_refunded` |
| **Accept Reschedule**  | Chef/Customer | `not_refunded` |
| **Start Preparing**    | Chef          | `not_refunded` |
| **Mark Ready**         | Chef          | `not_refunded` |
| **Send for Delivery**  | Chef          | `not_refunded` |
| **Mark Delivered**     | Chef          | `not_refunded` |

---

## State Transition Diagrams

### Primary Order Flow (Happy Path)

```
[Order Created]
    ↓
[pending]
    ↓ (Payment completed)
[paid]
    ↓ (Chef confirms)
[confirmed]
    ↓ (Chef starts preparing)
[preparing]
    ↓ (Chef marks ready)
[ready]
    ↓ (Chef sends for delivery)
[outForDelivery]
    ↓ (Chef marks delivered)
[delivered] ✅ TERMINAL
```

### Rescheduling Flow

```
[paid] or [confirmed]
    ↓ (Chef/Customer proposes reschedule)
[rescheduling]
    ↓
    ├─→ (Accept) → [confirmed] → [preparing] → [ready] → [outForDelivery] → [delivered] ✅
    │
    └─→ (Reject) → [cancelled] ✅ TERMINAL (Refund: refunded)
```

### Cancellation Flow

```
[paid]
    ↓ (Chef rejects)
[rejected] ✅ TERMINAL (Refund: refunded)

[confirmed] or [preparing] or [ready]
    ↓ (Chef cancels)
[cancelled] ✅ TERMINAL (Refund: refunded)
```

---

## Chef Actions Flow

### Chef Actions by Order Status

#### Status: `paid`

```
[paid]
    │
    ├─→ [confirm] → [confirmed] (Refund: not_refunded)
    │
    ├─→ [propose_reschedule] → [rescheduling] (Refund: not_refunded)
    │   └─ Requires: DateTime (after delivery date/time)
    │
    └─→ [reject] → [rejected] ✅ TERMINAL (Refund: refunded)
        └─ Requires: Reason
```

#### Status: `confirmed`

```
[confirmed]
    │
    ├─→ [start_preparing] → [preparing] (Refund: not_refunded)
    │
    └─→ [cancel] → [cancelled] ✅ TERMINAL (Refund: refunded)
        └─ Requires: Reason
```

#### Status: `preparing`

```
[preparing]
    │
    ├─→ [mark_ready] → [ready] (Refund: not_refunded)
    │
    └─→ [cancel] → [cancelled] ✅ TERMINAL (Refund: refunded)
        └─ Requires: Reason
```

#### Status: `ready`

```
[ready]
    │
    ├─→ [send_for_delivery] → [outForDelivery] (Refund: not_refunded)
    │
    ├─→ [mark_delivered] → [delivered] ✅ TERMINAL (Refund: not_refunded)
    │
    └─→ [cancel] → [cancelled] ✅ TERMINAL (Refund: refunded)
        └─ Requires: Reason
```

#### Status: `outForDelivery`

```
[outForDelivery]
    │
    └─→ [mark_delivered] → [delivered] ✅ TERMINAL (Refund: not_refunded)
```

#### Status: `rescheduling`

**Scenario 1: Chef Proposed the Reschedule**

```
[rescheduling] (Chef proposed)
    │
    └─→ [propose_reschedule] → [rescheduling] (Refund: not_refunded)
        └─ Requires: DateTime (after delivery date/time)
        └─ Customer can: Accept or Reject
```

**Scenario 2: Customer Proposed the Reschedule**

```
[rescheduling] (Customer proposed)
    │
    ├─→ [accept_reschedule] → [confirmed] (Refund: not_refunded)
    │
    ├─→ [reject_reschedule] → [cancelled] ✅ TERMINAL (Refund: refunded)
    │   └─ Requires: Reason
    │
    └─→ [propose_reschedule] → [rescheduling] (Refund: not_refunded)
        └─ Requires: DateTime (after delivery date/time)
```

---

## Customer Actions Flow

### Customer Actions by Order Status

#### Status: `rescheduling` (Chef Proposed)

```
[rescheduling] (Chef proposed)
    │
    ├─→ [accept_reschedule] → [confirmed] (Refund: not_refunded)
    │   └─ Order proceeds to preparation
    │
    └─→ [reject_reschedule] → [cancelled] ✅ TERMINAL (Refund: refunded)
        └─ Order cancelled, refund initiated
```

#### Status: `paid` or `confirmed`

```
[paid] or [confirmed]
    │
    └─→ [propose_reschedule] → [rescheduling] (Refund: not_refunded)
        └─ Requires: DateTime (after delivery date/time)
        └─ Chef can: Accept or Reject
```

---

## Rescheduling Workflows

### Workflow 1: Chef Proposes Reschedule

```
Step 1: [paid]
    ↓
Step 2: Chef Action: propose_reschedule
    ├─ Input: New DateTime (must be after delivery date/time)
    ├─ Input: Reason (optional)
    ↓
Step 3: [rescheduling]
    ├─ Proposed By: Chef
    ├─ Proposed DateTime: Chef's selection
    ├─ Rescheduling Reason: Chef's reason (if provided)
    ↓
Step 4: Customer Decision
    │
    ├─ Option A: accept_reschedule
    │   ↓
    │   [confirmed] → Order proceeds to preparation
    │   Refund: not_refunded
    │
    └─ Option B: reject_reschedule
        ↓
        [cancelled] ✅ TERMINAL
        Refund: refunded
        Refund Amount: Full order total
        Refund Date: Action date
```

### Workflow 2: Customer Proposes Reschedule

```
Step 1: [paid] or [confirmed]
    ↓
Step 2: Customer Action: propose_reschedule
    ├─ Input: New DateTime (must be after delivery date/time)
    ├─ Input: Reason (optional)
    ↓
Step 3: [rescheduling]
    ├─ Proposed By: Customer
    ├─ Proposed DateTime: Customer's selection
    ├─ Rescheduling Reason: Customer's reason (if provided)
    ↓
Step 4: Chef Decision
    │
    ├─ Option A: accept_reschedule
    │   ↓
    │   [confirmed] → Order proceeds to preparation
    │   Refund: not_refunded
    │
    ├─ Option B: reject_reschedule
    │   ↓
    │   [cancelled] ✅ TERMINAL
    │   Refund: refunded
    │   Refund Amount: Full order total
    │   Refund Date: Action date
    │
    └─ Option C: propose_reschedule (Counter-proposal)
        ↓
        [rescheduling] (New proposal)
        └─ Customer can: Accept, Reject, or Propose again
```

### Workflow 3: Multiple Reschedule Proposals

```
[rescheduling] (Round 1)
    ↓
Chef/Customer: propose_reschedule (Counter-proposal)
    ↓
[rescheduling] (Round 2)
    ↓
Other Party: Accept or Reject
    │
    ├─ Accept → [confirmed]
    │
    └─ Reject → [cancelled] ✅ (Refund: refunded)
```

**Note:** The system allows multiple rounds of rescheduling proposals. Each proposal is tracked in `reschedulingHistory` with action status: `proposed`, `accepted`, or `rejected`.

---

## Complete Order Lifecycle

### Complete State Machine Diagram

```
                    [Order Created]
                         ↓
                    [pending]
                         ↓ (Payment)
                    [paid]
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ↓                ↓                ↓
   [confirmed]   [rescheduling]    [rejected] ✅
        │                │         (Refund: refunded)
        │                │
        │                ├─→ (Accept) → [confirmed]
        │                │
        │                └─→ (Reject) → [cancelled] ✅
        │                              (Refund: refunded)
        │
        ↓
   [preparing]
        │
        ├─→ [cancel] → [cancelled] ✅ (Refund: refunded)
        │
        ↓
     [ready]
        │
        ├─→ [cancel] → [cancelled] ✅ (Refund: refunded)
        │
        ├─→ [send_for_delivery] → [outForDelivery]
        │                              │
        │                              ↓
        └─→ [mark_delivered] ──────────┘
                         ↓
                   [delivered] ✅
                 (Refund: not_refunded)
```

### Legend

- **✅ TERMINAL**: Order cannot transition from this status
- **Refund: refunded**: Refund is automatically processed
- **Refund: not_refunded**: No refund is issued
- **Refund: refunded (conditional)**: Refund may be issued based on business rules

---

## Action Requirements Summary

### Actions Requiring Reason

| Action              | Actor    | Reason Required    |
| ------------------- | -------- | ------------------ |
| `reject`            | Chef     | **Yes** (Required) |
| `reject_reschedule` | Chef     | **Yes** (Required) |
| `cancel`            | Chef     | **Yes** (Required) |
| `reject_reschedule` | Customer | No (Optional)      |

### Actions Requiring DateTime

| Action               | Actor    | DateTime Required | Validation                       |
| -------------------- | -------- | ----------------- | -------------------------------- |
| `propose_reschedule` | Chef     | **Yes**           | Must be after delivery date/time |
| `propose_reschedule` | Customer | **Yes**           | Must be after delivery date/time |

---

## Refund Processing Rules

### Automatic Refund Triggers

1. **Customer Rejects Chef's Reschedule Proposal**

   - Status: `rescheduling` → `cancelled`
   - Refund Status: `refunded`
   - Refund Amount: Full order total
   - Refund Date: Action timestamp

2. **Chef Rejects Customer's Reschedule Proposal**

   - Status: `rescheduling` → `cancelled`
   - Refund Status: `refunded`
   - Refund Amount: Full order total
   - Refund Date: Action timestamp

3. **Chef Rejects Order**

   - Status: `paid` → `rejected`
   - Refund Status: `refunded`
   - Refund Amount: Full order total
   - Refund Date: Action timestamp

4. **Chef Cancels Order**
   - Status: `confirmed`/`preparing` → `cancelled` (orders with status `ready` cannot be cancelled)
   - Refund Status: `refunded` (conditional based on business rules)
   - Refund Amount: Full order total
   - Refund Date: Action timestamp

### No Refund Scenarios

- Order progresses normally through statuses
- Reschedule proposals are accepted
- Order is marked as delivered
- Order is cancelled before payment (if applicable)

---

## Data Structures

### Refund Object

```typescript
{
  refundAmount: number | null; // Amount refunded (in cents)
  refundDate: string | null; // ISO date string
  refundStatus: "refunded" | "not_refunded";
}
```

### Rescheduling Object

```typescript
{
  proposedDateTime: string | null; // ISO datetime string
  proposedBy: string | null; // User ID who proposed
  reschedulingReason: string | null; // Optional reason
  reschedulingHistory: Array<{
    proposedDateTime: string; // ISO datetime string
    proposedBy: string; // User ID
    reason: string | null; // Optional reason
    timestamp: string; // ISO datetime string
    action: "proposed" | "accepted" | "rejected";
    id: string; // Unique identifier
  }>;
}
```

### Status History Entry

```typescript
{
  status: string;                            // New status
  previousStatus: string | null;              // Previous status
  changedAt: string;                         // ISO datetime string
  reason: string | null;                     // Optional reason
  changedBy?: {
    email: string;
    id: string;
    name: string;
    role: string;                            // "chef" | "customer"
  } | null;
}
```

---

## API Endpoints

### Chef Portal Endpoints

- **Base Path**: `/v1/chef-portal/orders`
- **Get Orders**: `GET /v1/chef-portal/orders?page=1&limit=12&status=paid&search=query`
- **Get Order Details**: `GET /v1/chef-portal/orders/{id}`
- **Order Action**: `POST /v1/chef-portal/orders/{id}/action`

### Customer Endpoints

- **Base Path**: `/v1/customer/orders`
- **Get Order Details**: `GET /v1/customer/orders/{id}`
- **Order Action**: `POST /v1/customer/orders/{id}/action`

### Action Request Format

```json
{
  "action": "propose_reschedule",
  "params": {
    "proposedDateTime": "2024-01-15T14:30:00Z",
    "reason": "Kitchen equipment issue"
  }
}
```

---

## Flow Diagram Generation Notes

### For AI Tools

This document is structured to enable AI tools to generate flow diagrams. Key elements:

1. **State Definitions**: Clear status definitions with terminal markers
2. **Action Matrix**: Tabular format showing all transitions
3. **Refund Matrix**: Explicit refund status for each action
4. **Workflow Descriptions**: Step-by-step flows with decision points
5. **State Machine**: Complete lifecycle with all paths

### For Human Readers

- Use the **Action Matrix** to understand what actions are available
- Use **State Transition Diagrams** to visualize flows
- Use **Rescheduling Workflows** to understand complex scenarios
- Use **Complete Order Lifecycle** for the full picture

### Diagram Types Supported

1. **State Diagrams**: Status transitions
2. **Flowcharts**: Action workflows
3. **Decision Trees**: Rescheduling scenarios
4. **Sequence Diagrams**: Multi-party interactions
5. **State Machines**: Complete lifecycle

---

## Version Information

- **Document Version**: 1.0
- **Last Updated**: 2024
- **Order Management System**: Yalla Bites Chef Portal
- **Compatible With**: Order Management API v1

---

## Notes

1. **Terminal Statuses**: Once an order reaches `delivered`, `cancelled`, or `rejected`, no further actions are available.

2. **Rescheduling Constraints**: Proposed reschedule times must be after the current delivery date/time.

3. **Refund Processing**: Refunds are automatically processed when certain actions are taken. The refund amount is typically the full order total.

4. **Status History**: All status changes are tracked in `statusHistory` with information about who made the change and when.

5. **Rescheduling History**: All rescheduling proposals are tracked in `reschedulingHistory` with their outcomes (proposed, accepted, rejected).

---

## Related Documentation

- [Order Management Use Cases](./ORDER_MANAGEMENT_USE_CASES.md)
- [Order Status History](./ORDER_STATUS_HISTORY.md)
