# Demo Chef Portal -- Final State Audit

**Date:** 2026-05-04
**Auditor:** Claude Opus 4.6
**URL:** https://demo-chef-portal.vercel.app
**Method:** Full source code review of all 20 page/component files + live browser screenshots

---

## Global / Layout Components

### globals.css
**Score: 9/10**
**Issues:**
1. Two conflicting mobile media queries at `max-width: 640px` (line 480) and `max-width: 639px` (line 717). The first uses `@apply` shorthand, the second uses `!important` overrides. The 1px gap (640 exactly) falls into the first block only. Consolidate into one breakpoint.
2. `html, body { overflow-x: hidden }` on line 770 is a blunt instrument -- masks horizontal overflow bugs rather than fixing them. Can cause issues with sticky positioning on some browsers.
3. `.btn-red` on line 508 sets `border-radius: 9999px` (pill) which conflicts with the base `.btn` radius of 12px. Means any `btn-red` is always pill-shaped, which may be unintentional for some usages.

**What's good:**
- Comprehensive design system with warm brand palette
- Well-structured shadow system (card, card-2, sticker, CTA)
- Proper reduced-motion media query
- iOS zoom prevention with 16px font-size on inputs
- Solid typography scale with clamp() for responsive headings
- Safe-area-inset support for bottom sheets

### sidebar.tsx
**Score: 8/10**
**Issues:**
1. Collapsed sidebar width of 56px is quite narrow -- nav items are centered but have no labels, only icons. No tooltip on hover (only native `title` attribute, no styled tooltip).
2. Inline styles dominate instead of Tailwind classes -- harder to maintain.
3. Border styling uses both `borderTop: "1px solid..."` in style AND `border: "none"` overriding it on the collapse toggle button (lines 253-259). Confusing conflict.
4. The "View My Store" link goes to `/store-preview` but the sidebar doesn't have store-preview in its nav items, so there's no active state for that page.

**What's good:**
- Clean 3-group nav organization (Main, Business, Account)
- Active state with red left border is visually clear
- Smooth collapse animation with spring easing
- Chef avatar card at bottom with online indicator

### bottom-tab-bar.tsx
**Score: 8/10**
**Issues:**
1. Only 5 tabs shown (Home, Orders, Menu, Earnings, Profile). Reviews, Availability, Settings, and Store Preview are only accessible via sidebar/drawer on mobile. This means key pages like Reviews require the hamburger menu.
2. The active indicator dot at `bottom: 4` sits very close to the safe-area edge and may be clipped on some devices.
3. Badge count for Orders is hardcoded as `2` -- same as sidebar, but not reactive to any state.

**What's good:**
- Clean 56px height with safe-area padding
- Glass blur background looks premium
- Active indicator dot is subtle and effective
- Proper touch target sizing (44px min)

### top-bar.tsx
**Score: 8/10**
**Issues:**
1. The Cmd+K search pill on desktop just shows a toast "Search coming soon" -- dead feature. Should either work or be removed for the demo.
2. Bell icon links to `/orders` -- this is a notification bell but goes to orders page, not a notifications panel.
3. Avatar in top-bar links to `/settings` but there's no indication it's clickable. Profile page would be more intuitive.
4. Height is 52px which is slightly shorter than standard 56px/64px app bars.

**What's good:**
- Breadcrumbs on desktop are well-implemented with proper hierarchy
- Mobile shows centered title with hamburger -- standard pattern
- Glass blur background maintains readability while scrolling

### mobile-drawer.tsx
**Score: 9/10**
**Issues:**
1. No swipe-to-close gesture -- only tap backdrop or X button.
2. The sign-out link at bottom is tiny (fontSize 11) and paired with a 10px icon -- could be missed.

**What's good:**
- Smooth slide-in animation with backdrop blur
- Same nav structure as desktop sidebar -- consistent
- Close button properly positioned
- Chef avatar card with sign-out at bottom

### (portal)/layout.tsx
**Score: 8/10**
**Issues:**
1. Uses inline `<style>` tags for responsive padding instead of Tailwind responsive classes -- `main { padding: 20px !important; }` etc. This is fragile.
2. `pb-24 lg:pb-0` on the children wrapper accounts for bottom tab bar, but the exact 24 units (96px) may not match the actual tab bar height (56px + safe area). Could leave too much or too little space.
3. The `routeMap` doesn't include order detail routes (`orders/[id]`), so the breadcrumb falls back to the `orders` config, losing the specific order context.

