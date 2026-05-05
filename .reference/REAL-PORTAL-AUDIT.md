# Yalla Bites Chef Portal - Complete Feature Audit

**Source:** https://portal-staging.yallabites.com
**Audited:** 2026-05-04
**Logged in as:** Demo Chef

---

## 1. SIDEBAR NAVIGATION

The sidebar is a fixed left panel with the Yalla Bites logo + "Chef Portal" badge at the top.

### Sidebar Groups & Items

**OVERVIEW**
- Dashboard (`/dashboard`) - house icon
- Orders (`/dashboard/orders`) - clipboard icon
- Reviews (`/dashboard/reviews`) - star icon

**MENU MANAGEMENT**
- Dishes (`/dashboard/dishes`) - utensils icon
- Bundles (`/dashboard/bundles`) - package icon - **"New" badge** (red pill)
- Custom Menu Sections (`/dashboard/custom-menu-sections`) - list icon
- Modifier Groups (`/dashboard/modifier-groups`) - circle/dot icon

**OPERATIONS**
- Address Management (`/dashboard/addresses`) - map pin icon
- Buy Packaging (`/dashboard/buy-packaging`) - shopping bag icon - **"New" badge** (red pill)

**HELP & GUIDES**
- Tutorials (`/dashboard/tutorials`) - book icon - **"New" badge** (red pill)
- Portal Guide (`/dashboard/portal-guide`) - grid/book icon

**ACCOUNT**
- Account Settings (`/dashboard/account-settings`) - gear icon
- Profile (`/dashboard/profile`) - user icon
- Payment Methods (`/dashboard/payment-methods`) - credit card icon

### Sidebar Behavior
- Active item is highlighted with a darker background
- Group headers are uppercase, small, gray text
- Logo links to `/dashboard`
- Hamburger menu button in top bar toggles sidebar open/closed
- Top-right shows user avatar (circle image) + "Demo Chef" name

---

## 2. DASHBOARD (`/dashboard`)

### Header
- "Welcome back," (gray text)
- "Demo Chef" + waving hand emoji (heading)
- "Ready to manage your orders and delight your customers today?" (subtitle)

### KPI Cards (3 cards in a row)
1. **Total Orders** - shows "95" - subtitle "All time orders"
2. **Active Dishes** - shows "3" - subtitle "Published dishes"
3. **Your Total Payouts** - shows "$2,689.65" - subtitle "From completed orders"

### Recent Orders Section
- Heading: "Recent Orders"
- Subtitle: "Latest orders from your customers"
- "View All" link (top right, links to `/dashboard/orders`)
- Shows 5 most recent order cards (same format as Orders page)
- Bottom link: "View all 95 orders" with arrow

### Order Card Format (on dashboard)
Each order card shows:
- Order ID (e.g., `#5cd81fa7`) - truncated hash
- Delivery type badge (e.g., "Delivery" with truck icon)
- Customer name + date + time (e.g., "Raja A. - Today - 2:59 PM")
- Status badge (e.g., "Paid" with green dot)
- Total price (e.g., "$150.00")
- Payout amount (e.g., "$135.00 payout")
- Ready-by date/time in yellow pill (e.g., "Ready by Wed, May 20 - 8:41 AM")
- Item quantity badge (e.g., "1x" in gold circle)
- Item name (e.g., "Mansaf")
- Modifier details as label/value pairs:
  - PORTION: "Full Tray - Serves 10 - $100.00"
  - MEAT TYPE: "Regular"
  - MEAT AMOUNT: "5 lambs +$50.00"

---

## 3. ORDERS (`/dashboard/orders`)

### Breadcrumb
Dashboard > Orders

### Header
- Title: "Orders"
- Subtitle: "Manage and track your orders"

### Status Filter Tabs (horizontal pill buttons)
- All (selected/active state = dark fill)
- Confirmed
- Paid
- Preparing
- Ready
- Pickup Ready
- Out for Delivery
- Delivered
- Picked Up
- Rescheduling
- Cancelled
- Rejected

