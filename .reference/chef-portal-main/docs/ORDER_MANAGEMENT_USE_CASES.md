# Order Management Use Cases

## Overview

This document outlines all use cases for order management from both the **Chef** and **Customer** perspectives. It covers all interactions, actions, and workflows available in the order management system.

---

## Table of Contents

1. [Order Status Flow](#order-status-flow)
2. [Chef Use Cases](#chef-use-cases)
3. [Customer Use Cases](#customer-use-cases)
4. [Order Information & Views](#order-information--views)
5. [Rescheduling Workflows](#rescheduling-workflows)
6. [Error Handling & Edge Cases](#error-handling--edge-cases)

---

## Order Status Flow

### Status Definitions

| Status           | Description                         | Who Can Initiate           |
| ---------------- | ----------------------------------- | -------------------------- |
| `pending`        | Order created, awaiting payment     | System (automatic)         |
| `paid`           | Payment completed successfully      | Payment System (automatic) |
| `confirmed`      | Order confirmed by chef or customer | Chef, Customer             |
| `rescheduling`   | Delivery time change proposed       | Chef, Customer             |
| `preparing`      | Order preparation started           | Chef                       |
| `ready`          | Order ready for pickup/delivery     | Chef                       |
| `outForDelivery` | Order dispatched for delivery       | Chef                       |
| `delivered`      | Order successfully delivered        | Chef                       |
| `cancelled`      | Order cancelled                     | Chef, Customer             |
| `rejected`       | Order rejected by chef              | Chef                       |

### Status Transition Diagram

```
pending → paid → confirmed → preparing → ready → outForDelivery → delivered
                              ↓
                         rescheduling
                              ↓
                    (accept) → confirmed
                    (reject) → cancelled
                              ↓
                         cancelled
                              ↓
                         rejected
```

---

## Chef Use Cases

### 1. View Orders List

**Use Case ID:** `CHEF-UC-001`

**Description:** Chef can view a paginated list of all orders with search and filtering capabilities.

**Preconditions:**

- Chef is authenticated
- Chef has access to the orders dashboard

**Main Flow:**

1. Chef navigates to `/dashboard/orders`
2. System displays orders list with:
   - Order number
   - Customer name, email, phone
   - Delivery address
   - Items summary
   - Order status (with badge)
   - Total amount
   - Created date
3. Chef can:
   - Search by order ID, customer name, or dish name
   - Filter by status (all, confirmed, paid, rescheduling, preparing, ready, outForDelivery, delivered, cancelled, rejected)
   - Navigate through pages
   - Change page size (12, 24, 48, 96 items per page)
   - Click on any order row to view details

**Postconditions:**

- Orders list is displayed with current filters applied
- Chef can access order details by clicking on any order

**Related Endpoints:**

- `GET /v1/chef-portal/orders` (with query params: page, limit, status, search)

---

### 2. View Order Details

**Use Case ID:** `CHEF-UC-002`

**Description:** Chef can view comprehensive details of a specific order.

**Preconditions:**

- Chef is authenticated
- Order exists

**Main Flow:**

1. Chef clicks on an order from the orders list
2. System displays order details page with:
   - **Order Header:**
     - Order number
     - Current status badge
   - **Actions Section:**
     - Available action buttons based on current status
   - **Order Items:**
     - List of all items with:
       - Dish name and image
       - Quantity
       - Portion size
       - Spice level
       - Customizations (modifier groups and modifiers)
       - Special instructions
       - Price and line total
   - **Order Note:**
     - Special instructions (if any)
   - **Order Summary:**
     - Subtotal
     - Delivery fee
     - Tax
     - Service fee (if applicable)
     - Discount amount and code (if applicable)
     - Total
     - Refund information (if refunded)
   - **Activity Timeline:**
     - Status history with:
       - Status changes
       - Previous status
       - Changed by (user name, email, role)
       - Timestamp
       - Reason (if provided)
   - **Customer Details:**
     - Customer name, email, phone
     - Customer avatar
     - Delivery address (street, apartment, city, state, zip, country)
     - Delivery instructions
     - Delivery window
     - Delivery status (if delivery is scheduled)
     - Tracking URL (if available)

**Postconditions:**

- Chef has full visibility into order details
- Chef can perform actions on the order

**Related Endpoints:**

- `GET /v1/chef-portal/orders/{id}`

---

### 3. Confirm Order

**Use Case ID:** `CHEF-UC-003`

**Description:** Chef confirms a paid order, moving it to the preparation workflow.

**Preconditions:**

- Order status is `paid`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `paid`
2. Chef clicks "Confirm Order" button
3. System updates order status from `paid` → `confirmed`
4. System creates status history entry:
   - Status: `confirmed`
   - Previous Status: `paid`
   - Changed By: Chef information
   - Timestamp: Current time
5. System displays success message: "Order confirmed successfully!"
6. Order details page refreshes with new status

**Postconditions:**

- Order status is `confirmed`
- Status history is updated
- Chef can now start preparing the order

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `confirm`)

**Alternative Actions Available:**

- Propose New Date/Time (see UC-005)
- Reject Order (see UC-004)

---

### 4. Reject Order

**Use Case ID:** `CHEF-UC-004`

**Description:** Chef rejects a paid order, moving it to rejected status.

**Preconditions:**

- Order status is `paid`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `paid`
2. Chef clicks "Reject Order" button
3. System displays reason modal requiring:
   - Reason (required, textarea)
4. Chef enters rejection reason
5. Chef clicks "Confirm" button
6. System updates order status from `paid` → `rejected`
7. System creates status history entry:
   - Status: `rejected`
   - Previous Status: `paid`
   - Changed By: Chef information
   - Reason: Chef-provided reason
   - Timestamp: Current time
8. System displays success message: "Order rejected successfully!"
9. System redirects chef to orders list after 1.5 seconds

**Postconditions:**

- Order status is `rejected`
- Status history is updated with reason
- Order is no longer actionable

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `reject`, reason: required)

---

### 5. Propose Reschedule

**Use Case ID:** `CHEF-UC-005`

**Description:** Chef proposes a new delivery date/time for a paid order.

**Preconditions:**

- Order status is `paid` or `rescheduling`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `paid` or `rescheduling`
2. Chef clicks "Propose New Date/Time" or "Propose Different Time" button
3. System displays reschedule modal with:
   - New Delivery Date & Time (required, datetime-local input, minimum 1 hour from now)
   - Reason for Rescheduling (optional, textarea)
4. Chef selects new date/time (default: tomorrow at noon)
5. Chef optionally enters reason for rescheduling
6. Chef clicks "Propose New Time" button
7. System updates order status:
   - If `paid` → `rescheduling`
   - If `rescheduling` → `rescheduling` (updates proposal)
8. System creates/updates rescheduling information:
   - Proposed DateTime: Chef-selected date/time
   - Proposed By: Chef information
   - Rescheduling Reason: Chef-provided reason (if any)
   - Rescheduling History: New entry added
9. System creates status history entry:
   - Status: `rescheduling`
   - Previous Status: Previous status
   - Changed By: Chef information
   - Reason: Chef-provided reason (if any)
   - Timestamp: Current time
10. System displays success message: "Rescheduling proposal sent successfully!"
11. Order details page refreshes with new status

**Postconditions:**

- Order status is `rescheduling`
- Rescheduling proposal is stored
- Customer is notified and can accept/reject the proposal
- Chef cannot accept/reject their own proposal (UI hides accept/reject buttons)

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `propose_reschedule`, proposedDateTime: required, reason: optional)

**Special Cases:**

- If chef previously proposed reschedule, they can propose a different time
- Chef cannot accept/reject their own reschedule proposal

---

### 6. Accept Reschedule (Customer Proposal)

**Use Case ID:** `CHEF-UC-006`

**Description:** Chef accepts a reschedule proposal made by the customer.

**Preconditions:**

- Order status is `rescheduling`
- Customer proposed the reschedule (not chef)
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `rescheduling`
2. System displays "Accept New Time" button (only visible if customer proposed)
3. Chef clicks "Accept New Time" button
4. System updates order status from `rescheduling` → `confirmed`
5. System updates rescheduling information:
   - Rescheduling History: Entry marked as accepted
6. System creates status history entry:
   - Status: `confirmed`
   - Previous Status: `rescheduling`
   - Changed By: Chef information
   - Timestamp: Current time
7. System displays success message: "New delivery time accepted successfully!"
8. Order details page refreshes with new status

**Postconditions:**

- Order status is `confirmed`
- Rescheduling proposal is marked as accepted
- Order can proceed to preparation

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `accept_reschedule`)

**Note:** Chef can only accept reschedules proposed by customers, not their own proposals.

---

### 7. Reject Reschedule (Customer Proposal)

**Use Case ID:** `CHEF-UC-007`

**Description:** Chef rejects a reschedule proposal made by the customer, cancelling the order and initiating refund.

**Preconditions:**

- Order status is `rescheduling`
- Customer proposed the reschedule (not chef)
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `rescheduling`
2. System displays "Reject & Refund" button (only visible if customer proposed)
3. Chef clicks "Reject & Refund" button
4. System displays reason modal requiring:
   - Reason (required, textarea)
5. Chef enters rejection reason
6. Chef clicks "Confirm" button
7. System updates order status from `rescheduling` → `cancelled`
8. System initiates refund process:
   - Refund Status: `refunded`
   - Refund Amount: Calculated based on order total
   - Refund Date: Current date
9. System updates rescheduling information:
   - Rescheduling History: Entry marked as rejected
10. System creates status history entry:
    - Status: `cancelled`
    - Previous Status: `rescheduling`
    - Changed By: Chef information
    - Reason: Chef-provided reason
    - Timestamp: Current time
11. System displays success message: "Order cancelled and refund initiated!"
12. System redirects chef to orders list after 1.5 seconds

**Postconditions:**

- Order status is `cancelled`
- Refund is initiated
- Rescheduling proposal is marked as rejected
- Order is no longer actionable

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `reject_reschedule`, reason: required)

---

### 8. Start Preparing Order

**Use Case ID:** `CHEF-UC-008`

**Description:** Chef starts preparing a confirmed order.

**Preconditions:**

- Order status is `confirmed`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `confirmed`
2. Chef clicks "Start Preparing" button
3. System updates order status from `confirmed` → `preparing`
4. System creates status history entry:
   - Status: `preparing`
   - Previous Status: `confirmed`
   - Changed By: Chef information
   - Timestamp: Current time
5. System displays success message: "Order preparation started!"
6. Order details page refreshes with new status

**Postconditions:**

- Order status is `preparing`
- Status history is updated
- Chef can mark order as ready when preparation is complete

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `start_preparing`)

