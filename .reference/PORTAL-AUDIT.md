# Yalla Bites Chef Portal — Full Feature Audit

Source: `/Users/yusuf/demo-chef-portal/.reference/chef-portal-main/`

---

## 1. SITEMAP — All Routes

### Auth (Public)
| Route | Page |
|-------|------|
| `/auth/login` | Login page |
| `/auth/forgot-password` | Forgot password / reset link |
| `/auth/reset-password` | Reset password (token-based) |

### Dashboard (Protected — requires auth)
| Route | Page |
|-------|------|
| `/dashboard` | Home dashboard |
| `/dashboard/orders` | Orders list |
| `/dashboard/orders/[id]` | Order detail |
| `/dashboard/reviews` | Reviews |
| `/dashboard/dishes` | Dishes list |
| `/dashboard/dishes/new` | Create dish (wizard) |
| `/dashboard/dishes/[id]/edit` | Edit dish (wizard) |
| `/dashboard/bundles` | Bundles list |
| `/dashboard/bundles/new` | Create bundle (wizard) |
| `/dashboard/bundles/[id]/edit` | Edit bundle (wizard) |
| `/dashboard/custom-menu-sections` | Custom menu sections list |
| `/dashboard/custom-menu-sections/new` | Create custom menu section |
| `/dashboard/custom-menu-sections/[id]/edit` | Edit custom menu section |
| `/dashboard/modifier-groups` | Modifier groups list |
| `/dashboard/modifier-groups/new` | Create modifier group |
| `/dashboard/modifier-groups/[id]/edit` | Edit modifier group |
| `/dashboard/addresses` | Pickup address (single) |
| `/dashboard/addresses/edit` | Edit pickup address |
| `/dashboard/buy-packaging` | Buy packaging (external links) |
| `/dashboard/tutorials` | Tutorials hub |
| `/dashboard/order-tutorial` | Order management tutorial (driver.js) |
| `/dashboard/tutorials/dishes` | Dish creation tutorial |
| `/dashboard/tutorials/bundles` | Bundle creation tutorial |
| `/dashboard/tutorials/modifiers` | Modifier groups tutorial |
| `/dashboard/tutorials/menus` | Custom menu sections tutorial |
| `/dashboard/tutorials/profile` | Chef profile tutorial |
| `/dashboard/tutorials/account` | Account settings tutorial |
| `/dashboard/tutorials/addresses` | Address management tutorial |
| `/dashboard/portal-guide` | Portal guide (videos + playbook iframe) |
| `/dashboard/account-settings` | Account settings |
| `/dashboard/profile` | Chef profile (wizard) |
| `/dashboard/payment-methods` | Stripe Connect payment setup |
| `/dashboard/customers` | Customers (placeholder — "coming soon") |
| `/dashboard/settings` | Settings (placeholder — "coming soon") |
| `/dashboard/design-system` | Internal design system reference |
| `/dashboard/test-form` | Internal test form |
| `/dashboard/account` | Legacy account page |

---

## 2. NAVIGATION / SIDEBAR

### Sidebar Structure (5 groups)

**Header:** Yalla Bites logo + "Chef Portal" red badge. Collapsible sidebar (icon mode).

**Overview**
- Dashboard (HomeFilledIcon) -> `/dashboard`
- Orders (OrderFilledIcon) -> `/dashboard/orders`
- Reviews (StarFilledIcon) -> `/dashboard/reviews`

**Menu Management**
- Dishes (DishIcon) -> `/dashboard/dishes`
- Bundles (PackageFilledIcon) -> `/dashboard/bundles` [Badge: "New"]
- Custom Menu Sections (ListBulletedIcon) -> `/dashboard/custom-menu-sections`
- Modifier Groups (CollectionFilledIcon) -> `/dashboard/modifier-groups`

**Operations**
- Address Management (LocationFilledIcon) -> `/dashboard/addresses`
- Buy Packaging (CartFilledIcon) -> `/dashboard/buy-packaging` [Badge: "New"]

**Help & Guides**
- Tutorials (NoteIcon) -> `/dashboard/tutorials` [Badge: "New"]
- Portal Guide (BookOpenIcon) -> `/dashboard/portal-guide`