### Search Bar
- Placeholder: "Search by order ID, customer, or dish..."
- Full width below the filter tabs

### Order Cards (list view, NOT table)
Each order is a card with:
- **Left side:**
  - Order ID hash (e.g., `#5cd81fa7`)
  - Delivery type badge (green "Delivery" pill with truck icon)
  - Customer info line: "Raja A. - Today - 2:59 PM"
- **Right side:**
  - Status badge with colored dot (e.g., green "Paid")
  - Price: "$150.00"
  - Payout: "$135.00 payout" (gray text)
- **Below header:**
  - Ready-by date in yellow/gold pill: "Ready by Wed, May 20 - 8:41 AM"
- **Item details:**
  - Quantity badge (gold circle "1x") + cart icon + dish name
  - Modifier grid below with columns:
    - PORTION (label) -> value
    - MEAT TYPE (label) -> value
    - MEAT AMOUNT (label) -> value with price delta

### Pagination
- "Rows per page" dropdown (default: 12)
- "Showing 1-12 of 95" text
- Page number buttons: 1, 2, 3, 4, 5, ..., 8
- Previous/Next arrow buttons

### Important: No Order Detail Page
Orders display inline as expanded cards. Clicking an order card does NOT navigate to a separate detail page. All order information is visible directly in the list.

---

## 4. DISHES (`/dashboard/dishes`)

### Breadcrumb
Dashboard > Dishes

### Header
- Title: "Dishes"
- Subtitle: "Manage your menu dishes"
- **"+ Create Dish"** button (top right, dark/black)

### Filters
**Status filter pills** (horizontal):
- All (active = dark fill)
- Published
- Draft
- Archived

**Category tabs** (horizontal, scrollable, with emoji icons):
- All
- Appetizers (avocado emoji)
- Main Dishes (meat emoji)
- Soups (soup bowl emoji)
- Salads (salad emoji)
- Bakery (bread emoji)
- Pastries (strawberry emoji)
- Desserts (cake emoji)
- Coffee (coffee emoji)
- Drinks (beer emoji)

### Search
- Placeholder: "Search dishes..."

### Dish Card Grid (responsive grid, 5 columns on desktop)
Each card shows:
- **Image area** (top, square, with rounded corners)
  - Status badge overlay (top-left): colored dot + "Draft"/"Published"/"Archived"
  - 3-dot menu button (top-right): opens dropdown with:
    - Edit (pencil icon)
    - Publish (eye icon)
    - Archive (box icon)
    - Delete (trash icon, red)
  - "No Image" placeholder if no image uploaded (gray icon + text)
- **Below image:**
  - Category label (small, gray, e.g., "Main Dishes")
  - Dish name (bold heading)
  - Price (e.g., "$100.00")

### Pagination
- "Rows per page" dropdown
- "Showing 1-11 of 11"
- Page buttons

---

## 5. DISH CREATION WIZARD (`/dashboard/dishes/new`)

### Entry Point
Clicking "+ Create Dish" opens a modal dialog:
- Title: "Create New Dish"
- Subtitle: "Choose how you want to create your dish"
- Two options:
  1. **Create from Scratch** - "Start with a blank canvas" (icon: clipboard)
  2. **Create from Template** - "Use a pre-made template as a starting point" (icon: copy)
- Close button (X) in top right

### Wizard Layout (after selecting "Create from Scratch")

**Breadcrumb:** Dashboard > Dishes > Create

**Top bar:**
- Title: "Create New Dish"
- Step indicator: "Step 1 of 5"
- Status badge: "Draft"
- "Discard" button (outline)
- "Save Dish" button (dark, primary)

**Left sidebar (step navigation):**
1. **Dish Details** - "Name, description, category & cuisine"
2. **Media** - "Photos & gallery"
3. **Specs & Portions** - "Sizes, dietary & allergens"
4. **Availability** - "Schedule & stock limits"
5. **Customizations** - "Modifiers & add-ons"