**What's good:**
- Clean flex layout with sidebar + main content area
- Route-based breadcrumb system
- Proper drawer state management
- `min-w-0` prevents flex overflow

---

## Page-by-Page Audit

### Dashboard -- /dashboard
**Score: 8/10**
**Issues:**
1. The Setup/Dashboard toggle is confusing UX -- new users might not understand why there are two modes. The default is "Dashboard" (mode B) which shows stats, but the onboarding checklist (mode A) is the more important flow for new chefs.
2. Search bar on Dashboard mode says "Search orders, dishes, reviews..." but only filters the 3 hardcoded recent orders by customer/items/hashId. Misleading scope.
3. Stat cards show `$2,184` revenue but the order total visible is only ~$93.50. The numbers don't add up for a demo -- minor but noticeable to detail-oriented users.
4. The "Need help?" link at bottom of Setup mode goes to `/tutorials` which doesn't exist (404).
5. On mobile (mode B), the `.order-items-col` is hidden via CSS but the `.order-customer-col` takes `flex: 1` -- the row layout shifts significantly between breakpoints.

**What's good:**
- Time-based greeting is a nice personal touch
- Onboarding checklist with phased approach (3 phases, 9 steps) is well-structured
- Inline quick-add dish form in step 5 is clever
- Stat cards use clamp() for responsive font sizing
- Recent orders have proper hover states and link to detail pages

### Orders -- /orders
**Score: 9/10**
**Issues:**
1. The order card action buttons (Confirm, Prep, Ready, Hand Off) call `e.preventDefault()` and `e.stopPropagation()` which stops the link navigation -- good. But after clicking, the order doesn't actually change state (just shows a toast). In a demo, this is fine but the UI stays the same which is slightly jarring.
2. Pagination shows up but with only 12 orders and rowsPerPage of 12, it always shows 1 page. The pagination UI is there but never actually needed.
3. Mobile search bar has `marginTop: -8` which creates a slightly negative overlap with the filter tabs above.

**What's good:**
- Filter tabs with counts are excellent -- All/Paid/Confirmed/Preparing/Ready/Delivered/Cancelled
- Each order card has clear urgency indicators (red/amber left borders, OVERDUE badge)
- Two-row info layout (customer + status + date/method + items + price + action) is very scannable
- Status-colored action buttons (red for Confirm, amber for Prep, sage for Ready, terracotta for Hand Off)
- Empty state with illustration and back-to-dashboard link