**Account**
- Account Settings (SettingsIcon) -> `/dashboard/account-settings`
- Profile (PersonIcon) -> `/dashboard/profile`
- Payment Methods (CreditCardIcon) -> `/dashboard/payment-methods`

### Top Bar
- Left: Sidebar toggle (hamburger)
- Right: User avatar + name dropdown
  - Dropdown sections: Profile, Account Settings, Payment Methods | Log out (destructive)

### Active State Logic
- Exact match for `/dashboard`
- Prefix match for all others (e.g., `/dashboard/orders/123` highlights "Orders")
- Mobile: sidebar auto-closes on navigation

---

## 3. AUTH PAGES

### Login (`/auth/login`)
- **Layout:** Split-screen — branded left panel (dark plum #331f2e), form right
- **Left panel:** Yalla Bites logo, tagline, rotating carousel messages (3 messages, 3s interval) with animated dot indicators
- **Form fields:** Email, Password (with show/hide toggle), "Keep me logged in" checkbox
- **Actions:** "Sign In to Portal" button (red #e54141), "Forgot?" link next to password label
- **Validation:** Zod — email required + valid, password min 6 chars
- **Error states:** Inline field errors, general error alert banner, specific messages for 401, network errors, Supabase errors
- **Loading state:** Button shows spinner + "Logging in..."

### Forgot Password (`/auth/forgot-password`)
- **Same split-screen layout as login**
- **Step 1 (Enter email):** Email field, "Send Reset Link" button, "Back to login" link
- **Step 2 (Link sent):** Email icon, "Check your email" message, info box (link expires in 60 min), "Resend link" button with 60s cooldown timer, "Use different email" / "Back to login" links
- **Validation:** Email required + valid format

### Reset Password (`/auth/reset-password`)
- Token-based password reset page

---

## 4. DASHBOARD HOME (`/dashboard`)

### Data Shown
- Welcome message: "Welcome back, {name}" with wave emoji
- Subtitle: "Ready to manage your orders and delight your customers today?"

### Stats Cards (3 across on desktop, stacked on mobile)
- **Total Orders** — count of all orders, OrderFilledIcon
- **Active Dishes** — count of published dishes, ProductFilledIcon
- **Your Total Payouts** — sum of chefPayout from delivered orders (formatted as $X.XX), CashDollarFilledIcon

### Recent Orders Section
- Card with "Recent Orders" heading + "View All" button linking to orders page
- Shows up to 5 most recent orders as OrderCard components
- **Empty state:** "No orders yet" with "When customers place orders, they'll appear here."
- **Error state:** Critical banner "Error loading orders"
- **Loading state:** 3 OrderCardSkeleton components
- If more than 5 total orders, shows "View all X orders" link at bottom

---

## 5. ORDERS

### Orders List (`/dashboard/orders`)
- **Breadcrumb:** Dashboard > Orders
- **Page header:** "Orders" + "Manage and track your orders"
- **Status filter tabs (FilterPills):** All, Confirmed, Paid, Preparing, Ready, Pickup Ready, Out for Delivery, Delivered, Picked Up, Rescheduling, Cancelled, Rejected
- **Search bar:** "Search by order ID, customer, or dish..." with 500ms debounce
- **Order cards:** List of OrderCard components (not a grid — vertical stack)
- **Pagination:** Rows per page selector (12/24/48/96), "Showing X-Y of Z" text, prev/next page buttons
- **Empty state:** "No orders found" with contextual message based on filters
- **Error state:** Critical banner with error message
- **Loading state:** Skeleton cards matching page size

### Order Detail (`/dashboard/orders/[id]`)
- **Breadcrumb:** Dashboard > Orders > #ORDER_NUMBER
- **Header row:** Order number (monospace), Fulfillment badge (delivery/shipping/chefPickup/yallaSpot), Status badge
- **Header actions:** Shipping Label button (when applicable), Print Label button, Cancel button (for confirmed/preparing/ready)

#### ETA Banner (yellow, only for ready/readyForPickup with advertisedPickupEta)
- Shows pickup ETA or "Have it ready by" time
- Live countdown timer (MM:SS format)

#### Terminal Status Banners
- Delivered/Picked Up: success banner "This order has been successfully completed."
- Cancelled/Rejected: critical banner

#### Two-Column Layout
**Left column (7/12):**
- **Order Dates:** Grid showing "Have It Ready By" / "Ship By" / "Pickup Time" (yellow highlighted), "Order Placed" date, Tracking number (shipping only)
- **Ordered Items:** List with item image, color swatch, name, portion size, spice level, quantity, price, special instructions, customizations. Bundles show nested bundle items
- **Order Note:** Customer special instructions (if any)
- **Customer Details:** Avatar, name, email, phone, delivery address with instructions

**Right column (5/12):**
- **Order Activity Timeline:** Chronological status history with timestamps, who changed it
- **Order Summary:** Chef payout (large, with hand-drawn circle SVG decoration), Order subtotal, Refund status (fully/partially refunded badge + date)
- **Chef Order Actions:** Context-sensitive action buttons (see below)

#### Order Status Flow & Actions
| Current Status | Primary Action | Secondary Actions |
|---------------|---------------|-------------------|
| paid | Confirm Order (with pickup instructions for pickup orders) | Reschedule, Reject (requires reason) |
| confirmed | Start Preparing | Reschedule, Cancel (requires reason) |
| preparing | Mark Ready / Ready for Pickup | Cancel (requires reason) |
| readyForPickup (chefPickup) | Mark Picked Up | — |
| ready | — (waiting for delivery) | — |
| rescheduling | — (waiting for customer response) | — |
| delivered / pickedUp / cancelled / rejected | — (terminal states) | — |

#### Modals
- **Cancel Order Modal:** Reason textarea (required), "Go Back" / "Cancel Order" buttons
- **Reschedule Modal:** DateTimePicker (must be > 1 hour from now), Reason textarea (optional), validation errors inline
- **Reason Modal:** For reject/cancel — reason textarea (required)
- **Confirmation Dialog:** For confirm/start_preparing/mark_ready/mark_picked_up — description text + confirm/cancel. For pickup orders confirming: includes optional pickup instructions textarea (280 char limit, auto-filled from saved address)

#### Order Statuses (all possible values)
`confirmed`, `paid`, `rescheduling`, `preparing`, `ready`, `readyForPickup`, `outForDelivery`, `delivered`, `pickedUp`, `cancelled`, `rejected`

#### Fulfillment Methods
`delivery`, `shipping`, `chefPickup`, `yallaSpot`

#### Print Label Button
- Generates a printable label with order details, ingredients, allergens
- Available for all orders

#### Shipping Label Button
- Only shown for shipping orders with a shipping label
- Opens label URL in new tab

---

## 6. DISHES

### Dishes List (`/dashboard/dishes`)
- **Breadcrumb:** Dashboard > Dishes
- **Header:** "Dishes" + "Manage your menu dishes" + "Create Dish" button (opens CreateDishModal)
- **Search + status pills:** Search bar ("Search dishes...") + FilterPills (All/Published/Draft/Archived)
- **Category tabs (IconTabs):** "All" + dynamic categories from API, segmented control style, with category images as icons
- **Dish grid:** Responsive grid (2 cols -> 3 -> 4 -> 5 based on container width using @container queries)
- **DishCard:** Image, category name, dish name, price (from lowest portion size), status badge, star rating + review count. Three-dot menu with actions.
- **Card actions per dish:**
  - Edit -> navigate to edit page
  - Publish / Unpublish / Restore (toggle status, requires image to publish)
  - Archive (if not already archived)
  - Delete (destructive, with confirmation)
- **Pagination:** Same as orders — rows per page (12/24/48/96), showing X-Y of Z, prev/next
- **Empty states (6 variants):** no-dishes (create CTA), no-results, no-draft, no-published, no-archived, no-search-results
- **URL state sync:** Search query (`q`), status filter (`status`), category (`category` slug), page number (`page`) all synced to URL params
- **Flash Sale Modal:** Exists in code — date range picker + dish selector

### Create Dish Modal
- **Step 1:** Two cards — "Create from Scratch" (blank canvas icon) or "Create from Template" (duplicate icon)
- **Step 2 (template selection):** Back button, search bar, scrollable list of templates with thumbnail image, name, description, cuisine badge. Select a template -> "Use Template" button. Empty state if no templates.

### Create/Edit Dish (`/dashboard/dishes/new`, `/dashboard/dishes/[id]/edit`)
- **FormWizard layout** with sidebar steps + main content area
- **Breadcrumb:** Dashboard > Dishes > Create (or dish name for edit)
- **Header actions:** Discard button + Save Dish button (disabled when saving/uploading/unchanged from template)
- **Status badge:** Published (green) or Draft (yellow)
- **Progress bar:** Percentage of required fields filled
- **Live preview card:** Shows dish name, category, price, image, status, lead time in real-time
- **Tips per step:** Contextual tips ("Dishes with clear names get 40% more orders")
- **Navigation protection:** Unsaved changes prompt on browser back/forward, link clicks, page refresh

#### Wizard Steps

**1. Dish Details**
- Name (text input, required)
- Description (textarea, required for backend)
- Cuisine (searchable select from API, required)
- Category (select from API, required)
- Status (draft/published — hidden toggle, defaults draft)
- Lead Time (number input, hours)

**2. Media**
- Image upload dropzone (up to 4 images, max 25MB each)
- Drag-to-reorder, set primary image
- Upload progress indicator
- Tips: use high-quality images, first image becomes featured
- Required for published status (at least 1 image)

**3. Specs & Portions**
- **Spice Levels:** Multi-select toggles (none, mild, medium, hot, extra-hot). If any selected, must select at least 3.
- **Portion Sizes (required, min 1):** Each has: portion label (from API), size (text/number), price (number >= 0)
- **Ingredients:** Multi-select from API (ingredient IDs)
- **Allergens:** Multi-select from API (allergen IDs)
- **Dietary Labels:** Multi-select from API (dietary label IDs)

**4. Availability**
- Max Quantity Per Day (number, min 1, or null for unlimited)
- Available Days (weekday multi-select: monday-sunday)

**5. Customizations**
- Customization groups array. Each group:
  - Modifier Group (from API, required)
  - Required toggle
  - Selection Type: single or multiple
  - Modifiers array (min 1): name (required), price adjustment (number), description (optional)

**Shipping Section:** Exists in code but currently disabled/commented out. Would include: shippable toggle, weight, dimensions (L/W/H), dry ice (required toggle + weight).

#### Validation (Zod schema)
- name: required
- description: required (non-empty)
- cuisineId: required
- categoryId: required
- portionSizes: min 1 entry, each needs portionLabelId, size, price >= 0
- spiceLevels: if any selected, min 3
- imageIds: if status=published, at least 1 image required
- All validation errors mapped to specific sections and fields with red borders + inline messages

#### Template Prefilling
- When `?templateId=X` is in URL, fetches template and prefills all fields
- Shows toast on successful load
- Detects if form is unchanged from template and disables save
- Transforms Lexical editor format descriptions to plain text

---

## 7. BUNDLES

### Bundles List (`/dashboard/bundles`)
- **Identical pattern to Dishes list** — breadcrumb, header + "Create Bundle" button, search + status pills (All/Published/Draft/Archived)
- **Bundle grid:** 2 -> 3 -> 4 columns (responsive), BundleCard showing image, name, item count, price, status badge
- **Card actions:** Edit, Publish/Unpublish/Restore, Archive, Delete — same patterns as dishes
- **Pagination, empty states, URL state sync** — all same as dishes
- **Client-side search** (bundles search is client-side, not server-side)

### Create/Edit Bundle (`/dashboard/bundles/new`, `/dashboard/bundles/[id]/edit`)
- **FormWizard layout** — same as dishes

#### Bundle Wizard Steps
**1. Bundle Details:** Name, Description, Status

**2. Bundle Dishes:** Select dishes to include in the bundle, set quantity per dish

**3. Bundle Specs:**
- Spice Levels (same as dishes)
- Portion Sizes — has regularPrice AND salePrice (+ computed savings/savingsPercentage)

**4. Bundle Availability:** Same as dishes — max quantity, available days

**5. Bundle Customizations:** Same pattern as dishes

**6. Bundle Media:** Same as dishes — up to 4 images

---

## 8. CUSTOM MENU SECTIONS

### List (`/dashboard/custom-menu-sections`)
- **Breadcrumb:** Dashboard > Custom Menu Sections
- **Header:** Title with StoreFrontIndicator tooltip (shows where sections appear on customer-facing storefront + screenshot), "Create Section" button
- **Subtitle:** "Drag to reorder how sections appear on your store-front"
- **Content:** Sortable drag-and-drop list (SortableList component)
- Each row shows: drag handle, section name, dish count ("X dishes"), Active/Inactive status dot, three-dot menu (Popover with ActionList)
- **Row actions:** Publish/Unpublish toggle, Edit, Delete (destructive)
- **Reordering:** Drag to reorder, saves sort order via API (with loading spinner "Saving new order...")
- **Empty state:** "No custom menu sections" + "Create your first custom menu section to organize your dishes into curated groups." + "Create Section" CTA
- **Delete confirmation dialog**

### Create/Edit (`/dashboard/custom-menu-sections/new`, `/dashboard/custom-menu-sections/[id]/edit`)
- Section name, dish picker, active/inactive toggle, sort order

---

## 9. MODIFIER GROUPS

### List (`/dashboard/modifier-groups`)
- **Breadcrumb:** Dashboard > Modifier Groups
- **Header:** "Modifier Groups" + "Organize modifiers into groups for your dishes" + "Create Group" button
- **Content:** Simple list (not sortable) of modifier group rows
- Each row: Group name, description (truncated), Edit button, Delete button
- Entire row is clickable -> navigate to edit page
- **Empty state:** "No modifier groups" + "Create your first modifier group to organize modifiers for your dishes." + "Create Group" CTA
- **Delete confirmation dialog**

### Create/Edit (`/dashboard/modifier-groups/new`, `/dashboard/modifier-groups/[id]/edit`)
- Group name, description, modifiers list (name + price adjustment + description each)

---

## 10. REVIEWS

### Reviews Page (`/dashboard/reviews`)
- **Breadcrumb:** Dashboard > Reviews
- **Header:** "Reviews" + "See what customers are saying about your profile, dishes, and bundles"
- **Tab filter (FilterPills):** Chef Profile, Dishes, Bundles

#### Chef Profile Tab
- **Rating Summary:** Large average rating number (e.g., "4.5"), star visualization, total ratings count
- **Rating Distribution:** Horizontal bar chart showing count per star level (5.0, 4.0, 3.0, 2.0, 1.0)
- **Sort dropdown:** Newest, Oldest, Highest, Lowest
- **Review cards:** Avatar, customer name, time ago, rating (number + star), comment text, review images (thumbnail grid)
- **Pagination:** Page X of Y + prev/next
- **Empty state:** Star icon + "No reviews yet" + "Reviews will appear here once customers leave feedback"

#### Dishes Tab
- Lists all chef's dishes as expandable accordion items
- Each item: dish thumbnail, dish name, star rating + review count (or "No reviews yet")
- Click to expand -> shows ReviewsList for that dish (with sort + pagination)
- **Empty state:** "No dishes" + "Create dishes to see their reviews."

#### Bundles Tab
- Same pattern as Dishes tab but for bundles
- **Empty state:** "No bundles" + "Create bundles to see their reviews."

#### Review Data Model
- Rating (1-5), comment (nullable), images array (id + url), customer info (id, name, avatar), createdAt
- **Chefs cannot reply to reviews** — reviews are read-only in the portal

---

## 11. PROFILE (`/dashboard/profile`)

### FormWizard Layout — 5 Steps

**1. Basic Info**
- Business Name (required)
- Years of Experience (number)
- StoreFrontIndicator showing where these appear

**2. About You**
- Bio (textarea)
- Story (textarea)
- What Inspires Me (textarea)

**3. Cuisines**
- Multi-select cuisine picker (SearchableSelect from API)
- Cuisine emoji next to each selection
- Tags showing selected cuisines

**4. Branding**
- Banner image upload (1920x600px recommended)
- Upload progress with percentage
- Remove/replace image
- StoreFrontIndicator showing banner placement

**5. Operations**
- **Timezone:** Dropdown (Eastern/Central/Mountain/Pacific/Alaska/Hawaii)
- **Available toggle:** Switch to mark chef as available/unavailable. Confirmation dialog when toggling off.
- **Auto Accept Orders:** Switch to automatically accept incoming orders
- **Pickup Settings:** Enabled toggle (only if admin-allowed), Pickup Instructions textarea
- **Weekly Schedule:** Collapsible section per weekday, each with: start time picker, end time picker. Add/remove schedule slots.
- StoreFrontIndicator showing availability on storefront

### Profile Data Fields (from ChefProfile type)
- businessName, slug (system-managed), bio, story, whatInspiresMe, experience
- cuisines (array of IDs), bannerImage (media ID), bannerImageUrl
- customSections (array of IDs)
- licenseNumber, taxId (business info — hidden in current wizard)
- timezone, available, adminAvailable, autoAcceptOrders
- availabilitySchedule (weekday + startTime + endTime per slot)
- achievements (title, description, startDate, endDate) — hidden in current wizard
- pickup (enabled, adminAllowed), pickupInstructions
- address (street, apartment, city, state, zipCode, country, lat, lng)
- Stripe Connect fields (read-only display)
- tags, isFeatured (admin-only, read-only)

---

## 12. ACCOUNT SETTINGS (`/dashboard/account-settings`)

### Card 1: Profile
- **Avatar upload:** Image dropzone with preview, upload progress overlay (uploading/processing/saving/done percentages), success flash, remove confirmation dialog
- **Name field:** Text input with save button
- Validation: name required

### Card 2: Contact Information
- **Email:** Displayed but disabled ("Your email address cannot be changed")
- **Phone:** Displayed + "Change" button
  - **Change Phone Dialog (2-step):**
    - Step 1: Enter new US phone number, "Send Code" button
    - Step 2: 6-digit OTP input (InputOTP component), "Resend code" with 60s cooldown, "Back" / "Verify" buttons
    - US phone validation (10 or 11 digits), E.164 normalization
- **Account created date** shown at bottom

### Card 3: Security
- **Change Password button** opens dialog
  - **Change Password Dialog:** Current password, New password (with live requirements checklist: 6+ chars, lowercase, uppercase, number), Confirm password
  - Validation: passwords must match, meet requirements

---

## 13. PAYMENT METHODS (`/dashboard/payment-methods`)

### Stripe Connect Integration
- **Status indicator:** Dot + label — Not Connected / Onboarding / Pending / Restricted / Enabled / Failed / Disabled
- **States:**
  - **Not Connected:** Dashed border empty state with credit card icon, "Connect Stripe Account" button
  - **In Progress:** Info banner "Please complete the Stripe Connect onboarding in the tab that was opened."
  - **Pending / Restricted:** Warning banner, "Complete Verification" / "Continue Onboarding" button
  - **Enabled:** Success banner showing account ID, "View Dashboard" button (opens Stripe Express Dashboard)
  - **Failed:** Critical banner, "Retry Onboarding" button
  - **Disabled:** Critical banner, "View Dashboard" button
- **Return from Stripe:** Detects `?return=true` or `?stripe_return=true` params and shows success toast
- **Info Card:** About Stripe Connect — Secure Payments, Fast Payouts (2-3 business days), Transparent Fees

---

## 14. ADDRESSES (`/dashboard/addresses`)

### Pickup Address (single address per chef)
- **Breadcrumb:** Dashboard > Pickup Address
- **Header:** "Pickup Address" + "Your pickup address where delivery companies can collect prepared orders" + "Edit Address" button (only shown when address exists)
- **Address display:** Location icon, label (with "Primary" badge if default), street, apartment, city/state/zip, country, pickup instructions section
- **Empty state:** "No pickup address set" + "Add your pickup address so delivery companies know where to collect orders." + "Add Pickup Address" CTA

### Edit Address (`/dashboard/addresses/edit`)
- Google address autocomplete
- Fields: label, street, apartment, city, state, zip, country, pickup instructions
- Latitude/longitude from geocoding

---

## 15. BUY PACKAGING (`/dashboard/buy-packaging`)

- **Static page** — no dynamic data
- **Grid of 4 packaging items** with images, titles, descriptions, "Buy Now" buttons (external links to webstaurantstore.com)
- Items: Large Catering Bags, Half Tray Boxes, Full Tray Boxes, All Take-Out/To-Go Supplies

---

## 16. TUTORIALS

### Tutorials Hub (`/dashboard/tutorials`)
- **Overall progress card:** Progress bar showing X of Y completed, percentage
- **Tutorial grid:** 3 columns of tutorial cards
- **Each card:** Icon, title, description, badge ("X steps" or "Completed" with checkmark), "Start tutorial" / "Run again" action hint
- **Completion tracking:** localStorage per tutorial

### 8 Tutorials Available
| Tutorial | Steps | Description |
|----------|-------|-------------|
| Managing Orders | 14 | View, process, and complete customer orders |
| Creating Dishes | 12 | Walk through dish creation wizard |
| Creating Bundles | 10 | Combine dishes into bundles with pricing |
| Modifier Groups | 6 | Create modifier groups for customization |
| Custom Menu Sections | 7 | Organize dishes into custom sections |
| Chef Profile | 10 | Set up profile — name, bio, cuisines, branding, operations |
| Account Settings | 7 | Avatar, contact info, security |
| Address Management | 6 | Set up pickup address |

### Tutorial Page Wrapper (shared component)
- **Landing state:** Icon, title, description, language selector (EN/AR/ES), "Start Tutorial" button, completion banner if previously completed
- **Active state:** Exit Tutorial button, Language selector, Restart Tutorial button, tutorial content rendered inside Card
- **Uses driver.js** for step-by-step guided overlay
- **Multi-language support:** English, Arabic (RTL), Spanish
- **Completion:** Marked in localStorage on tutorial finish, progress tracked across sessions

---

## 17. PORTAL GUIDE (`/dashboard/portal-guide`)

- **Two tabs (FilterPills):** Video Tutorials (default), Chef Playbook
- **Video Tutorials tab:** YouTube playlist embed (PL7T8s1rRuKeqM8YMDtUFiAPpOeHQ6lz7F)
- **Chef Playbook tab:** Full-height iframe of `https://apply.yallabites.com/playbook` with loading spinner

---

## 18. SHARED UI COMPONENT LIBRARY

### Polaris-Inspired Components (components/polaris/)
ActionList, AddressAutocomplete, Avatar, Badge, Banner, BottomSheet, Breadcrumb, BundleCard, Button, Card, Checkbox, Collapsible, ColorSwatch, ConfirmDialog, CopyButton, DataTable, DatePicker, Dialog, DishCard, Divider, EmptyState, ExpandableText, FileUpload, FilterPills, FormWizard, IconTabs, Illustrations, Input, Kbd, Navigation, NotificationCenter, NumberInput, OrderCard, PageHeader, Pagination, PasswordInput, Popover, ProgressBar, RadioGroup, ResourceItem, SearchBar, SearchableSelect, Select, Sheet, Skeleton, SortableList, Spinner, StatsCard, StatusDot, Switch, Tabs, Tag, Thumbnail, Timeline, Toast, ToggleGroup, Tooltip, TopBar, VirtualList

### Shared Components (components/shared/)
BackButton, ConfirmationDialog, DataTable (with actions, grid, mobile card, toolbar, filter pills, pagination), ErrorBoundary, ErrorDisplay, FieldError, FloatingActionButton, FormErrorAlert, ImageDropzone, Image (OptimizedImage), LoadingOverlay, LoadingScreen, MediaUploadSection, ProtectedRoute, PublicRoute, SectionInstructions, TranslationPrevention, VirtualGrid, YallaBitesIcon, YallaBitesLogoHorizontal, YallaBitesLogo, YouTubeEmbed

### UI Components (components/ui/ — shadcn/ui based)
Accordion, AlertDialog, Alert, AspectRatio, Avatar, Badge, Breadcrumb, ButtonGroup, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, CustomToast, Dialog, Drawer, DropdownMenu, Empty, Field, Form, HoverCard, InputGroup, InputOTP, Input, Item, Kbd, Label, Menubar, NavigationMenu, Pagination, PasswordInput, Popover, Progress, RadioGroup, Resizable, ScrollArea, SearchableSelect, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, TimePicker, ToastBridge, Toast, ToggleGroup, Toggle, Tooltip

---

## 19. DATA TYPES SUMMARY

### Order
- id, orderNumber, customerName, customerPhone, customerEmail, customerAvatar
- items: array of OrderItem (dishId, dishName, productCode, color, image, quantity, price, subtotal, specialInstructions, portionSize, spiceLevel, customizations, type, bundleItems, ingredients, allergens)
- status: OrderStatus (11 values)
- pricing: { subtotal, chefPayout }
- total, paymentMethod (cash/card/online), paymentStatus (pending/paid/refunded)
- deliveryAddress, deliveryInstructions, specialInstructions
- createdAt, updatedAt, estimatedReadyTime, deliveredAt
- actionHistory, statusHistory (with changedBy details)
- deliveryDate, trackingUrl, fulfillmentMethod (4 values)
- shippingLabel: { labelUrl, trackingNumber, trackingUrl, carrier }
- rescheduling: { proposedDateTime, proposedBy, reason, expiresAt, history }
- refund: { refundAmount, refundDate, refundStatus }
- deliveryDetails (Nash delivery data), pickupData

### Dish
- id, name, description, price (min portion), image, category, categoryId, status (draft/published/archived)
- images (array with isPrimary), portionSizes (portionLabel + size + price), allergens, cuisine
- shipping: { shippable, weight, dimensions, dryIce }
- reviews: { rating, total }

### Bundle
- id, name, description, price (min regularPrice), image, status
- itemCount, items (dish + quantity), portionSizes (with regularPrice, salePrice, savings)
- customizationGroups, images, availability, shipping

### ChefProfile
- id, businessName, slug, bio, story, whatInspiresMe, experience
- cuisines, bannerImage/bannerImageUrl, customSections
- licenseNumber, taxId, timezone, available, adminAvailable, autoAcceptOrders
- availabilitySchedule, achievements, address, pickup, pickupInstructions
- Stripe Connect fields (accountId, onboardingStatus, accountStatus, onboardingUrl)
- tags, isFeatured (admin-only)

### Review
- id, rating (number), comment (nullable), images (id + url), customerUser (id, name, avatar), createdAt
- Query: targetType (dish/bundle/chef), targetId, sort (newest/oldest/highest/lowest)

### Address
- id, label, street, apartment, city, state, zipCode, country, instructions
- isDefault, isActive, latitude, longitude, pickupInstructions

---

## 20. KEY UX PATTERNS

### Consistent Across All Pages
- **Breadcrumb** at top of every page
- **Page title** (h2, 1.875rem bold) + subtitle (0.8125rem secondary)
- **Loading states:** Skeleton components matching exact layout of loaded content
- **Error states:** Critical Banner with error message
- **Empty states:** EmptyState component with icon, heading, description, primary action CTA
- **Toast notifications:** Success/error toasts for all mutations
- **Confirmation dialogs:** For destructive actions (delete, cancel, status changes)
- **Pagination:** Rows per page selector + showing X-Y of Z + prev/next buttons

### Form Patterns
- **FormWizard:** Multi-step wizard with sidebar steps, progress bar, preview panel, tips, header actions
- **Zod validation** with field-level error display (red borders + inline messages)
- **Server error mapping** to specific form fields
- **Navigation protection:** Unsaved changes prompts
- **Loading overlays** during save operations
- **Debounced search** (500ms) with URL state sync

### Card Actions
- Three-dot menu (Popover) or inline action buttons
- Actions: Edit, Publish/Unpublish, Archive/Restore, Delete
- Publish requires at least 1 image
- Delete requires confirmation dialog

### Responsive Design
- Sidebar collapses to icons on small screens, full overlay on mobile
- Grid layouts adapt (5 -> 4 -> 3 -> 2 columns)
- Mobile-specific pagination text
- Stack layouts on mobile (flex-col)

---

## 21. PLACEHOLDER / COMING SOON PAGES
- `/dashboard/customers` — "Customers page coming soon..."
- `/dashboard/settings` — "Settings page coming soon..."
- `/dashboard/account` — Legacy page (redirects or unused)
- `/dashboard/design-system` — Internal dev reference
- `/dashboard/test-form` — Internal testing