Steps show numbered circles (1-5). Completed steps show green checkmarks.

**Progress bar:** 0% indicator below step list

**Preview panel (below steps):**
- Shows a mini dish card preview
- Status badge: "draft"
- Image placeholder: "No image yet"
- Category placeholder: "No category"
- Name: "Untitled Dish"

**Tip box (yellow/gold background):**
- "Tip: Dishes with clear, descriptive names and detailed descriptions get 40% more orders."

**Bottom navigation:**
- "Back" button (left)
- Step dots (5 dots)
- "Continue" button (right, dark)

### Step 1: Dish Details
Fields:
- **Dish Name*** (text input) - placeholder: "e.g., Traditional Shawarma Plate"
- **Description*** (textarea) - placeholder: "Describe the ingredients and flavors..."
- **Cuisine*** (dropdown/combobox) - placeholder: "Select cuisine"
- **Category*** (dropdown/combobox) - placeholder: "Select category"
- **Status** (dropdown) - options: Draft (default), Published, Archived
- **Lead Time*** (number input + unit dropdown)
  - Number placeholder: "e.g., 2.5"
  - Unit options: Hours (default), Days
  - Helper text: "How far in advance customers need to order"

### Step 2: Media
- Upload zone with drag/drop
- "Add images" button (file input)
- "Up to 4 images - PNG, JPG, GIF - Max 25MB each"
- First image becomes primary

### Step 3: Specs & Portions
- **Spice Level** (optional toggle buttons):
  - None, Mild, Medium, Hot, Extra Hot
  - Helper: "Optional. If selected, choose at least 3 levels."
- **Portion Sizes** (required, list with add button):
  - "At least one portion size is required."
  - "Add" button
  - Empty state: "No portion sizes yet" + "Add your first portion size"
- **Ingredients** (multi-select combobox): "Select ingredients"
- **Allergens** (multi-select combobox): "Select allergens"
- **Dietary Labels** (multi-select combobox): "Select dietary labels"

### Step 4: Availability
- **Maximum Quantity Per Day** (number input)
  - Placeholder: "Leave empty for unlimited"
  - Helper: "Limit daily orders to manage stock. Leave empty for no limit."
- **Available Days** (day-of-week toggle buttons):
  - Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - Helper: "Select which days this dish is available. Leave all unchecked for every day."

### Step 5: Customizations
- "Add modifier groups to allow customers to customize their dish."
- "Add Group" button
- Empty state: "No customization groups yet" + "Add your first customization group"

### Form Behavior
- All 5 sections render as a single long scrollable form
- Left sidebar steps act as scroll anchors (clicking scrolls to section)
- Top step pills also act as navigation
- Hidden field contains dish UUID
- Asterisk (*) marks required fields

---

## 6. BUNDLES (`/dashboard/bundles`)

### Breadcrumb
Dashboard > Bundles

### Header
- Title: "Bundles"
- Subtitle: "Manage your bundle packages"
- **"+ Create Bundle"** button (top right, dark)

### Filters
**Status filter pills:**
- All (active)
- Published
- Draft
- Archived

### Search
- Placeholder: "Search bundles..."

### Bundle Card Grid (responsive, 4 columns on desktop)
Each card shows:
- **Image area** (top, square):
  - Status badge overlay (top-left): "Published"/"Draft" with colored dot
  - Item count badge (bottom-left): e.g., "4 items" / "2 items" (green pill)
  - 3-dot menu (top-right)
- **Below image:**
  - Bundle name (bold heading)
  - "From" label + price (e.g., "From $20.00")

### Pagination
- "Rows per page" dropdown
- "Showing 1-10 of 10"
- Page buttons

---

## 7. CUSTOM MENU SECTIONS (`/dashboard/custom-menu-sections`)

### Breadcrumb
Dashboard > Custom Menu Sections