**Alternative Actions Available:**

- Cancel Order (see UC-012)

---

### 9. Mark Order Ready

**Use Case ID:** `CHEF-UC-009`

**Description:** Chef marks a preparing order as ready for pickup/delivery.

**Preconditions:**

- Order status is `preparing`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `preparing`
2. Chef clicks "Mark Ready" button
3. System updates order status from `preparing` → `ready`
4. System creates status history entry:
   - Status: `ready`
   - Previous Status: `preparing`
   - Changed By: Chef information
   - Timestamp: Current time
5. System displays success message: "Order marked as ready!"
6. Order details page refreshes with new status

**Postconditions:**

- Order status is `ready`
- Status history is updated
- Chef can send order for delivery or mark as delivered

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `mark_ready`)

**Alternative Actions Available:**

- Cancel Order (see UC-012)

---

### 10. Send Order for Delivery

**Use Case ID:** `CHEF-UC-010`

**Description:** Chef sends a ready order for delivery.

**Preconditions:**

- Order status is `ready`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `ready`
2. Chef clicks "Send for Delivery" button
3. System updates order status from `ready` → `outForDelivery`
4. System creates status history entry:
   - Status: `outForDelivery`
   - Previous Status: `ready`
   - Changed By: Chef information
   - Timestamp: Current time
