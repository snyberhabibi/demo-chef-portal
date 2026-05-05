# Hotplate Chef Portal - Full Competitive Analysis

**Analysis Date:** May 4, 2026
**Portal URL:** https://portal.hotplate.com
**Help Center:** https://help.hotplate.com/en/
**Learning Resources:** https://www.learn.hotplate.com/
**Account Used:** Yusuf kitchen (yusufkitchen)

---

## 1. Portal Structure

### Sidebar Navigation (12 items)
The portal uses a left sidebar with the following navigation:

**Primary (top section):**
1. **Drops** (`/drops`) - Core feature, the home page. Manages flash sale events.
2. **Orders** (`/orders`) - Incoming and completed order management.
3. **Prep** (`/prep`) - Prep list/kitchen production planning.
4. **Inbox** (`/inbox`) - Customer messaging and blast communication.
5. **Insights** (`/insights`) - Analytics dashboard with financial + subscriber metrics.
6. **Get help** - Triggers help/support sidebar.

**Secondary (bottom section):**
7. **Payout** (`/transactions`) - Financial transactions, Stripe integration.
8. **Customers** (`/customers`) - Customer list, subscriber management, messaging groups.
9. **Reviews** (`/reviews`) - Customer review management (published + featured).
10. **Items** (`/items`) - Menu item library (global, reusable across drops).
11. **Discounts** (`/discounts`) - Discount code management.
12. **Locations** (`/locations`) - Pickup location management.

**Footer:**
- Kitchen name + avatar
- **Settings** panel (slides in from right)

### Top Bar
Every page has:
- Page title
- Global search bar with "/" keyboard shortcut
- Page-specific action buttons (e.g., "Create a drop", "Create item")

### Mobile Navigation
Bottom tab bar with: Drops, Orders, Prep, Inbox, Insights, "Open menu" (hamburger)

---

## 2. The "Drops" Model - End to End

### Core Concept
Hotplate is **pre-order based only**. There is no "always-on" menu. Customers can ONLY order during a "drop" - a time-limited window where a batch of items becomes available for purchase.

### The Drop Lifecycle

```
DRAFT --> SCHEDULED --> LIVE (Orders Open) --> ORDERS CLOSED --> PICKUP --> COMPLETE
```

### Step-by-Step Flow

#### Step 1: Create a Drop (Basic Info tab)
Fields:
- **Drop name** - Text field (suggested: "drop #1" or "drop + date")
- **Description** - Text area
- **Cover image** - Upload area at top of panel (with image edit icon)
- **When customers pickup:**
  - Date picker (e.g., "Sat, May 09")
  - Time range (e.g., "12:00 PM - 04:00 PM")
  - Can add multiple pickup windows via "+" button
  - Settings gear icon (opens pickup window config with "Max orders per pickup time")
  - Location picker ("Pick a location" dropdown)
  - Timezone display ("Setting times in CDT")
- **When orders open and close:**
  - Orders open: Date + Time (e.g., "Wed, May 06 06:00 PM")
  - Orders close: Date + Time (e.g., "Fri, May 08 12:00 PM")

**Key Design Pattern:** The pickup time is SEPARATE from the order window. Orders open days before pickup, so the chef knows exactly how much to cook.

#### Step 2: Add Menu Items (Menu tab)
- Empty state: "Your menu is empty - Add some items to your drop"
- "+ Add Items" button
- Items are pulled from the global Items library or created inline
- Each item gets inventory set per-drop
- Items can be organized into sections
- Sections can have shared inventory ("Section Restrictions")
- Drag-and-drop reordering supported

#### Step 3: Summary & Schedule (Summary tab)
- **Drop text** - Auto-generated message sent to subscribers just before orders open
  - Shows "Draft" badge before scheduling
  - Content: "{Kitchen name} is about to drop!"
  - Can be edited