### Header
- Title: "Custom Menu Sections" + info icon (tooltip)
- Subtitle: "Drag to reorder how sections appear on your store-front"
- **"+ Create Section"** button (top right, dark)

### Section List (drag-to-reorder)
Each section is a card/row:
- **Drag handle** (6-dot grid icon, left side)
- **Section name** (bold heading)
- **Dish count** (e.g., "2 dishes")
- **Status badge** (right side): "Active" (green) or "Inactive" (yellow/amber)
- **3-dot menu** (far right)

### Drag & Drop
- Sections are reorderable via drag-and-drop
- Accessibility: "To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the..."
- Screen reader status announcements

### Sample Data
- Ramadan Specials (2 dishes, Active)
- Limited Time (1 dish, Active)
- test (1 dish, Inactive)
- Ramadan Specials (3 dishes, Active)

---

## 8. MODIFIER GROUPS (`/dashboard/modifier-groups`)

### Breadcrumb
Dashboard > Modifier Groups

### Header
- Title: "Modifier Groups"
- Subtitle: "Organize modifiers into groups for your dishes"
- **"+ Create Group"** button (top right, dark)

### Group List (simple table/rows)
Each group is a row:
- **Group name** (bold heading, left)
- **Edit button** (pencil icon + "Edit" text)
- **Delete button** (trash icon + "Delete" text, red-ish)

### Sample Data
- Meat Amount (Edit | Delete)
- Meat Type (Edit | Delete)
- Sides (Edit | Delete)

### Notes
- This is being removed from the demo but noted for reference
- Used for dish customization options (add-ons, choices)

---

## 9. REVIEWS (`/dashboard/reviews`)

### Breadcrumb
Dashboard > Reviews

### Header
- Title: "Reviews"
- Subtitle: "See what customers are saying about your profile, dishes, and bundles"

### Review Type Tabs (horizontal pills)
- **Chef Profile** (active by default)
- Dishes
- Bundles

### Rating Summary (left column)
- Large rating number: "4.0"
- Star display (4 filled, 1 empty)
- "4 ratings" count
- Rating distribution bars:
  - 5.0: bar + "3 reviews"
  - 4.0: bar + "0 reviews"
  - 3.0: bar + "0 reviews"
  - 2.0: bar + "0 reviews"
  - 1.0: bar + "1 review"

### Sort Dropdown (right side)
- "Newest" (default, dropdown)

### Review Cards (list)
Each review shows:
- **Avatar** (circle with initials, colored background)
- **Reviewer name** (bold)
- **Time ago** (e.g., "21 days ago")
- **Star rating** (number + star icon, right side)
- **Review text** (below name)

### Review Data
- No reply functionality visible for chefs
- Read-only view of customer reviews

---

## 10. PROFILE (`/dashboard/profile`)

### Breadcrumb
Dashboard > Profile

### Profile Wizard (5-step, same layout pattern as dish creation)

**Top bar:**
- Title: shows business name (e.g., "Yalla Kitchens Testing")
- Step indicator: "Step 1 of 5"
- Status badge: "Available" (green)
- "Discard" button
- "Save" button

**Left sidebar steps:**
1. **Basic Info** - "Business name & experience"
2. **About You** - "Bio, story & inspiration"
3. **Cuisines** - "Specialties & cuisine types"
4. **Branding** - "Banner image for store-front"
5. **Operations** - "Availability & order settings"

**Progress bar:** 100% (fully complete)

**Tip box:** "Use a clear, memorable business name that customers will recognize."

**Bottom navigation:** Back | step dots | Continue

### Step 1: Basic Info
- **Business Name*** (text input) - with info tooltip icon
- **Years of Experience** (number input) - with info tooltip icon

### Step 2: About You
- **Bio** (textarea) - "A short professional summary" - with info tooltip
- **Your Story** (textarea) - "Share your culinary journey, background, and cooking philosophy" - with info tooltip
- **What Inspires You** (textarea) - "What inspires your passion for cooking" - with info tooltip