5. System may update delivery details:
   - Delivery Status: Updated to appropriate status (e.g., `assigned`, `pickup_enroute`)
   - Tracking URL: Generated if available
6. System displays success message: "Order sent for delivery!"
7. Order details page refreshes with new status

**Postconditions:**

- Order status is `outForDelivery`
- Status history is updated
- Delivery tracking is initiated (if applicable)
- Chef can mark order as delivered when delivery is complete

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `send_for_delivery`)

**Alternative Actions Available:**

- Mark Delivered (see UC-011)
- Cancel Order (see UC-012)

---

### 11. Mark Order Delivered

**Use Case ID:** `CHEF-UC-011`

**Description:** Chef marks an order as successfully delivered.

**Preconditions:**

- Order status is `ready` or `outForDelivery`
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `ready` or `outForDelivery`
2. Chef clicks "Mark Delivered" button
3. System updates order status from `ready`/`outForDelivery` → `delivered`
4. System updates delivery information:
   - Delivered At: Current timestamp
   - Delivery Status: `delivered` (if applicable)
5. System creates status history entry:
   - Status: `delivered`
   - Previous Status: Previous status
   - Changed By: Chef information
   - Timestamp: Current time
6. System displays success message: "Order marked as delivered!"
7. Order details page refreshes with new status