### Order Detail -- /orders/[id]
**Score: 8/10**
**Issues:**
1. All order detail pages show the same hardcoded data (order #a8f2c1, Sarah K., paid status) regardless of which order ID is in the URL. This breaks the illusion of the demo.
2. The progress stepper shows status "paid" but the timeline shows "Order confirmed" and "Preparing started" as done -- contradicts the status.
3. The sticky bottom bar on mobile sits at `bottom: 56px` to account for the tab bar, but the `z-index: 45` might overlap with other fixed elements.
4. The stepper connector lines use `marginBottom: 24` to offset for the label below, but this is fragile and doesn't adapt if label text wraps.
5. ETA card says "In 3h 45m" -- hardcoded, will always be wrong.

**What's good:**
- Clean 2-column layout on desktop (items/customer left, summary/timeline right)
- Receipt-style dotted line separators in the summary section are premium
- Customer contact actions (call, email, maps) are practical
- Payout highlight card with green glow draws attention
- Cancel confirmation with inline warning is well-designed
- Customer note with quote icon feels personal

### Menu -- /menu
**Score: 8/10**
**Issues:**
1. Homemade Mansaf shows price of $100.00 which seems wrong for a dish (the order detail shows it as $28.00 each). Data inconsistency.
2. The category filter pills overflow horizontally but the last visible one gets cut off (visible in screenshot -- "Pa..." for Pastries). No scroll indicator.
3. Search bar is separated from the filter row by spacing -- on desktop this creates a full-width search bar below compact filter pills, which wastes vertical space. Could be inline with filters on desktop.
4. The "Create Dish" modal has two options (From Scratch / From Template) but both link to `/menu/new` -- they're identical.
5. The 3-dot context menu on dish cards appears on hover only -- completely inaccessible on touch devices. No tap alternative.
6. Bundles tab: all "Create Bundle" links go to `/menu/new` (the dish creator), not a bundle-specific form.
7. Sections tab: sections are list items but there's no drag-to-reorder despite this being the obvious use case for ordering menu sections.

**What's good:**
- Three-tab organization (Dishes/Bundles/Sections) is logical
- Photo-forward card design with status badges on images looks great
- Status + category dual-filter system is powerful
- Section management with active/inactive states
- Inline context menu (Edit/Archive/Delete) on hover

### Create Dish -- /menu/new
**Score: 7/10**
**Issues:**
1. The wizard has a fixed bottom navigation bar that sits at `bottom: 0` on desktop and `bottom: 56px` on mobile. On desktop, it covers the full viewport width including behind the sidebar -- it should be constrained to the main content area.
2. Step 3 (Specs & Portions): The portion size row is a complex 4-column layout that will be very cramped on mobile. Select + input + price input + delete button all in one row.
3. Step 5 (Customizations): The modifier grid uses `gridTemplateColumns: "20px 1fr 100px 32px"` which doesn't adapt well to mobile. On small screens, the inputs will be squeezed.
4. The sidebar preview card shows "$0.00" as the default price -- this updates from `sizeRows[0].price` but the price field is in step 3, not step 1. Users won't see it update until they get to step 3.
5. Ingredients, Allergens, and Dietary Labels inputs are all `readOnly` with no functionality -- they just say "Select..." but can't be interacted with.
6. No save/draft confirmation -- "Save Dish" and "Discard" both just `router.push("/menu")` with no state persistence.
7. The "Draft" pill in the top bar is hardcoded and doesn't update when the user changes status to "Published" in step 1.

**What's good:**
- 5-step wizard with sidebar navigation on desktop is clean
- Mobile step indicator (pill dots) is compact and clear
- Live preview card in sidebar updates in real-time
- Tip box with lightbulb icon adds helpful context
- Progress bar tracks completion percentage
- Category selection with emoji grid is visually appealing
- Customization groups with Single/Multiple/Quantity selection types is feature-complete

### Operations -- /operations
**Score: 8/10**
**Issues:**
1. The demo state toggle buttons (Pending/Approved-OFF/Live/Rejected) at the top should be hidden or clearly marked as demo-only controls. They look like real UI.
2. Weekly hours: on mobile, the row layout (day name + toggle + time windows + add button) will overflow horizontally. Each row is `display: flex` with `alignItems: flex-start` but no wrapping.
3. Time selects use native `<select>` dropdowns with no styling -- they look different from the rest of the app's design system.
4. The "Copy Monday to all weekdays" button is useful but there's no undo. Destructive action with no confirmation.
5. Time off "Add time off" button and date override "Add override" button do nothing -- they have no onClick handler.

**What's good:**
- Store status section with 4 states (pending/approved-off/live/rejected) is comprehensive
- Live state has green glow and confirmation dialog for turning off
- Rejected state shows specific fix-needed items with links
- Weekly schedule with toggle + time windows per day is well-designed
- Split shift support (multiple windows per day) is practical
- Time off and date override tabs cover real scheduling needs
- Auto-accept toggle and timezone selector are important operational settings

### Reviews -- /reviews
**Score: 8/10**
**Issues:**
1. The sort dropdown uses `list.reverse()` for "Oldest" which mutates-then-returns in a useMemo, potentially causing stale results. Should use `.slice().reverse()` (it does use spread `[...reviews]` so this is actually fine, but the `.sort()` calls also mutate the spread copy).
2. All 4 reviews are 5-star, making the breakdown bars show 100% for 5-star and 0% for everything else. Demo would benefit from varied ratings.
3. The Dishes and Bundles tabs show expandable rows, but on mobile the padding `14px 24px 14px 44px` for sub-reviews creates a deep left indent that wastes horizontal space.
4. No way to edit or delete a posted reply.

**What's good:**
- Three-tab organization (Chef Profile/Dishes/Bundles) provides good review segmentation
- Rating summary with distribution bars is clear
- Reply composer with character count (500 max) and cancel/post buttons
- Posted replies shown with green left border in cream background
- Sort dropdown (Newest/Oldest/Highest/Lowest) with click-outside-to-close
- Dish and Bundle review accordions with expandable sub-reviews

### Profile -- /profile
**Score: 8/10**
**Issues:**
1. The header action buttons (Preview Store + Save) don't have enough contrast from each other. Both are small `btn-sm` size.
2. Collapsible sections start with "Branding" and "Operations" collapsed by default. A new user might not discover these sections.
3. The cuisine search dropdown appears as a `card` overlay but there's no click-outside-to-close behavior. It stays open until the user clears the search text.
4. Bottom "Save Changes" and "Discard" buttons duplicate the top bar's "Save" button. Redundant.
5. Operations section just contains a link to the Operations page -- this section could be removed entirely and replaced with a simple link in the nav.

**What's good:**
- Profile photo with camera overlay badge for changing
- Collapsible section cards keep the long form manageable
- Cuisine tag system with search + remove is intuitive
- Character count on tagline (80 max)
- Live business name display updates from input
- Banner image upload area with recommended dimensions

### Payments -- /payments
**Score: 8/10**
**Issues:**
1. Same problem as Operations -- the state toggle (A/B/C) at top looks like real UI. Should be hidden or marked as demo controls.
2. State A "Connect with Stripe" button just sets state to C (connected) immediately -- no intermediate flow. State B also just goes to C.
3. The 3-step visual (Connect Stripe -> Verify Identity -> Start earning) uses hardcoded circle sizes that don't scale well -- `w-6 h-6 sm:w-7 sm:h-7` is barely visible on mobile.
4. FAQ accordion has no animation for expand/collapse -- it just appears/disappears.
5. Transaction history dates are hardcoded to April/May 2026 which will look stale.

**What's good:**
- Three states (Not connected / Needs info / Connected) cover the full Stripe lifecycle
- Connected state shows total earnings + next payout prominently
- Transaction history with color-coded amount (green for income, neutral for payouts/fees)
- Info blocks (Secure Payments, Fast Payouts, Transparent Fees) build trust
- FAQ accordion for common payment questions
- Stripe Dashboard external link card

### Settings -- /settings
**Score: 7/10**
**Issues:**
1. This is the densest page in the portal. Three tabs (Account/Integrations/Help) with massive amounts of content in each. The Help tab especially is overloaded -- it has tutorials grid + video section + chef playbook.
2. Notification matrix (4 categories x 3 channels) uses tiny toggles at `scale(0.85)` which reduces the already-small 44x24px toggles. Touch targets are below 44px.
3. The tutorials grid has 8 cards but none actually work -- they all show "coming soon" toasts.
4. Password change fields have no validation, no strength indicator, and the "Update Password" button does nothing.
5. The "Delete my account" button is disabled (`cursor: not-allowed`) which is correct for a demo, but the red color and trash icon still create anxiety.
6. Help tab: two sub-sections (Tutorials, Portal Guide) with the Portal Guide having its own sub-tabs (Video Tutorials, Chef Playbook). That's 3 levels of tabs which is deeply nested.

**What's good:**
- Account section is well-organized: avatar, name, email (verified badge), phone (edit inline)
- Notification matrix is comprehensive and visual
- Security section with password change + 2FA placeholder
- Co-pilot invitation feature (placeholder but forward-thinking)
- Danger zone at bottom with confirmation dialog
- Integrations tab: Square POS + notification channels with test functionality
- Tutorial progress tracking with progress bar

### Store Preview -- /store-preview
**Score: 8/10**
**Issues:**
1. The banner image uses a generic Unsplash kitchen photo that doesn't match the "Yalla Kitchen" brand. In a real demo, this should be the chef's actual kitchen.
2. The "Add" buttons on dish cards have `onClick={(e) => e.preventDefault()}` -- they don't even show a toast. Dead buttons.
3. Rating shows 4.0 stars but the reviews page shows 5.0 average. Inconsistency.
4. The "Read more" link on the About section has `onClick={(e) => e.preventDefault()}` -- another dead link.
5. Negative margin `margin: "-16px auto"` to counteract the portal layout padding is fragile.
6. No cart or order summary -- the "Add" buttons suggest shopping but there's no cart.

**What's good:**
- Photo-forward design with gradient overlay on dish cards
- Banner with back button, preview badge, and avatar overlap
- Kitchen info section with status, rating, and quick-info pills
- Clean section organization (About, Popular Dishes, Desserts)
- Branded footer with "Powered by Yalla Bites"

### Pickup Address -- /pickup-address
**Score: 9/10**
**Issues:**
1. The map is a placeholder (grid pattern + pin) -- acceptable for a demo, but the page would benefit from an actual map embed or at least a static map image.
2. The copy-to-clipboard uses `navigator.clipboard.writeText` which may fail in insecure contexts or on some mobile browsers without user gesture.

**What's good:**
- Clean, focused single-purpose page
- Address card with copy + edit functionality
- Pickup instructions with inline editing
- Info callout about pickup hours linking to Operations page
- Primary badge on the address card

### Login -- /login
**Score: 9/10**
**Issues:**
1. The accent-line below the headline has `margin: '12px auto 0'` but there's no gap between it and the email input below -- the line floats awkwardly between headline and form.
2. The collapsible password section duplicates the email field (there's already an email input above). Two email inputs on the same page is confusing.
3. "Send me a login link" button goes to `/welcome` regardless of what's in the email field -- no validation.

**What's good:**
- Beautiful centered layout with subtle blob decorations
- Gradient CTA button is eye-catching
- Magic link as primary auth (modern, low-friction)
- Google sign-in as alternative
- Progressive disclosure for password sign-in
- Support email link at bottom
- Film grain overlay adds editorial feel

### Welcome -- /welcome
**Score: 9/10**
**Issues:**
1. Step cards use `card-gradient-border card-hover` with `min-h-[48px] sm:min-h-[56px]` but `padding: "0 16px"` -- the content inside is vertically centered by flexbox but the card has no top/bottom padding, relying entirely on min-height. This could cut off content on very small screens.
2. All 5 step links go to their respective pages but there's no way to come back to this welcome page from the portal -- it's a one-way flow.

**What's good:**
- Celebration emoji with glow effect sets a positive tone
- Headline with italic "Amira!" is personal and warm
- 5 step cards with icons are clear and actionable
- "Let's go" gradient CTA is prominent
- "Skip for now" link respects user agency
- Stagger animation (line-reveal) creates a pleasing reveal

---

## Site Organization Analysis

### Navigation Structure

**Sidebar (Desktop) / Drawer (Mobile):**
- Main: Dashboard, Orders (2), Menu, Reviews
- Business: Earnings, Availability
- Account: Profile, Settings

**Bottom Tab Bar (Mobile):**
- Home, Orders, Menu, Earnings, Profile

**Missing from bottom tabs:** Reviews, Availability, Settings, Store Preview, Pickup Address

### Assessment

The nav grouping is logical. "Main" covers the daily workflow. "Business" covers money and scheduling. "Account" is personal settings.

However, there are structural concerns:

1. **Store Preview** has no nav entry -- only accessible via sidebar footer "View My Store" link and profile page "Preview Store" button. It should be discoverable.
2. **Pickup Address** has no nav entry anywhere -- it must be accessed via direct URL. Completely orphaned page.
3. **Reviews on mobile** requires the hamburger menu since it's not in the bottom tabs. For a chef, reviews are important daily content and should be more accessible.
4. **Settings vs Profile** overlap -- the Settings > Account tab has avatar, name, email, phone, and notifications. The Profile page has business name, bio, cuisines, branding. The distinction is "personal account" vs "business profile" but users may look in the wrong place.
5. **Operations page title** in the breadcrumbs says "Operations" but the sidebar calls it "Availability." The inconsistent naming is confusing.

---

## Prioritized Fix List

### P0 -- Must Fix (broken, ugly, or confusing)

1. **Pickup Address page is orphaned** -- Add it to the sidebar nav under Business or Account group. Currently unreachable except by direct URL.
2. **Order Detail shows same data for all orders** -- At minimum, map the URL param to different mock data entries so clicking different orders shows different content.
3. **Menu page: Mansaf priced at $100** -- Data inconsistency. Should be $22 or $28 to match order detail data.
4. **Dashboard "Need help?" links to /tutorials (404)** -- Either create the page or change the link to `/settings` (Help tab).
5. **Create Dish wizard bottom nav overlays full viewport width on desktop** -- Should be constrained to the main content area (not overlap sidebar).
6. **3-dot menu on menu cards is hover-only** -- Completely inaccessible on touch/mobile. Add a visible tap target or long-press alternative.
7. **Operations page demo state toggles look like real UI** -- Either remove them for the demo or add a clear "Demo Controls" label/separator.
8. **Payments page demo state toggles same issue** -- Same fix needed.
9. **Breadcrumb says "Operations" but sidebar says "Availability"** -- Pick one name and use it everywhere.

### P1 -- Should Fix (sizing, spacing, alignment)

1. **Login page: accent-line floats between headline and form** -- Add margin-bottom to create separation, or remove it.
2. **Login page: duplicate email input** in password section -- Remove the email field from the collapsed password section.
3. **Menu category pills get cut off** -- Add a scroll indicator or fade-out edge effect to signal more categories exist.
4. **Operations weekly hours: mobile layout overflows** -- Stack the time windows below the day name + toggle on narrow screens.
5. **Create Dish Step 3: portion size rows too cramped on mobile** -- Stack vertically on mobile instead of horizontal row.
6. **Create Dish Step 5: modifier grid columns too rigid** -- Make responsive with stacking on mobile.
7. **Settings notification toggles scaled to 0.85** -- Use full-size toggles or redesign the matrix layout for mobile.
8. **Store Preview rating (4.0) doesn't match Reviews page (5.0)** -- Sync the data.
9. **globals.css: two conflicting mobile breakpoints** (640px and 639px) -- Consolidate into one consistent breakpoint.
10. **Bottom tab bar: Reviews not accessible** -- Consider replacing Earnings with Reviews in bottom tabs (Earnings is less frequently accessed).
11. **Dashboard search misleads about scope** -- Change placeholder to "Search recent orders..." instead of "Search orders, dishes, reviews..."

### P2 -- Nice to Have (polish, micro-interactions)

1. **Create Dish: Ingredients/Allergens/Dietary Labels fields are dead** -- Add basic multi-select or at least a "coming soon" tooltip.
2. **Create Dish: "Draft" pill in top bar should update** when user changes status dropdown to "Published."
3. **Operations: "Add time off" and "Add override" buttons need onClick handlers** -- At minimum show a toast.
4. **Menu Create modal: both options (From Scratch / From Template) go to same page** -- Differentiate or remove one.
5. **Bundles "Create Bundle" goes to dish creator** -- Either make a bundle-specific form or add a "type" selector at the top of the wizard.
6. **Sidebar collapsed state: add styled tooltips** instead of relying on native `title` attribute.
7. **FAQ accordion on Payments page: add expand/collapse animation** instead of instant show/hide.
8. **Mobile drawer: add swipe-to-close gesture** for modern mobile UX.
9. **Settings Help tab: reduce nesting** -- 3 levels of tabs is too deep. Consider making Tutorials and Portal Guide separate sections.
10. **Top bar avatar should link to /profile** not /settings -- more intuitive mapping.
11. **Add loading skeletons** for page transitions to use the skeleton CSS class already defined in globals.css.
12. **Order cards: action buttons should optimistically update the card status** after clicking (even in demo mode).

---

## Site Organization Recommendations

### Navigation Changes

1. **Add Pickup Address to sidebar** under the Business group:
   - Business: Earnings, Availability, Pickup Address

2. **Rename "Availability" to "Operations"** everywhere (or vice versa -- pick one). The current mismatch between sidebar label and breadcrumb/page title is confusing.

3. **Reconsider bottom tab bar for mobile:**
   - Current: Home, Orders, Menu, Earnings, Profile
   - Recommended: Home, Orders, Menu, Reviews, Profile
   - Reasoning: Reviews are checked daily; Earnings is checked weekly at most. Move Earnings to the "more" section or keep it drawer-only.

4. **Add Store Preview to sidebar** as a standalone link with an external-link icon, or keep it in the footer card but also add it to the Account group.

### Page Consolidation

1. **Profile + Settings overlap.** Consider merging the Settings > Account tab into Profile, making Profile the single page for all personal + business info. Settings would then contain only Notifications, Security, Integrations, and Help.

2. **Operations "Operations" section in Profile page** just links to the Operations page. Remove this section entirely -- it adds no value.

### Flow Improvements

1. **Welcome -> Dashboard flow** is one-way. Add a "Getting Started" link on the Dashboard that returns to the onboarding checklist (Mode A), or keep the Setup/Dashboard toggle but default to Setup for users who haven't completed all steps.

2. **Order list -> Order detail -> back** works correctly via the back arrow. Good.

3. **Menu -> Create Dish -> back** uses `router.push("/menu")` for both Save and Discard with no state change. Add a confirmation dialog for Discard if the form has been modified.
