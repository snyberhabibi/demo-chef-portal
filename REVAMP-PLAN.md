# Chef Portal Revamp Plan — Billion-Dollar Edition

**Sources:** Codebase audit (35+ routes), Visual audit (8.1/10), Real portal Chrome audit, Design research (Stripe/Linear/Airbnb/Notion)

---

## PHASE 1: Critical Fixes + Design System Upgrade

### 1.1 Fix Broken Things
- [ ] Fix 3 broken Unsplash images (falafel on /menu, mansaf + falafel on /store-preview)
- [ ] Fix sidebar nav touch targets: bump from 39px to 48px (padding 12px 12px)
- [ ] Fix multiple H1 tags on /orders — remove redundant page title when top bar shows it
- [ ] Fix toggle off-state color: replace `#8a7884` with warmer `#c4b8bf` so it doesn't read as gray
- [ ] Remove /modifiers page and sidebar link (per Yusuf's request)

### 1.2 Design System Polish (Stripe/Linear-inspired)
- [ ] **Skeleton loading states** for every page — card-shaped, table-row-shaped, with shimmer animation. This is the #1 signal of a premium product.
- [ ] **Hover micro-interactions** on all cards — subtle 2px lift + shadow-card-2 on hover with 150ms transition
- [ ] **Page transitions** — fade-up on route change (200ms)
- [ ] **Consistent badge taxonomy** — map all statuses to 6 tiers: neutral/info/positive/negative/warning/urgent
- [ ] **Toast timing matrix** — 4s auto-dismiss for success, 6s if has undo, persistent if loading

### 1.3 Responsive Layout Upgrade
- [ ] **Desktop 2-column layouts** where appropriate: order detail (items left, summary right), profile form (form left, preview right)
- [ ] **Content max-widths**: forms at 680px, lists at 1000px, dashboards full-width — centered with generous margins
- [ ] **Container queries** on dish/bundle grids: 2 cols → 3 → 4 → 5 based on container width (not viewport)
- [ ] **Sticky elements**: sidebar footer, action bars, preview panels all position: sticky

---

## PHASE 2: Navigation + Shell Upgrade

### 2.1 Sidebar Rework (Linear-inspired dimmed sidebar)
- [ ] Match real portal grouping: **Overview** (Dashboard, Orders, Reviews), **Menu Management** (Dishes, Bundles, Custom Menu Sections), **Operations** (Address Management, Buy Packaging), **Help & Guides** (Tutorials, Portal Guide), **Account** (Account Settings, Profile, Payment Methods)
- [ ] Active state: subtle left border accent (2px red) + cream bg — not a full background fill
- [ ] Collapsible sidebar (icon-only mode) with smooth 200ms transition
- [ ] "New" badges on Bundles, Buy Packaging, Tutorials (matching real portal)
- [ ] Mobile: hamburger opens a full drawer overlay (not bottom sheet) with the same nav items + chef card + sign out

### 2.2 Top Bar Upgrade
- [ ] Desktop: breadcrumb trail (Dashboard > Orders > #1042) not just a title
- [ ] Right side: search icon (opens command palette), notification bell with count badge, user avatar dropdown
- [ ] Avatar dropdown: Profile, Account Settings, Payment Methods | Sign out

### 2.3 Bottom Tab Bar (Mobile)
- [ ] 5 tabs: Home, Orders (badge), Menu, Profile, More
- [ ] "More" opens the full drawer (same as hamburger)
- [ ] Active tab: subtle red color + bolder weight (not full fill)
- [ ] Safe-area-inset-bottom for iOS devices

---

## PHASE 3: Page-by-Page Rebuild

### 3.1 Dashboard
**Mode A (Onboarding):**
- [ ] 3-phase unified onboarding (Get Approved → Set Up Kitchen → Go Live) — KEEP current implementation
- [ ] Add animated progress ring (SVG circle) instead of just a bar
- [ ] Phase headers get colored left borders (orange = compliance, sage = setup, red = go-live)
- [ ] Inline first-dish form on step 5 — KEEP current implementation
- [ ] Add confetti animation when a phase completes

**Mode B (Active):**
- [ ] **Stat cards with sparklines** — 30-day trend line inside each stat card (SVG path, 40px tall)
- [ ] **Urgent strip** with dismiss functionality and proper urgency ordering
- [ ] **Quick actions** as larger, more visual cards (icon + title + subtitle) not just buttons
- [ ] **Recent orders** with action buttons that fire toasts — KEEP current
- [ ] Add "Today's summary" section: "4 orders today, $186 revenue, 2 pending confirmation"

### 3.2 Orders
- [ ] Match real portal's **12 status filter tabs**: All, Confirmed, Paid, Preparing, Ready, Pickup Ready, Out for Delivery, Delivered, Picked Up, Rescheduling, Cancelled, Rejected
- [ ] **Order cards match real portal format**: order hash ID, delivery type badge, customer + date + time, status dot, price + payout, ready-by yellow pill, item details with modifier grid
- [ ] **Search bar** full-width below filters (not expandable icon)
- [ ] **Pagination** with rows-per-page selector (12/24/48/96) + "Showing X-Y of Z" + page buttons
- [ ] Add more mock orders (12+ to show pagination)
- [ ] Order card click → expand inline OR navigate to detail (TBD — real portal uses inline expansion)

### 3.3 Order Detail
- [ ] **2-column layout on desktop** (items + customer left, timeline + summary right) — matching real portal
- [ ] **ETA banner** (yellow) with countdown timer for ready/readyForPickup orders
- [ ] **Action buttons per status**: Confirm (for paid), Start Preparing (for confirmed), Mark Ready (for preparing), Mark Picked Up (for readyForPickup)
- [ ] **Cancel/Reject/Reschedule modals** — bottom sheets on mobile, dialogs on desktop
- [ ] **Print Label button** (visual only)
- [ ] **Order items** with full modifier display: PORTION, custom options, price deltas
- [ ] **Chef payout** prominently displayed with decorative circle

### 3.4 Menu (Dishes)
- [ ] **"Create Dish" opens a modal** with "From Scratch" vs "From Template" choice (matching real portal)
- [ ] **Category tabs with emoji icons**: All, Appetizers 🥑, Main Dishes 🍖, Soups 🍲, Salads 🥗, Bakery 🍞, Pastries 🍓, Desserts 🍰, Coffee ☕, Drinks 🍺
- [ ] **5-column grid on desktop** (matching real portal, using container queries)
- [ ] **Dish cards**: image, status badge overlay, category label, dish name, price, star rating + review count
- [ ] **3-dot menu per card**: Edit, Publish/Unpublish, Archive, Delete (with confirmation dialog)
- [ ] **Pagination** with rows-per-page selector
- [ ] Add "No Image" placeholder for cards without photos

### 3.5 Dish Creation Wizard
- [ ] **5-step FormWizard** (matching real portal exactly): Dish Details, Media, Specs & Portions, Availability, Customizations
- [ ] **Left sidebar step navigation** with numbered circles, green checks for completed, progress percentage
- [ ] **Live preview card** in sidebar (dish name, category, price, image, status, lead time)
- [ ] **Tip boxes** per step (yellow/gold bg)
- [ ] **Bottom navigation**: Back | step dots | Continue
- [ ] **Step 1**: Name*, Description*, Cuisine* (searchable select), Category* (select), Status (Draft/Published), Lead Time (number + unit dropdown)
- [ ] **Step 2**: Drag-and-drop upload zone, up to 4 images, "First image = primary" label
- [ ] **Step 3**: Spice levels (toggle buttons), Portion sizes (add/remove rows with label + size + price), Ingredients/Allergens/Dietary multi-selects
- [ ] **Step 4**: Max quantity/day, Available days (weekday toggles)
- [ ] **Step 5**: Add customization groups (modifier group + required toggle + selection type + modifiers list)
- [ ] Navigation protection: "Discard changes?" dialog on back/exit

### 3.6 Bundles
- [ ] Match real portal layout: 4-column grid, status badge overlay, item count badge, "From $X" pricing
- [ ] 3-dot menu per card: Edit, Publish/Unpublish, Archive, Delete
- [ ] Pagination

### 3.7 Custom Menu Sections
- [ ] **Drag-to-reorder** with proper drag handles and accessibility announcements
- [ ] Each row: drag handle, section name, dish count, Active/Inactive status badge, 3-dot menu
- [ ] "Create Section" button
- [ ] StoreFrontIndicator tooltip showing where sections appear

### 3.8 Reviews
- [ ] **3 tabs**: Chef Profile (default), Dishes, Bundles
- [ ] **Rating summary**: large rating number + stars + count + distribution bars
- [ ] **Sort dropdown**: Newest, Oldest, Highest, Lowest
- [ ] **Review cards**: avatar, name, time ago, star rating, review text, review images
- [ ] **Reply capability** (our enhancement over the real portal — real portal is read-only)
- [ ] **Pagination**
- [ ] Dishes/Bundles tabs show expandable accordion per item with reviews inside

### 3.9 Profile (5-step wizard)
- [ ] Match real portal's **5 steps**: Basic Info, About You, Cuisines, Branding, Operations
- [ ] Same FormWizard layout as dish creation (sidebar steps + main content + progress + tips)
- [ ] **Step 1**: Business Name*, Years of Experience
- [ ] **Step 2**: Bio, Story, What Inspires Me (3 textareas)
- [ ] **Step 3**: Cuisines multi-select with emoji flags, removable tags
- [ ] **Step 4**: Banner image upload (1920x600 recommended) with preview
- [ ] **Step 5**: Timezone, Available toggle, Auto Accept toggle, Pickup toggle, Weekly schedule builder
- [ ] Save + Discard in header

### 3.10 Operations (expanded from Profile Step 5)
- [ ] Accessible as standalone page AND as Profile step 5
- [ ] **4 store states**: Pending, Approved-OFF, Live, Rejected — KEEP current implementation
- [ ] **Weekly schedule builder**: collapsible per-day with start/end time pickers, add/remove slots
- [ ] **Auto Accept** toggle with explanation text
- [ ] **Pickup Settings**: enabled toggle + instructions textarea

### 3.11 Payment Methods
- [ ] **Stripe Connect status indicator**: Not Connected, Onboarding, Pending, Restricted, Enabled, Failed
- [ ] Match real portal: "About Stripe Connect" info section (Secure Payments, Fast Payouts, Transparent Fees)
- [ ] 3-state demo toggle — KEEP current but refine visuals
- [ ] Add transaction history table (mock data)

### 3.12 Account Settings
- [ ] Match real portal sections: Profile (avatar + name), Contact Info (email read-only + phone with change), Security (change password)
- [ ] **Phone change flow**: 2-step (enter number → verify OTP) — show as mock
- [ ] **Password change dialog**: current + new (with requirements checklist) + confirm
- [ ] Notification preferences matrix — KEEP current

### 3.13 Tutorials
- [ ] **Progress tracker**: X of 8 completed with progress bar
- [ ] **8 tutorial cards** (matching real portal exactly):
  1. Managing Orders (14 steps)
  2. Creating Dishes (12 steps)
  3. Creating Bundles (10 steps)
  4. Modifier Groups (6 steps) — KEEP even though we removed the page, tutorials can reference it
  5. Custom Menu Sections (7 steps)
  6. Chef Profile (10 steps)
  7. Account Settings (7 steps)
  8. Address Management (6 steps)
- [ ] Each card: icon, title, description, step count badge or "Completed" badge, "Start tutorial" / "Run again" action
- [ ] 3-column grid on desktop

### 3.14 Portal Guide
- [ ] **2 tabs**: Video Tutorials (YouTube embed), Chef Playbook (PDF viewer or link)
- [ ] YouTube video embed for the Chef Success Playbook
- [ ] "View Full Playbook PDF" button

### 3.15 Address Management
- [ ] Match real portal: map pin icon, address label, "Primary" badge, street/city/state/zip, pickup instructions
- [ ] "Edit Address" button in header
- [ ] Single address view (not multi-address)

### 3.16 Buy Packaging
- [ ] **4 product cards** matching real portal: Large Catering Bags, Half Tray Boxes, Full Tray Boxes, All Take-Out Supplies
- [ ] "Buy Now" buttons with external link icons
- [ ] Product images (or good placeholders)

### 3.17 Store Preview (our enhancement)
- [ ] Fix broken images
- [ ] Polish the customer-facing view: hero banner, chef info, dish grid, "Add to Cart" buttons
- [ ] "Preview Mode" banner at top
- [ ] Back to Dashboard link

---

## PHASE 4: Premium Interactions

### 4.1 Command Palette (Cmd+K)
- [ ] Opens a modal search overlay
- [ ] Search across: pages, orders, dishes, settings
- [ ] Recent items on empty state
- [ ] Keyboard navigation (J/K/Enter/Escape)
- [ ] Direct actions from results

### 4.2 Keyboard Shortcuts
- [ ] `?` shows shortcut overlay
- [ ] `G` then `D` = Dashboard, `G` then `O` = Orders, `G` then `M` = Menu
- [ ] `J`/`K` for list navigation on orders and menu pages
- [ ] `Escape` to go back

### 4.3 Notification Center
- [ ] Bell icon in top bar opens a dropdown/drawer
- [ ] Categories: Orders, Reviews, System
- [ ] Mark read/unread, dismiss
- [ ] Mock notification data

### 4.4 Dark Mode (optional stretch)
- [ ] Toggle in settings or auto-detect
- [ ] All colors mapped to dark variants (already defined in design handoff CSS)

---

## PHASE 5: Onboarding Integration

### 5.1 Unified Onboarding (already built, needs polish)
- [ ] 9-step journey across 3 phases — KEEP and polish
- [ ] Intro call moved to step 8 (before Go Live) — DONE
- [ ] Inline first-dish form on step 5 — KEEP
- [ ] Add document upload mockup for Food Handler/Insurance steps
- [ ] Add proposal review mockup for step 2
- [ ] Add "Schedule Call" mockup for step 8 with calendar picker

### 5.2 Welcome Page
- [ ] Polish animations (stagger reveal, confetti)
- [ ] Each step card links to the right page
- [ ] "Skip for now" → Dashboard Mode A

### 5.3 Login
- [ ] Magic link primary — KEEP
- [ ] Google SSO — KEEP
- [ ] Password fallback — KEEP
- [ ] Add "First time? Check your email for your login link" helper text

---

## Implementation Strategy

### Agent Army Deployment (5 parallel agents):

**Agent 1: Design System + Shell** — globals.css, layout, sidebar, top bar, bottom tabs, skeleton components, toast upgrade, hover/transition system

**Agent 2: Dashboard + Onboarding** — Dashboard Mode A (polish), Mode B (sparklines, quick actions), Welcome page, Login page

**Agent 3: Orders + Order Detail** — 12 status tabs, real portal card format, pagination, order detail 2-column layout, action modals

**Agent 4: Menu + Dish Wizard + Bundles** — "From Scratch/Template" modal, 5-step wizard, category tabs with emojis, 5-col grid, bundle grid, sections drag-to-reorder

**Agent 5: All Other Pages** — Profile (5-step), Operations, Reviews (3-tab + reply), Payments, Settings, Tutorials (8 cards), Portal Guide, Address, Packaging, Store Preview, remove modifiers

---

## Success Criteria

When this revamp is done, every page should pass this checklist:

1. [ ] Real Yalla Bites logo visible
2. [ ] Every button/link navigates somewhere
3. [ ] Skeleton loading state exists (even if brief)
4. [ ] Hover micro-interactions on all cards
5. [ ] 44px+ touch targets on all interactive elements
6. [ ] Single H1 per page
7. [ ] Cream bg, brown text, brown-tinted shadows — no grays
8. [ ] Plus Jakarta Sans for display numbers, Inter for body
9. [ ] Mobile-first: works at 375px without horizontal scroll
10. [ ] Consistent badge/status colors (6-tier system)
11. [ ] Toast feedback on every action
12. [ ] Empty states with illustration + CTA (never "No items found")
13. [ ] Content max-width appropriate for the page type
14. [ ] Page feels like it belongs in Stripe/Linear — polished, calm, confident