- **Timeline view:**
  - Orders open date
  - "Add reminder" button (sends reminder to subscribers who haven't ordered, only if inventory remains)
  - Orders close date
- **Options:**
  - **Drop visibility:** Public / Private dropdown
  - **Messaging group:** "All customers" or specific customer group
  - **Additional options** (modal):
    - Checkout time: 5 minutes (dropdown)
    - Orders open time: Visible/Hidden toggle
    - Menu: Visible/Hidden toggle
    - Inventory on storefront: Visible/Hidden toggle
    - Add gift card to menu: Toggle (appends gift card to bottom of menu)
- **Schedule drop** button (primary CTA)
- **Delete drop** button (destructive action, red text)

### Drop States on Drops Page
The Drops page organizes drops into three collapsible sections:
1. **Live** (count) - "Visible on your storefront"
2. **Draft** (count) - "Not yet scheduled"
3. **Complete** (count) - "Orders closed, pickups complete"

Each drop card shows: thumbnail image, status badge, title, date icon, location icon.

### Engagement Features
- "You have X people waiting for your next drop" messaging in the Live section empty state
- "Don't keep them waiting!" urgency text
- Subscriber count visible as social proof

### Drop Duplication
A critical workflow feature: "Duplicate +1 week" lets chefs quickly clone a drop for the following week, preserving menu, settings, and timing patterns. This is essential since most Hotplate chefs run weekly drops on a consistent schedule.

---

## 3. Onboarding Flow

### "Get started in a few steps" Banner
Displayed at the top of the Drops page. Shows 3 steps with a progress bar (1/3 format).

**Step 1: Customize your storefront** (green checkmark when done)
- "Add your colors, logo, and bio"
- CTA: "Customize ->"
- Leads to: Storefront settings (Colors, Logos & bio, FAQs & links, Misc.)

**Step 2: Set up to get paid**
- "Get set up with Stripe, our payment processor, so you're ready to payout your earnings"
- CTA: "Set up ->"
- Leads to: Stripe onboarding

**Step 3: Schedule and share your first drop**
- "Set orders to open 3-5 days ahead, so you have time to get subscribers"
- CTA: "Schedule ->"
- Leads to: Drop creation flow

### Additional Onboarding Touchpoints
- **Customers page popup:** "Check your subscriber count, search for a customer, create a new customer. Share your SMS signup link to grow your list" with "Copy SMS signup link" button
- **Reviews page popup:** "Reviews - one of our most loved features. Build customer trust and legitimacy with reviews" with example review
- **Payout page:** "Get started with Stripe" prominent CTA
- **Settings panel:** Red dot on "Set yourself up to get paid" with Stripe button
- **"What's new" badge:** Shows notification count (e.g., 15) in settings

### First 4 Steps (from Help Center)
1. Create your storefront (colors, logo, bio)
2. Set up Stripe for payments
3. Create your first drop with items
4. Share your storefront link and get subscribers

### Recommended First Drop Setup
- Set orders to open 3-5 days after publishing (gives time to get subscribers)
- Start with low inventory ("Start small and sell out!")
- Keep menu choices limited to reduce checkout friction

---

## 4. UX Patterns We Should Adopt

### 4.1 Drop/Flash Sale Creation as a 3-Tab Panel
**Pattern:** Right-panel slide-out with Basic Info | Menu | Summary tabs.
**Why it's better:** The 3-tab structure keeps drop creation focused. Basic Info for logistics, Menu for items, Summary for review + launch. Each tab has a clear purpose. The chef can tab between them without losing context. The panel slides in from the right, keeping the main list visible behind it as context.

### 4.2 Separate "When customers get food" from "When orders are accepted"
**Pattern:** Two distinct time configuration sections:
- "When customers pickup" (the fulfillment window)
- "When orders open and close" (the ordering window)
**Why it's better:** This makes the core concept immediately obvious - orders happen BEFORE the food is ready. Our current flash sale concept could use this same mental model.

### 4.3 Drop Text / Automated Messaging Integration
**Pattern:** The Summary tab shows the auto-generated text message that goes to subscribers. The chef can edit it. There's also an "Add reminder" option between orders open and close.
**Why it's better:** It makes the communication part of the drop creation flow, not a separate system. The chef sees exactly what their customers will receive.

### 4.4 Inventory Visibility Toggle on Storefront
**Pattern:** "Inventory on storefront: Visible/Hidden" toggle in Additional Options.
**Why it's better:** Some chefs WANT customers to see "only 3 left!" for urgency. Others prefer to hide it. Giving the choice is smart.

### 4.5 Checkout Timer
**Pattern:** "Checkout time: 5 minutes" - a countdown once a customer starts checkout.
**Why it's better:** Prevents cart-hoarding during high-demand drops. When 50 people are trying to buy limited inventory, you don't want one person holding items in their cart for 30 minutes.

### 4.6 Section Inventory / Section Restrictions
**Pattern:** Items in a menu section can share a single inventory pool. E.g., 5 different pizza flavors all pulling from 100 balls of dough.
**Why it's better:** This solves the real-world problem of shared ingredients/capacity. Our bundles could benefit from this.

### 4.7 Max Per Pickup Time
**Pattern:** Limit how many of an item can be ordered per pickup time slot.
**Why it's better:** Handles capacity constraints (e.g., "my freezer holds 100 pints per day"). Critical for time-windowed operations.

### 4.8 Prep Page with Multiple View Modes
**Pattern:** Overall | By week | By day | By time tabs with export capability.
**Why it's better:** Chefs think about prep differently depending on the task. Overall for shopping lists, By day for daily cooking plans, By time for pickup staging.

### 4.9 Pre-Drop Customer Chat
**Pattern:** Customers can chat with each other before a drop goes live (toggle in Misc settings).
**Why it's better:** Builds community and excitement. Creates a sense of event around each drop.

### 4.10 Messaging Groups for Targeted Drops
**Pattern:** When creating a drop, you can target a specific "Messaging group" instead of all customers.
**Why it's better:** Enables VIP drops, location-specific drops, or special customer segment targeting.

### 4.11 Consistent Empty States with Clear CTAs
**Pattern:** Every empty state has: Icon + Title + Description + Primary Action Button + Learn More link
Examples:
- "No orders found" + "Reset filters"
- "Your menu is empty" + "Add Items"
- "Nothing coming up!" + "Learn more about prep"
- "No locations found" + "Add Location"
**Why it's better:** Never leaves the user stuck. Always shows the next step.

### 4.12 Drop Visibility (Public/Private)
**Pattern:** Drops can be Public or Private. Private drops are only visible to targeted customers.
**Why it's better:** Enables test drops, VIP-only drops, or soft launches.

---

## 5. What We Do Differently (Yalla Bites vs Hotplate)

### 5.1 Fulfillment Model
| Feature | Hotplate | Yalla Bites |
|---------|----------|-------------|
| Pickup | Porch pickup (primary) | Yes |
| Delivery | Manual setup only, not self-serve, zip-code based, no courier integration | Yes (delivery is a first-class feature) |
| Delivery logistics | Chef handles their own deliveries | Platform-assisted or chef-delivered |
| Fulfillment in drop | Single model per drop | Both delivery AND pickup in same flash sale |

**Hotplate's delivery is a MAJOR weakness.** It requires manual setup by the Hotplate team (1-2 day turnaround), is zip-code-based only (no radius), doesn't integrate with any courier service, and settings don't persist to new drops (must duplicate a template). This is our biggest competitive advantage.

### 5.2 Menu Model
| Feature | Hotplate | Yalla Bites |
|---------|----------|-------------|
| Always-on menu | NO - drops only | YES - permanent menu items |
| Flash sales / drops | Core feature | Additional feature on top of regular menu |
| Meal prep | Not supported | Weekly cutoff ordering model |
| Bundles | "Assorted boxes" feature exists | Full bundle system with quantity selection |

**Hotplate is philosophically opposed to always-on menus.** They explicitly say in their docs that drops create urgency and are "more profitable" than always-on. We support BOTH models, which gives chefs more flexibility.

### 5.3 Customer Model
| Feature | Hotplate | Yalla Bites |
|---------|----------|-------------|
| Subscriber notification | SMS text only | Multi-channel |
| Customer communication | Built-in inbox + blast messaging | Yes |
| Customer groups | Messaging groups | Customer segments |
| SMS signup | Dedicated signup link | Integrated |
| Reviews | Built into platform | Yes |
| Loyalty | Settings section exists | Yes |

### 5.4 Payment Model
| Feature | Hotplate | Yalla Bites |
|---------|----------|-------------|
| Payment processor | Stripe only | Stripe |
| Tips | Built-in tipping | Yes |
| Gift cards | Built-in gift card system | TBD |
| Discounts | Code-based discounts (general, customer-specific, or drop-specific) | Yes |

---

## 6. Implementation Recommendations

### Priority 1: ADOPT WHOLESALE (High value, directly applicable)

**A. 3-Tab Drop/Flash Sale Creation Panel**
Adopt the Basic Info | Menu | Summary tab structure for our flash sale creation. This is clean, proven, and maps perfectly to our model. Just extend it to support both delivery and pickup in the Basic Info tab.

**B. Separate Order Window from Fulfillment Window**
The "When orders open and close" vs "When customers pickup/receive delivery" split is essential. Adopt this exact mental model.

**C. Drop Text / Automated Notifications in Summary Tab**
Show the notification preview directly in the flash sale creation flow. Let chefs see and edit what customers will receive.

**D. Add Reminder Feature**
Between orders open and close, let chefs add a reminder that only goes to subscribers who haven't ordered yet (and only if inventory remains). This drives conversion without annoying existing buyers.

**E. Inventory System: Per-Item, Per-Slot, Section Pools**
Adopt Hotplate's multi-layered inventory system:
- Item-level inventory (total available)
- Max per order (per customer limit)
- Max per pickup time/delivery slot
- Section restrictions (shared inventory across items)

**F. Empty States with Clear CTAs**
Every page should have: meaningful icon + descriptive title + helpful subtitle + primary action button. Never leave the chef stranded.

**G. Prep Page with View Modes**
Overall | By week | By day | By time views for prep lists. Essential for production planning.

**H. Checkout Timer**
Add a configurable checkout countdown (default 5 min) to prevent cart-hoarding during high-demand flash sales.

### Priority 2: ADAPT TO OUR MODEL (Needs modification)

**A. Fulfillment Configuration**
Hotplate only has pickup. We need to expand their "When customers pickup" section to include:
- Pickup windows (date/time/location, same as Hotplate)
- Delivery windows (date/time/delivery zone)
- Option to enable one or both per flash sale
- Delivery fee per zone (self-serve, not manual like Hotplate)

**B. Drop/Flash Sale States**
Adapt their Live | Draft | Complete sections to include our additional states:
- Draft (not scheduled)
- Scheduled (orders not yet open)
- Live (orders open, accepting orders)
- Closed (orders closed, preparing/cooking)
- Fulfilling (out for delivery / pickup in progress)
- Complete (all orders fulfilled)

**C. Customer Storefront**
Hotplate's storefront shows: bio, next drop, past drops. We need to show:
- Bio and branding
- Always-available menu items
- Current flash sale (if live)
- Upcoming flash sales
- Meal prep weekly menu (with cutoff)
- Past orders / reorder

**D. Insights Dashboard**
Adapt their metrics but add:
- Revenue by fulfillment type (delivery vs pickup)
- Delivery zone performance
- Meal prep subscription metrics
- Bundle vs individual item performance

**E. Messaging Groups as Customer Segments**
Hotplate's "Messaging groups" concept maps to our customer segments, but we should add:
- Delivery zone-based segments
- Order frequency segments
- Cuisine preference segments

### Priority 3: SKIP (Doesn't apply to our model)

**A. "Drops-only" philosophy**
Hotplate's entire model rejects always-on menus. We deliberately support both. Don't adopt this constraint.

**B. Manual delivery setup**
Hotplate requires their team to set up delivery (form submission, 1-2 day wait, zip-code spreadsheet). This is terrible UX. Our self-serve delivery setup is a competitive advantage.

**C. Pre-drop customer chat**
While interesting for community building, this adds complexity. Skip for MVP. Can add later.

**D. "Duplicate +1 week" as primary workflow**
Since we have always-on menus AND flash sales, our chefs don't need to duplicate drops as their primary workflow. This is a workaround for Hotplate's drops-only model. We should still support duplication as a convenience feature, but it shouldn't be the expected workflow.

**E. Porch pickup as default**
Hotplate defaults to porch pickup. We should default to delivery (our differentiator) with pickup as secondary option.

---

## 7. Flash Sale / Drops Feature Spec for Yalla Bites

### Overview
A "Flash Sale" in Yalla Bites is our equivalent of a Hotplate "Drop" - a time-limited ordering window for a curated set of items. Unlike Hotplate, our flash sales support BOTH delivery and pickup, and coexist alongside a permanent always-on menu.

### 7.1 Creating a Flash Sale

**Entry Point:** "Create Flash Sale" button on the Flash Sales page (similar placement to Hotplate's "Create a drop")

**Creation Flow: 3-Tab Panel (Slide-in from Right)**

#### Tab 1: Details
- **Flash sale name** (text field)
- **Description** (rich text area)
- **Cover image** (upload, recommended 750x750)
- **Order window:**
  - Orders open: Date + Time picker
  - Orders close: Date + Time picker
- **Fulfillment options:**
  - Toggle: Enable Pickup
    - If enabled: Date + Time range + Location selector
    - Can add multiple pickup windows
    - Max orders per pickup window (optional)
  - Toggle: Enable Delivery
    - If enabled: Date + Time range
    - Delivery zones (auto-populated from chef's configured zones)
    - Delivery fee per zone
    - Can add multiple delivery windows
    - Max orders per delivery window (optional)
- **Fulfillment note** (optional text shown to customers, e.g., "Delivery between 5-8 PM")

#### Tab 2: Menu
- **Add items from library** or **Create new item**
- For each item in the flash sale:
  - Inventory (total available for this sale)
  - Max per order (per customer)
  - Max per fulfillment slot (per pickup window or delivery window)
  - Price override (optional - can be different from regular menu price)
  - Flash sale exclusive badge (if item only available during sales)
- **Menu sections** with drag-and-drop reordering
  - Section inventory (shared pool across section items)
  - Section name and description
- **Add bundle** option (select items for a bundle deal)
  - Bundle price
  - Bundle quantity limits
  - Bundle inventory

#### Tab 3: Summary & Launch
- **Notification preview:**
  - Auto-generated text: "{Kitchen name} is dropping a flash sale!"
  - Editable by chef
  - Preview of how it looks as push/SMS/email
  - Timing: "Sent just before orders open"
- **Timeline visualization:**
  - Orders open (date/time)
  - Optional: Add reminder (for non-buyers, only if stock remains)
  - Orders close (date/time)
  - Fulfillment window(s) (pickup and/or delivery)
- **Options:**
  - Flash sale visibility: Public / VIP Only / Private
  - Target audience: All customers / Customer segment
  - Checkout timer: 3/5/10/15 minutes (default 5)
  - Show inventory on storefront: Yes/No
  - Show order open time before launch: Yes/No
  - Allow gift card purchase in sale: Yes/No
- **Launch / Schedule button** (primary CTA)
- **Save as Draft** (secondary)
- **Delete flash sale** (destructive)

### 7.2 Time Window Configuration

**Order Window:** When customers can place orders
- Open: Typically 3-5 days before fulfillment
- Close: Typically 12-24 hours before fulfillment (gives chef time to cook)

**Fulfillment Windows:** When customers receive their food
- **Pickup:** Specific date + time range + location
  - Example: "Saturday 12pm-4pm at 123 Main St"
  - Multiple windows possible (e.g., Saturday AND Sunday)
- **Delivery:** Specific date + time range
  - Example: "Saturday 5pm-8pm"
  - Automatically shows to customers in configured delivery zones
  - Different delivery fees per zone

### 7.3 Delivery and Pickup Within a Flash Sale

**Both Options Simultaneously:**
When a customer views a flash sale with both delivery and pickup enabled:
1. They see the flash sale items and pricing
2. At checkout, they choose: "Pickup" or "Delivery"
3. **If Pickup:** They select from available pickup windows and see the pickup location
4. **If Delivery:** They enter their address, system validates it's in a delivery zone, shows the delivery fee, and they select a delivery window

**Per-Fulfillment-Type Inventory:**
Items can optionally have separate inventory per fulfillment type:
- 50 available for pickup
- 30 available for delivery
- OR just a shared pool of 80 (either fulfillment type)

### 7.4 Quantity Limits

**Layer 1: Total inventory** - Max items available for entire flash sale
**Layer 2: Per customer** - Max items one customer can buy
**Layer 3: Per fulfillment slot** - Max items per pickup window or delivery window
**Layer 4: Section restriction** - Shared inventory across a group of items

The system enforces the STRICTEST limit. When any limit is hit, the item shows as "Sold Out" to customers.

### 7.5 Customer-Facing View

**Before Orders Open:**
- Flash sale card on storefront with countdown timer
- Item preview (if menu visibility is on)
- "Notify me" button
- "What's a flash sale?" explainer link

**During Ordering Window:**
- Full menu with prices, photos, descriptions
- Inventory indicators (if enabled): "X left" or "Selling fast!"
- Add to cart with quantity selector (respecting per-customer limits)
- Checkout with fulfillment selection (pickup/delivery)
- Checkout timer visible
- Real-time inventory updates

**After Orders Close:**
- "This flash sale has ended" messaging
- "Past flash sales" archive (if enabled)
- "Don't miss the next one - subscribe!" CTA

### 7.6 Order Management During/After Flash Sale

**During Open Window:**
- Real-time order count and revenue
- Live inventory tracking
- Ability to close early or extend window
- Order list with: customer name, items, fulfillment type, special instructions

**After Close:**
- Prep list generated automatically (Overall/By day/By time views)
- Order tickets printable for each fulfillment type
- Delivery manifest (sorted by zone, with addresses)
- Pickup list (sorted by window/timeslot)
- Mark orders as: Preparing > Ready > Picked Up/Delivered
- Customer notification at each status change

### 7.7 Flash Sale States in the Portal

**Flash Sales Page Layout:**
```
LIVE (X) - Currently accepting orders
  [Flash Sale cards with real-time order count]

UPCOMING (X) - Scheduled, orders not yet open
  [Flash Sale cards with countdown to open]

DRAFT (X) - Not yet scheduled
  [Flash Sale cards with "Continue editing" CTA]

PAST (X) - Completed
  [Flash Sale cards with revenue summary]
  [Expandable to show performance metrics]
```

### 7.8 Integration with Regular Menu

Flash sale items can be:
- **Exclusive:** Only available during the flash sale
- **Discounted:** Regular menu items at a special flash sale price
- **Limited edition:** Special versions not on regular menu

The chef portal clearly distinguishes between:
- Always-on menu management (Items page)
- Flash sale curation (Flash Sales page > Menu tab)
- Meal prep weekly menu (Meal Prep page)

---

## Appendix A: Full Settings Structure

### Account
- Social links (Instagram, TikTok, Facebook, Twitter/X)
- Team management (invite collaborators)
- Business settings (name, storefront URL)

### Storefront
- **Colors tab:** 11 pre-built themes (Tuxedo, Matcha, Lagoon, Concord, Ruby, Earth, Ham & Cheese, Kalm, Foundry, Ember, Custom) + custom hex for Theme color, Header color, Page color
- **Logos & bio tab:** Bio text, Header logo upload, Banner image upload
- **FAQs & links tab:** FAQ management, Link-tree style links
- **Misc tab:** Show past sales toggle, Gift cards toggle, Pre-drop chat toggle

### Reminders
- Automated reminder configuration

### Reviews
- Review settings and display options

### Loyalty
- Loyalty program configuration

### Tax
- Tax rate settings

### Checkout
- Checkout configuration

---

## Appendix B: Hotplate's Customer-Facing Storefront

URL format: `https://www.hotplate.com/{kitchenname}`

Structure:
- Kitchen name (header)
- "Gift Card" + "Share" buttons
- Bio card with subscribe CTA ("Never miss a drop")
- **Next Drop** section:
  - If no drop scheduled: "hasn't scheduled their next drop yet" + "Don't miss the next one" subscribe CTA
  - If drop scheduled: Shows drop details + countdown + menu preview
- **Past Drops** section: Archive of completed drops
- Footer: "Powered by Hotplate" + copyright + Support/Privacy/Terms

---

## Appendix C: Help Center Article Index

### Getting Started (6 articles)
1. How Hotplate works
2. How to sell out your first drop
3. Switching to Hotplate from another system
4. How to get subscribers
5. Why should I use Hotplate
6. Your first 4 steps on Hotplate

### Drops (9 articles)
1. How to create a drop
2. How to create and manage menu items
3. How to set up menu item options
4. How to set up assorted boxes and bundles
5. How to set inventory and order limits
6. How do I change the checkout time limit?
7. What additional options can I set up for my drop?
8. How to request delivery set up
9. How to sell gift cards

### Orders and Prep (7 articles)
### Customer Communication (6 articles)
### New Portal FAQs (8 articles - portal relaunched 3/9/26)
### Reports (3 articles)
### Settings (6 articles)
### Payouts (4 articles)

---

## Appendix D: Learning Resources (learn.hotplate.com)

"Recipes for Success by Hotplate" - 6 chapters:
1. **Building Your Brand**
2. **Selling Out Drops** - Key advice:
   - Consistent schedules (open/close same day/time weekly)
   - Hero products (signature items)
   - Menu sections (organized, easy to scan)
   - Low inventory & slow scaling ("start small, sell out")
   - Drop texts & reminders
3. **Understanding Sales**
4. **Marketing IRL (In Real Life)**
5. **Marketing on Social Media**
6. **More Ways to Market Online**

---

## Appendix E: Key Competitive Weaknesses in Hotplate

1. **No self-serve delivery** - Must request setup from Hotplate team, 1-2 day wait, zip-code only, no radius, no courier integration, settings don't persist to new drops
2. **Drops-only model** - No always-on menu, forces chefs into weekly drop cadence
3. **No meal prep support** - No weekly subscription/cutoff model
4. **Limited bundle support** - "Assorted boxes" exist but are basic
5. **No multi-channel fulfillment in a single sale** - A drop is either pickup or delivery, setting up both requires workarounds
6. **Porch pickup focused** - Not designed for delivery-first businesses
7. **Limited customization** - 11 color themes, basic storefront options
8. **No native delivery fee management** - Requires manual spreadsheet upload
9. **SMS-only subscriber notification** - No push notifications, limited email
10. **Manual delivery address collection** - Only prompted when delivery is enabled on a specific drop template