**Postconditions:**

- Order status is `delivered`
- Status history is updated
- Order is completed
- No further actions available

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `mark_delivered`)

**Note:** This is a terminal status. No further actions are available.

---

### 12. Cancel Order

**Use Case ID:** `CHEF-UC-012`

**Description:** Chef cancels an order that is confirmed or preparing. Orders that are ready cannot be cancelled.

**Preconditions:**

- Order status is `confirmed` or `preparing` (orders with status `ready` cannot be cancelled)
- Chef is authenticated
- Chef has access to the order

**Main Flow:**

1. Chef views order details for an order with status `confirmed` or `preparing`
2. Chef clicks "Cancel Order" button
3. System displays reason modal requiring:
   - Reason (required, textarea)
4. Chef enters cancellation reason
5. Chef clicks "Confirm" button
6. System updates order status to `cancelled`
7. System may initiate refund process (depending on order status and payment)
8. System creates status history entry:
   - Status: `cancelled`
   - Previous Status: Previous status
   - Changed By: Chef information
   - Reason: Chef-provided reason
   - Timestamp: Current time
9. System displays success message: "Order cancelled successfully!"
10. System redirects chef to orders list after 1.5 seconds

**Postconditions:**

- Order status is `cancelled`
- Status history is updated with reason
- Refund may be initiated (depending on order state)
- Order is no longer actionable

**Related Endpoints:**

- `POST /v1/chef-portal/orders/{id}/action` (action: `cancel`, reason: required)

**Note:** Cancellation may trigger refunds depending on order status and business rules.

---

### 13. Delete Order

**Use Case ID:** `CHEF-UC-013`

**Description:** Chef deletes an order (if allowed by business rules).

**Preconditions:**

- Order exists
- Chef is authenticated
- Chef has permission to delete orders
- Business rules allow deletion

**Main Flow:**

1. Chef accesses order deletion functionality (if available)
2. Chef confirms deletion
3. System deletes the order
4. System displays success message
5. Chef is redirected to orders list

**Postconditions:**

- Order is deleted from the system
- Order no longer appears in orders list

**Related Endpoints:**

- `DELETE /v1/chef-portal/orders/{id}`

**Note:** This action may be restricted based on order status and business rules.

---

## Customer Use Cases

### 1. View Order Details

**Use Case ID:** `CUSTOMER-UC-001`

**Description:** Customer can view details of their order.

**Preconditions:**

- Customer is authenticated
- Order exists and belongs to customer

**Main Flow:**

1. Customer navigates to their order details page
2. System displays order information:
   - Order number
   - Current status
   - Order items with details
   - Order summary (pricing breakdown)
   - Delivery information
   - Status history/activity timeline
   - Available actions based on order status

**Postconditions:**

- Customer has visibility into their order status and details

**Related Endpoints:**

- `GET /v1/customer/orders/{id}` (assumed customer endpoint)

---

### 2. Accept Reschedule Proposal

**Use Case ID:** `CUSTOMER-UC-002`

**Description:** Customer accepts a reschedule proposal made by the chef.

**Preconditions:**

- Order status is `rescheduling`
- Chef proposed the reschedule
- Customer is authenticated
- Customer has access to the order

**Main Flow:**

1. Customer views order details for an order with status `rescheduling`
2. System displays chef's proposed new delivery date/time
3. System displays "Accept New Time" button
4. Customer clicks "Accept New Time" button
5. System updates order status from `rescheduling` → `confirmed`
6. System updates rescheduling information:
   - Rescheduling History: Entry marked as accepted
7. System creates status history entry:
   - Status: `confirmed`
   - Previous Status: `rescheduling`
   - Changed By: Customer information
   - Timestamp: Current time
8. System displays success message
9. Order details page refreshes with new status

**Postconditions:**

- Order status is `confirmed`
- Rescheduling proposal is marked as accepted
- Order proceeds to preparation

**Related Endpoints:**

- `POST /v1/customer/orders/{id}/action` (action: `accept_reschedule`)

**Note:** Only ONE status history entry should be created (no duplicates).

---

### 3. Reject Reschedule Proposal

**Use Case ID:** `CUSTOMER-UC-003`