### Step 3: Cuisines
- **Cuisines** (multi-select combobox with tags) - with info tooltip
  - "Select cuisine to add"
  - Shows selected cuisines as removable tags with emoji flags:
    - Lebanese, Jordanian, Iraqi, Palestinian, Latin American, Indian
  - Each tag has an X button to remove

### Step 4: Branding
- **Banner Image** (image upload with preview) - with info tooltip
  - Shows current image preview
  - Remove button (X on image)

### Step 5: Operations
- **Timezone** (dropdown) - with info tooltip
  - Options: Eastern Time (ET), Central Time (CT), Mountain Time (MT), Pacific Time (PT), Alaska Time (AKT), Hawaii Time (HST)
- **Available** (toggle switch) - "Is the chef currently accepting orders?" - with info tooltip
- **Auto Accept Orders** (toggle switch) - "Automatically accept orders without manual approval" - with info tooltip
- **Pickup Orders** (toggle switch) - "Allow customers to pick up orders from your location" - with info tooltip
- **Delivery/Pickup Times** (collapsible section) - with info tooltip
  - "Weekly delivery/pickup times"
  - "Collapse All" button
  - "Add Availability" button

### Additional Sections (below steps, in same long form)
- **License Number** (text input) - "Business license number"
- **Tax Id** (text input) - "Tax identification number"
- **Achievements** (collapsible section)
  - "Chef achievements, awards, and certifications"
  - "Collapse All" button
  - "Add Achievement" button

---

## 11. PAYMENT METHODS (`/dashboard/payment-methods`)

### Breadcrumb
Dashboard > Payment Methods

### Header
- Title: "Payment Methods"
- Subtitle: "Connect your Stripe account to receive payments from orders"

### Stripe Connect Card
- Heading: "Stripe Connect"
- Subtitle: "Manage your payment processing account"
- Status badge (top right): "Enabled" (green dot)
- **Success alert** (green background):
  - "Your Stripe account is active. You can process payments and receive payouts."
  - "Account ID: acct_1Sg3o00ZW8eHHfSA"
- **"View Dashboard"** button (external link icon)

### About Stripe Connect (info section)
Three info blocks:
1. **Secure Payments** - "All transactions are encrypted and PCI compliant."
2. **Fast Payouts** - "Receive payments directly to your bank account, typically within 2-3 business days."
3. **Transparent Fees** - "All fees are clearly displayed before completing any transaction."

---

## 12. ACCOUNT SETTINGS (`/dashboard/account-settings`)

### Breadcrumb
Dashboard > Account Settings

### Header
- Title: "Account Settings"
- Subtitle: "Manage your account information and preferences"

### Profile Section
- Heading: "Profile"
- Subtitle: "Your name and profile picture"
- **Save** button (top right, dark)

Fields:
- **Avatar** (image upload)
  - Shows current image preview
  - Remove button (X on image)
  - Helper: "Recommended size: 1500x1500px"
- **Name** (text input) - placeholder: "Your full name"

### Contact Information Section
- Heading: "Contact Information"
- Subtitle: "Your email and phone number"

Fields:
- **Email** (text input, disabled/read-only)
  - Shows current email (e.g., "demo.chef@gmail.com")
  - Helper: "Your email address cannot be changed"
- **Phone** (text input)
  - Shows current phone (e.g., "14692770767")
  - "Change" button
  - Helper: "Phone number is verified via SMS"
- Account created date: "December 19th 2025, 7:31 AM"

### Security Section
- Heading: "Security"
- Subtitle: "Manage your password and account security"
- **"Change Password"** button

---

## 13. TUTORIALS (`/dashboard/tutorials`)

### Breadcrumb
Dashboard > Tutorials

### Header
- Title: "Tutorials"
- Subtitle: "Interactive guides to help you master every part of your Chef Portal."

### Progress Tracker
- "Your progress" label
- "1 of 8 completed"
- Progress bar (partially filled)

### Tutorial Cards (grid, 3 columns)

1. **Managing Orders** - 14 steps
   - "Learn how to view, process, and complete customer orders step by step."
   - "Start tutorial" link
   - Icon: clipboard

2. **Creating Dishes** - 12 steps
   - "Walk through every step of the dish creation wizard -- from details to customizations."
   - "Start tutorial" link
   - Icon: layers/stack

3. **Creating Bundles** - Completed (green checkmark badge)
   - "Learn how to combine dishes into bundles with special pricing for your customers."
   - "Run again" link
   - Icon: package

4. **Modifier Groups** - 6 steps
   - "Understand how to create modifier groups that let customers customize their orders."
   - "Start tutorial" link
   - Icon: tag/label

5. **Custom Menu Sections** - 7 steps
   - "Learn how to organize your dishes into custom sections for a better browsing experience."
   - "Start tutorial" link
   - Icon: list

6. **Chef Profile** - 10 steps
   - "Set up your chef profile -- business name, bio, cuisines, branding, and operations."
   - "Start tutorial" link
   - Icon: user

7. **Account Settings** - 7 steps
   - "Manage your avatar, contact information, and security settings."
   - "Start tutorial" link
   - Icon: gear

8. **Address Management** - 6 steps
   - "Set up your pickup address so customers and drivers know where to find you."
   - "Start tutorial" link
   - Icon: map pin

### Card Layout
Each tutorial card shows:
- Icon (top-left, in circle)
- Step count badge (top-right, green pill) OR "Completed" badge
- Tutorial title (bold heading)
- Description text
- Action link: "Start tutorial" or "Run again"

---

## 14. PORTAL GUIDE (`/dashboard/portal-guide`)

### Breadcrumb
Dashboard > Portal Guide

### Header
- Title: "Portal Guide"
- Subtitle: "Everything you need to know about running your kitchen on Yalla Bites"

### Tab Buttons (top right)
- **Video Tutorials** (active state = dark fill)
- **Chef Playbook**

### Video Tutorials Tab
- Heading: "How-To Videos"
- Subtitle: "Watch these instructional videos to master all the features of the Chef Portal."
- Embedded YouTube video: "Yalla Bites - How to Succeed on Yalla Bites - Chef Success Playbook."
  - Channel: YallaBites

### Chef Playbook Tab
- Embedded PDF/slide viewer (Yalla Bites Chef Success Playbook)
  - Page indicator: "1 / 18"
  - Navigation: hamburger menu, swipe/arrows
  - Content: "Chef Success Playbook - The Complete Guide to Growing Your Business on Yalla Bites"
- Below viewer:
  - "CHEF SUCCESS PLAYBOOK" label
  - **"View Full Playbook PDF"** button (red/coral)
  - **"Watch Us Walk You Through It"** link (with YouTube icon)

---

## 15. ADDRESS MANAGEMENT (`/dashboard/addresses`)

### Breadcrumb
Dashboard > Pickup Address

### Header
- Title: "Pickup Address"
- Subtitle: "Your pickup address where delivery companies can collect prepared orders"
- **"Edit Address"** button (top right, dark, pencil icon)

### Address Card
- Map pin icon (left)
- **Address name:** "My Address"
- **"Primary" badge** (blue/teal pill)
- Street: "1006 Alameda Court"
- City/State/Zip: "Allen, TX 75013"
- Country: "US"

### Pickup Instructions Section
- Label: "PICKUP INSTRUCTIONS" (uppercase, small)
- Text: "Pick up the front"

### Notes
- Single address view (not a list of multiple addresses)
- Edit button presumably opens an edit form

---

## 16. BUY PACKAGING (`/dashboard/buy-packaging`)

### Breadcrumb
Dashboard > Buy Packaging

### Header
- Title: "Buy Packaging"
- Subtitle: "Stock up on packaging supplies for your orders"

### Product Cards (grid, 4 columns)