**Description:** Customer rejects a reschedule proposal made by the chef, cancelling the order and initiating refund.

**Preconditions:**

- Order status is `rescheduling`
- Chef proposed the reschedule
- Customer is authenticated
- Customer has access to the order

**Main Flow:**

1. Customer views order details for an order with status `rescheduling`
2. System displays chef's proposed new delivery date/time
3. System displays "Reject & Refund" button
4. Customer clicks "Reject & Refund" button
5. System may require confirmation or reason (depending on implementation)
6. System updates order status from `rescheduling` → `cancelled`
7. System initiates refund process:
   - Refund Status: `refunded`
   - Refund Amount: Calculated based on order total
   - Refund Date: Current date
8. System updates rescheduling information:
   - Rescheduling History: Entry marked as rejected
9. System creates status history entry:
   - Status: `cancelled`
   - Previous Status: `rescheduling`
   - Changed By: Customer information
   - Timestamp: Current time
10. System displays success message
11. Customer is notified of cancellation and refund

**Postconditions:**

- Order status is `cancelled`
- Refund is initiated
- Rescheduling proposal is marked as rejected
- Order is no longer actionable

**Related Endpoints:**

- `POST /v1/customer/orders/{id}/action` (action: `reject_reschedule`)

**⚠️ Business Logic Decision Required:**

**Current Implementation:** When a customer rejects a chef's reschedule proposal, the order is immediately cancelled and refunded. This is a **terminal action** - the order cannot be recovered.

**Alternative Consideration:** The system could allow customers to propose a counter-offer (alternative time) instead of immediately rejecting. This would:

- Keep the order active in `rescheduling` status
- Allow the chef to accept the customer's counter-proposal
- Provide more flexibility and potentially save orders from cancellation
- Require additional UI/UX for "Reject & Propose Alternative" action

**Recommendation:** Determine business requirements:

- **Option A (Current):** Reject = Cancel + Refund (no counter-proposal)
- **Option B (Alternative):** Reject = Allow counter-proposal OR Cancel + Refund

If Option B is chosen, a new use case `CUSTOMER-UC-005: Propose Counter-Reschedule` should be added.

---

### 4. Propose Reschedule (Customer)

**Use Case ID:** `CUSTOMER-UC-004`

**Description:** Customer proposes a new delivery date/time for their order.

**Preconditions:**

- Order status is `paid` or `confirmed`
- Customer is authenticated
- Customer has access to the order
- Business rules allow customer-initiated rescheduling

**Main Flow:**

1. Customer views order details
2. Customer clicks "Request Reschedule" or similar button
3. System displays reschedule form:
   - New Delivery Date & Time (required)
   - Reason for Rescheduling (optional)
4. Customer selects new date/time
5. Customer optionally enters reason
6. Customer submits reschedule request
7. System updates order status to `rescheduling`
8. System creates rescheduling proposal:
   - Proposed DateTime: Customer-selected date/time
   - Proposed By: Customer information
   - Rescheduling Reason: Customer-provided reason (if any)
9. System creates status history entry:
   - Status: `rescheduling`
   - Previous Status: Previous status
   - Changed By: Customer information
   - Reason: Customer-provided reason (if any)
   - Timestamp: Current time
10. Chef is notified of the reschedule request
11. System displays success message

**Postconditions:**

- Order status is `rescheduling`
- Rescheduling proposal is stored
- Chef is notified and can accept/reject the proposal

**Related Endpoints:**

- `POST /v1/customer/orders/{id}/action` (action: `propose_reschedule`, proposedDateTime: required, reason: optional)

**Note:** This use case may not be implemented in the current system. Verify with business requirements.

---

## Order Information & Views

### Order Data Structure

Each order contains the following information:

#### Basic Information

- **Order ID**: Unique identifier
- **Order Number**: Human-readable order number
- **Status**: Current order status
- **Created At**: Order creation timestamp
- **Updated At**: Last update timestamp

#### Customer Information

- **Customer Name**: Full name
- **Customer Email**: Email address
- **Customer Phone**: Phone number
- **Customer Avatar**: Profile picture URL

#### Order Items

Each item includes:

- **Item ID**: Unique identifier
- **Dish ID**: Reference to dish
- **Dish Name**: Name of the dish
- **Image**: Dish image URL
- **Quantity**: Number of items
- **Price**: Unit price
- **Subtotal**: Line total (quantity × price)
- **Portion Size**: Size option (e.g., "Small", "Large", "Family")
- **Spice Level**: Spice preference (none, mild, medium, hot, extraHot)
- **Special Instructions**: Item-specific instructions
- **Customizations**: Array of modifier groups with modifiers
  - Group Name: e.g., "Add-ons", "Toppings"
  - Modifiers: Array of { name, price }

#### Pricing Information

- **Subtotal**: Sum of all item line totals
- **Delivery Fee**: Delivery charge
- **Tax**: Tax amount
- **Service Fee**: Service charge (if applicable)
- **Discount Amount**: Discount value (if applicable)
- **Discount Code**: Discount code used (if applicable)
- **Total**: Final amount

#### Payment Information

- **Payment Method**: cash, card, or online
- **Payment Status**: pending, paid, or refunded

#### Delivery Information

- **Delivery Address**: Complete address object
  - Street
  - Apartment (optional)
  - City
  - State
  - Zip Code
  - Country
  - Instructions (optional)
- **Delivery Instructions**: Additional delivery notes
- **Delivery Window**: asap, 30min, 1hour, 2hours, nextday, custom
- **Scheduled At**: Scheduled delivery time
- **Delivery Status**: Current delivery status
  - not_scheduled
  - scheduled
  - assigned
  - pickup_enroute
  - pickup_arrived
  - picked_up
  - delivery_enroute
  - delivery_arrived
  - delivered
  - failed
  - cancelled
- **Tracking URL**: Delivery tracking link (if available)
- **Nash Integration**: Nash delivery service IDs (if applicable)

#### Rescheduling Information

- **Proposed DateTime**: Proposed new delivery time
- **Proposed By**: Who proposed (chef or customer)
- **Rescheduling Reason**: Reason for rescheduling
- **Rescheduling History**: Array of rescheduling attempts
  - Proposed DateTime
  - Proposed By
  - Reason
  - Timestamp
  - Action: proposed, accepted, or rejected
  - ID: Unique identifier

#### Refund Information

- **Refund Amount**: Amount refunded
- **Refund Date**: Date of refund
- **Refund Status**: refunded or not_refunded

#### Status History

Array of status changes with:

- **Status**: New status
- **Previous Status**: Previous status (null for initial)
- **Changed At**: Timestamp of change
- **Reason**: Reason for change (if provided)
- **Changed By**: User information
  - Email
  - ID
  - Name
  - Role

#### Action History

Array of actions performed with:

- **ID**: Unique identifier
- **Action**: Description of action
- **Doer**: Who performed the action
- **Timestamp**: When action was performed

---

## Rescheduling Workflows

### Workflow 1: Chef Proposes Reschedule

1. **Initial State**: Order status is `paid`
2. **Chef Action**: Chef proposes new delivery date/time
3. **System Action**: Order status changes to `rescheduling`
4. **Customer Notification**: Customer is notified of proposal
5. **Customer Options**:
   - **Accept**: Order status → `confirmed`, order proceeds to preparation
   - **Reject**: Order status → `cancelled`, refund initiated, **order terminated** ⚠️
6. **Final State**: Order proceeds based on customer decision

**⚠️ Important:** Currently, when a customer rejects a chef's reschedule proposal, the order is **immediately cancelled and refunded**. This is a terminal action with no option for counter-proposal.

**Potential Enhancement:** Consider allowing customers to propose a counter-offer instead of immediately rejecting (see "Business Logic Decision" in CUSTOMER-UC-003).

### Workflow 2: Customer Proposes Reschedule

1. **Initial State**: Order status is `paid` or `confirmed`
2. **Customer Action**: Customer proposes new delivery date/time
3. **System Action**: Order status changes to `rescheduling`
4. **Chef Notification**: Chef is notified of proposal
5. **Chef Options**:
   - **Accept**: Order status → `confirmed`, order proceeds to preparation
   - **Reject**: Order status → `cancelled`, refund initiated, order terminated
   - **Propose Different Time**: Order status remains `rescheduling`, new proposal created (customer can then accept/reject)
6. **Final State**: Order proceeds based on chef decision

### Workflow 3: Multiple Reschedule Proposals (Chef Counter-Proposals)

1. **Initial State**: Order status is `rescheduling` (customer proposed)
2. **Chef Action**: Chef proposes a different time (counter-proposal)
3. **System Action**: New proposal is added to rescheduling history
4. **Status**: Order remains in `rescheduling` status
5. **History**: All proposals are tracked in rescheduling history
6. **Customer Options**:
   - **Accept**: Order status → `confirmed`
   - **Reject**: Order status → `cancelled`, refund initiated