1. **Large Catering Bags**
   - Image (product photo area, currently not loading)
   - Description: "Plastic take-out bag 22\" x 14\" x 15 1/4\" -- perfect for large catering orders."
   - **"Buy Now"** button (dark, full width, external link icon)
   - Links to: webstaurantstore.com

2. **Half Tray Boxes**
   - Description: "Choice 13\" x 10 1/2\" x 3 1/4\" half pan corrugated catering box."
   - **"Buy Now"** button
   - Links to: webstaurantstore.com

3. **Full Tray Boxes**
   - Description: "Choice 21\" x 13\" x 4\" deep full pan corrugated catering box."
   - **"Buy Now"** button
   - Links to: webstaurantstore.com

4. **All Take-Out / To-Go Supplies**
   - Description: "Browse the full range of take-out containers, bags, and to-go supplies."
   - **"Buy Now"** button
   - Links to: webstaurantstore.com/search/to-go.html

### Notes
- All "Buy Now" links are external to webstaurantstore.com
- Product images may not be loading in staging
- Cards are simple: image + title + description + CTA

---

## GLOBAL UI PATTERNS

### Breadcrumbs
- Present on ALL pages except Dashboard
- Format: Dashboard > [Section]
- Dashboard breadcrumb item is a clickable button

### Top Bar
- Left: Hamburger menu (toggle sidebar)
- Right: User avatar (circle) + "Demo Chef" name (dropdown button)

### Page Title Pattern
- All pages follow: H1 Title + subtitle description

### Card Grids
- Dishes: 5 columns
- Bundles: 4 columns
- Tutorials: 3 columns
- Orders: single column list

### Status Colors
- Published: Green dot
- Draft: Yellow/amber dot
- Archived: Red dot
- Active: Green dot
- Inactive: Yellow/amber dot

### Pagination Pattern (shared across Orders, Dishes, Bundles)
- "Rows per page" dropdown
- "Showing X-Y of Z" text
- Page number buttons with Previous/Next

### Button Patterns
- Primary (dark/black): "Create Dish", "Save", "Continue"
- Secondary (outline): "Discard", "Back"
- Danger (red icon): "Delete"

### Empty States
- Dish creation sections show "No [X] yet" + "Add your first [X]" button

### Form Layout Pattern
- Wizard forms (Dish, Profile) use:
  - Left sidebar with numbered steps
  - Main content area on right
  - Progress indicator
  - Tip/helper boxes
  - Back/Continue navigation

### Badges
- "New" red pill badges on: Bundles, Buy Packaging, Tutorials (sidebar)
- Status badges: colored dot + text
- Count badges: number in colored pill

---

## CRITICAL FEATURES FOR DEMO REPLICATION

### Must-Have (core functionality)
1. Sidebar navigation with exact grouping and badges
2. Dashboard with 3 KPI cards + recent orders
3. Orders list with status filters, search, and order cards
4. Dishes grid with category tabs, status filters, search, and dish cards
5. Dish creation wizard (5-step form with preview)
6. Bundles grid with status filters and bundle cards
7. Profile wizard (5-step form)
8. Reviews with rating summary and review cards
9. Tutorials index with progress tracking

### Nice-to-Have (secondary pages)
10. Custom Menu Sections with drag-to-reorder
11. Modifier Groups list
12. Account Settings (avatar, contact, security)
13. Payment Methods (Stripe status)
14. Address Management
15. Buy Packaging (external links)
16. Portal Guide (embedded video + PDF)

### Key Interactions to Replicate
- Dish card 3-dot menu: Edit, Publish, Archive, Delete
- Bundle card 3-dot menu (similar to dishes)
- Custom menu section drag-to-reorder
- Dish creation "from scratch" vs "from template" modal
- Status filter pill buttons (shared pattern)
- Category tab scrolling with emoji icons
- Review tab switching (Chef Profile / Dishes / Bundles)
- Profile availability toggles
- Pagination with rows-per-page selector