7. **Final State**: One party accepts or rejects, ending rescheduling

**Note:** Currently, customers cannot propose counter-offers when rejecting a chef's proposal. If this feature is needed, it would require:

- New action: `propose_counter_reschedule` (or allow `propose_reschedule` from customer when order is in `rescheduling` status)
- UI updates to show "Reject & Propose Alternative" option
- Backend support for customer-initiated proposals during rescheduling state

---

## Business Logic Decision: Customer Rejection of Chef's Reschedule Proposal

### Current Implementation

**Scenario:** Chef proposes a new delivery time → Customer rejects the proposal

**Current Behavior:**

- Order status: `rescheduling` → `cancelled`
- Refund is immediately initiated
- Order is terminated (no recovery possible)
- This is a **terminal action**

### Question: Should Customers Be Able to Propose Counter-Offers?

When a chef proposes a reschedule and the customer doesn't like the proposed time, there are two possible approaches:

#### Option A: Reject = Cancel + Refund (Current Implementation)

**Behavior:**

- Customer can only **Accept** or **Reject & Refund**
- Rejection immediately cancels the order
- No option for counter-proposal
- Order cannot be recovered once rejected

**Pros:**

- Simple, clear workflow
- Prevents endless back-and-forth negotiations
- Forces quick decision-making
- Reduces complexity in UI and backend

**Cons:**

- Less flexible for customers
- May lead to unnecessary cancellations
- Lost revenue opportunity
- Poor customer experience if they just want a different time

#### Option B: Reject = Allow Counter-Proposal OR Cancel + Refund

**Behavior:**

- Customer can:
  - **Accept** the chef's proposal
  - **Reject & Propose Alternative Time** (counter-proposal)
  - **Reject & Cancel Order** (with refund)
- If customer proposes alternative, order stays in `rescheduling` status
- Chef can then accept/reject the counter-proposal
- Allows negotiation without immediate cancellation

**Pros:**

- More flexible and customer-friendly
- Reduces unnecessary cancellations
- Better customer experience
- More opportunities to save orders
- Similar to how chefs can propose different times when customer proposes

**Cons:**

- More complex UI/UX (need to show both options)
- Potential for extended negotiations
- More complex backend logic
- Need to handle multiple proposal rounds

### Recommendation

**For Better Customer Experience:** Implement **Option B** - Allow customers to propose counter-offers when rejecting a chef's reschedule proposal.

**Implementation Requirements for Option B:**

1. **New Customer Action:** `propose_counter_reschedule` or extend `propose_reschedule` to work when order is in `rescheduling` status (customer-initiated)

2. **UI Changes:**

   - Replace single "Reject & Refund" button with two options:
     - "Propose Different Time" (opens reschedule modal)
     - "Cancel Order & Refund" (confirmation required)

3. **Backend Changes:**

   - Allow `propose_reschedule` action from customer when order status is `rescheduling` and chef proposed
   - Track counter-proposals in rescheduling history
   - Maintain order in `rescheduling` status during negotiations

4. **Workflow:**
   ```
   Chef proposes → Customer rejects & proposes alternative →
   Chef can accept/reject/propose another time →
   Continue until one party accepts or cancels
   ```

### Decision Matrix

| Factor                  | Option A (Current)       | Option B (Counter-Proposal) |
| ----------------------- | ------------------------ | --------------------------- |
| **Customer Experience** | ⭐⭐                     | ⭐⭐⭐⭐⭐                  |
| **Order Retention**     | Low                      | High                        |
| **Complexity**          | Low                      | Medium                      |
| **Negotiation Risk**    | None                     | Possible                    |
| **Revenue Impact**      | Negative (cancellations) | Positive (saved orders)     |

### Next Steps

1. **Product/Business Decision:** Determine which approach aligns with business goals
2. **If Option B:**
   - Update use case `CUSTOMER-UC-003` to include counter-proposal option
   - Add new use case `CUSTOMER-UC-005: Propose Counter-Reschedule`
   - Update rescheduling workflows
   - Plan UI/UX changes
   - Plan backend API changes

---

## Error Handling & Edge Cases

### Duplicate Status History Entries

**Problem:** Duplicate status history entries may be created when:

- Both customer and chef-portal endpoints are called for the same action
- Race conditions in concurrent requests
- Backend API creates duplicate entries

**Solution:**

- Frontend automatically detects and removes duplicates
- Duplicates are identified by:
  - Same status and previousStatus
  - Timestamps within 5 seconds
  - Same or similar changedBy information
- Most recent entry with complete information is kept
- Warnings are logged in development mode

**Related Files:**

- `lib/order-utils.ts` - Deduplication logic
- `services/orders.service.ts` - Service with deduplication

### Invalid Status Transitions

**Problem:** Attempting to transition to an invalid status.

**Solution:**

- Backend validates status transitions
- Frontend only shows valid actions based on current status
- Invalid transitions return error responses

### Missing Required Information

**Problem:** Actions requiring information (reason, date/time) are submitted without required fields.

**Solution:**

- Frontend modals validate required fields
- Backend validates required parameters
- Error messages guide users to provide missing information

### Concurrent Actions

**Problem:** Multiple users attempt to perform actions on the same order simultaneously.

**Solution:**

- Backend uses database transactions
- Status checks prevent invalid transitions
- Frontend disables action buttons during processing
- In-flight request tracking prevents duplicate calls

### Network Failures

**Problem:** Network errors during order actions.

**Solution:**

- Error messages displayed to user
- Retry mechanisms (if applicable)
- Order state remains unchanged on failure
- User can retry the action

### Order Not Found

**Problem:** Attempting to access an order that doesn't exist or user doesn't have access to.

**Solution:**

- 404 error returned
- Error message displayed to user
- User redirected to orders list

---

## API Endpoints Summary

### Chef Portal Endpoints

| Endpoint                             | Method | Description                                    |
| ------------------------------------ | ------ | ---------------------------------------------- |
| `/v1/chef-portal/orders`             | GET    | List orders (with pagination, search, filters) |
| `/v1/chef-portal/orders/{id}`        | GET    | Get order details                              |
| `/v1/chef-portal/orders/{id}/status` | PATCH  | Update order status                            |
| `/v1/chef-portal/orders/{id}/action` | POST   | Perform order action                           |
| `/v1/chef-portal/orders/{id}`        | DELETE | Delete order                                   |

### Customer Endpoints

| Endpoint                          | Method | Description                                                 |
| --------------------------------- | ------ | ----------------------------------------------------------- |
| `/v1/customer/orders/{id}`        | GET    | Get order details                                           |
| `/v1/customer/orders/{id}/action` | POST   | Perform order action (accept_reschedule, reject_reschedule) |

### Order Actions

| Action               | Who Can Use    | Status Transition                             |
| -------------------- | -------------- | --------------------------------------------- |
| `confirm`            | Chef           | `paid` → `confirmed`                          |
| `reject`             | Chef           | `paid` → `rejected`                           |
| `propose_reschedule` | Chef, Customer | `paid`/`rescheduling` → `rescheduling`        |
| `accept_reschedule`  | Chef, Customer | `rescheduling` → `confirmed`                  |
| `reject_reschedule`  | Chef, Customer | `rescheduling` → `cancelled`                  |
| `start_preparing`    | Chef           | `confirmed` → `preparing`                     |
| `mark_ready`         | Chef           | `preparing` → `ready`                         |
| `send_for_delivery`  | Chef           | `ready` → `outForDelivery`                    |
| `mark_delivered`     | Chef           | `ready`/`outForDelivery` → `delivered`        |
| `cancel`             | Chef           | `confirmed`/`preparing` → `cancelled`         |

---

## Related Documentation

- [ORDER_STATUS_HISTORY.md](./ORDER_STATUS_HISTORY.md) - Status history management and duplicate handling
- `lib/order-utils.ts` - Order utility functions (deduplication, validation)
- `services/orders.service.ts` - Order service implementation
- `types/orders.types.ts` - TypeScript type definitions
- `hooks/use-orders.ts` - React hooks for order management
- `components/features/orders/` - Order UI components

---

## Version History

- **v1.0** - Initial documentation (Current)
  - Comprehensive use cases for chef and customer
  - Order status flow and transitions
  - Rescheduling workflows
  - Error handling and edge cases

---

## Notes

- This document is based on the current implementation as of the documentation date
- Some customer use cases may not be fully implemented - verify with business requirements
- API endpoints and actions may vary based on backend implementation
- Status transitions and business rules should be validated with the backend team
