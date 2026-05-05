# DEFINITIVE AUDIT — Yalla Bites Chef Portal

**Auditor:** Design Lead (Airbnb-standard review)
**Date:** May 4, 2026
**Scope:** All 15 page files, 5 layout/component files, 1 global CSS file (21 files total)

---

## Executive Summary

**Overall Score: 8.2 / 10**

This is an exceptionally well-built chef portal demo. The design system is cohesive, the visual language is warm and premium, and the functional breadth is impressive. It goes far beyond what most food-platform portals offer. The codebase demonstrates serious design craft — the CSS system alone (globals.css) is world-class with Stripe-level shadow tiers, spring animations, and a thoughtful color palette.

### Top 5 Strengths
1. **Design system cohesion** — The `globals.css` is a masterclass. Warm cream-aubergine palette, 3-tier shadow system, Stripe-precision transitions, spring-based animations. Every page speaks the same visual language.
2. **Onboarding flow** — Dashboard Setup mode (ModeA) is best-in-class. Phased checklist with inline quick-add dish form, progress bar, color-coded phases. This rivals Stripe's onboarding.
3. **Flash Sales system** — This is the killer feature. Full 3-step creation wizard (Details > Menu > Launch) with timeline visualization, visibility controls, and per-item quantity limits. No competitor has this.
4. **Order management** — Expandable order cards with one-tap status advancement (Confirm > Start Prep > Mark Ready > Hand Off), prep list view aggregated by dish, urgency indicators. Kitchen-ready UX.
5. **Mobile-first responsive** — Bottom tab bar, mobile drawer, safe-area handling, 44px touch targets, iOS zoom prevention (16px font on inputs), glass morphism sticky bars. Every mobile detail is handled.

### Top 5 Issues
1. **Data inconsistency across pages** — Dashboard shows orders #1042/#1041/#1040 but Orders page uses hash IDs (#a8f2c1/#b3d4e7). Prices differ. Customer "Priya R." has different methods/prices between pages. Order detail page has three hardcoded IDs (1042/1041/1040) with a fallback that doesn't match any real order.
2. **Dead interactions and "coming soon" patterns** — Photo upload zones, ingredients/allergens fields (read-only placeholders), GripVertical drag handles (no drag-and-drop), store preview "Add" buttons, cmd+K search, video tutorials, PDF playbook — all are non-functional stubs.
3. **Missing loading/skeleton states** — Only Dashboard and Orders have skeleton loading. Menu, Flash Sales, Reviews, Profile, Payments, Settings, Operations, Pickup Address, and Store Preview all lack skeletons, creating inconsistent page-load experiences.
4. **Dropdown/popover z-index and dismissal issues** — Menu page dish context menus, section context menus, and sort dropdowns on Reviews lack consistent click-outside dismissal. Multiple menus can theoretically be open simultaneously on Menu page.
5. **Store Preview rating mismatch** — Shows "4.8" rating but Reviews page data is all 5-star reviews averaging 5.0. The dashboard stat card also says "4.8 from 4 reviews" — inconsistent with the reviews data.

### What Makes This Special vs. Competitors

This portal treats home chefs like legitimate business operators, not hobbyists. The Flash Sales + Weekly Cutoff lead time model is uniquely suited to the homemade food industry. The phased onboarding, payout transparency, and prep-list aggregation show deep understanding of the user's workflow. The visual warmth (cream-aubergine palette instead of cold SaaS blue) makes it feel like YOUR kitchen, not a corporate tool. No competitor — DoorDash Merchant, Uber Eats Manager, Square for Restaurants — has this level of craft combined with this degree of domain specificity.

---

## Per-Page Audit

---

### 1. Dashboard (`/src/app/(portal)/dashboard/page.tsx`)
**Score: 8.5/10**

**Strengths:**
- Dual-mode (Setup/Dashboard) toggle is elegant
- Skeleton loading state present
- Time-appropriate greeting
- Stat cards with clamp() responsive font sizing
- Flash sale cards with live pulse dot and countdown timers
- Search filters recent orders in real-time

**Issues:**
- **Line 130-155:** Stat data says "47 orders this month" but only 3 recent orders are shown. The delta text uses a raw up-arrow character rather than a proper icon.
- **Line 157-191:** Order IDs (#1042, #1041, #1040) differ from Orders page which uses hash IDs (#a8f2c1, etc.). Prices also mismatch: Dashboard shows $49.00/$26.50/$18.00 while Orders page shows $49.00/$26.50/$18.00 for different customers.
- **Line 190:** Priya R. shows "pickup" method on dashboard but "delivery" on the Orders page.
- **Line 207-209:** The loading delay is a hardcoded 300ms `setTimeout` — no actual data fetching. This is fine for demo but creates a flash if someone has a fast device.
- **Line 638:** `content-wide` class on ModeB but not on ModeA — inconsistent max-width between modes.
- **Line 607-616:** "Need help?" link goes to `/settings` — should go to `/settings` with the Help tab active, or have its own help page.
- **Line 769-773:** Flash sale revenue "$847" doesn't match anything on the Flash Sales page (which shows $847 — this is consistent, good).

**Fixes for 10/10:**
- Unify order IDs and customer data across dashboard/orders/order-detail
- Add a "View all stats" link on stat cards
- Add hover state to stat cards (they have no interactivity indicator)
- Add empty state for search with no results

---

### 2. Orders List (`/src/app/(portal)/orders/page.tsx`)
**Score: 8.5/10**

**Strengths:**
- Comprehensive filter tabs with live counts
- Expandable order detail inline (accordion pattern)
- One-tap status advancement with toast feedback
- Prep List view — aggregated by dish, grouped by customer
- Pagination with rows-per-page selector
- Urgency indicators (overdue/due-soon background tinting)
- Customer notes shown contextually

**Issues:**
- **Line 46-195:** Order hashes (#a8f2c1, #b3d4e7, etc.) are random strings, not sequential IDs. This is fine for mock data but the "View full details" links (line 698-704) pass `linkId(order.hash)` which takes the first 7 chars of the hash minus `#`. These IDs (a8f2c1, b3d4e7) don't match any key in the Order Detail page's `ORDER_DATA` lookup, so every detail link falls through to `DEFAULT_ORDER`.
- **Line 302-308:** Tab counts use `useMemo(() => {...}, [])` with empty dependency array — correct since orders are static, but `statusOverrides` changes don't update counts. After advancing an order status, the count badges remain stale.
- **Line 630:** `dateTime` variable is created but set to `display: "none"` — dead code.
- **Line 631:** Empty `<span style={{ flex: 1 }} />` spacer could be `flex: 1` on parent instead.
- **Line 762-772:** Pagination buttons are 28x28px — below the 44px minimum touch target for mobile.
- **Line 363:** `<style>` tag injected for `.order-filter-tabs` scrollbar hiding — should be in globals.css.

**Fixes for 10/10:**
- Fix order hash-to-detail-page linking (either use consistent IDs or make detail page look up by hash)
- Update tab counts when status overrides change
- Make pagination buttons 44px on mobile
- Add swipe gesture to advance order status on mobile
- Show "Showing X of Y orders" text more prominently

---

### 3. Order Detail (`/src/app/(portal)/orders/[id]/page.tsx`)
**Score: 7.5/10**

**Strengths:**
- Clear progress stepper with pulse ring on active step
- Beautiful ETA card with gradient border
- Receipt-style pricing with dotted-line pattern
- Payout highlight in sage green
- Activity timeline with proper visual hierarchy
- Customer contact actions (call, email, maps)
- Cancel order flow with confirmation
- Sticky bottom action bar on mobile

**Issues:**
- **Line 40-107:** Only 3 orders hardcoded (1042, 1041, 1040). Any other ID falls to DEFAULT_ORDER. Since Orders page uses hash IDs, most "View full details" links show the wrong order.
- **Line 134-139:** The stepper `steps` array is static and ignores the "paid" status. `currentStepIndex("paid")` returns -1, meaning the stepper shows no active step for paid orders. This is the first status a chef sees.
- **Line 258:** Status pill uses `statusPillClass` which returns `pill-orange` for both `paid` and `confirmed` — no visual distinction between these critical states.
- **Line 489-524:** Customer note is hardcoded ("Please make it extra spicy") regardless of which order is viewed.
- **Line 836-866:** Sticky bottom bar has `bottom: 0` but is offset to `bottom: 56px` on mobile via CSS. However, `paddingBottom: 100` on the content (line 233) is a magic number that doesn't precisely account for bar height + safe area.
- **Line 860:** Action button always shows the same button class based on initial status — doesn't update if order was advanced on the list page.
- **Line 363-389:** Ready-by card shows "In 3h 45m" which is static and will look wrong at different times of day.

**Fixes for 10/10:**
- Add a proper order lookup system that works with hash-based IDs from the orders list
- Add "paid" step to the stepper or clarify that step 1 is "Confirm" (awaiting confirmation)
- Make customer note dynamic per order
- Add "Print receipt" / "Share with customer" actions
- Add order modification capability (adjust items, partial refund)
- Calculate ready-by countdown dynamically

---

### 4. Menu (`/src/app/(portal)/menu/page.tsx`)
**Score: 8/10**

**Strengths:**
- Three-tab structure (Dishes/Bundles/Sections) is well-organized
- Photo-forward dish grid with hover zoom effect
- Status badges (Published/Draft/Archived) with consistent color coding
- Category filter with emoji indicators
- Context menu (Edit/Archive/Delete) on each dish
- Create Dish modal with two options (From Scratch/From Template)
- Bundle info card explaining quantity selection
- Sections with drag-ordering suggestion (numbering)

**Issues:**
- **Line 627-631:** Dish cards have `opacity: 0.6` for archived status but the status badge already communicates this — double-encoding the same information dims the photo needlessly.
- **Line 633-636:** Clicking a dish card navigates to `/menu/new` AND fires a toast "Editing: {name}" — but `/menu/new` is always a blank "Create New Dish" form. There's no edit mode.
- **Line 696-794:** Context menu (MoreHorizontal button) is always visible (`opacity: 100`). The comment says it should be hover-visible but the class `opacity-100` overrides any group-hover behavior.
- **Line 727-790:** Dropdown menu has no click-outside dismissal for dishes. `openMenuId` state only toggles on button click. User must click the same button or another dish's button to close.
- **Line 168:** Bundle images reuse the same two Unsplash URLs — "Family Dinner for 4" and "Mezze Tasting Plate" share the mansaf image.
- **Line 897-949:** Bundle cards link to `/menu/new` — should link to a bundle-specific creation/edit flow.
- **Line 982-1066:** Sections tab has "Create Section" that adds a generic "New Section N" — no name input or editing inline.
- **Line 192-199:** `let nextSectionId = 5` is a module-level mutable variable — will reset on hot reload but persist across re-renders in production. Not a bug for demo but poor pattern.

**Fixes for 10/10:**
- Add proper edit mode that pre-fills the form with existing dish data
- Implement click-outside dismissal for context menus
- Use unique images for each bundle
- Add drag-and-drop reordering for sections (the GripVertical icon is used elsewhere, bringing consistency)
- Add bulk actions (select multiple dishes to archive/publish)
- Show sales/order count per dish

---

### 5. Create/Edit Dish (`/src/app/(portal)/menu/new/page.tsx`)
**Score: 8.5/10**

**Strengths:**
- Best-in-class form design — collapsible sections, visual category picker, smart defaults
- Lead time system with Rolling vs. Weekly Cutoff is brilliant
- Cutoff preview text ("Customers see: Order by Sun 11:00 PM for Wed delivery") is genius
- Multi-size pricing with template shortcuts (Individual/Small Tray/Large Tray)
- Customization groups with Single/Multiple/Quantity selection types
- Quantity selection supports total-required, min-options, max-options
- Live preview sidebar (desktop) with real-time name/price/status
- Responsive bottom bar (fixed on mobile, inline on desktop)

**Issues:**
- **Line 428-432:** Desktop layout uses `grid-template-columns: 1fr 240px` with no responsive breakpoint class. The `create-dish-layout` class gets overridden at 1023px, but there's no intermediate state for tablet (768-1023px).
- **Line 565-646:** Photo upload area is purely decorative — no file input wired up. The 4 image slots have Upload icons but no click handler or file input.
- **Line 1312-1334:** Ingredients and Allergens fields are `readOnly` with placeholder text. These are important for food safety and should at minimum have a searchable multi-select.
- **Line 1667-1677:** GripVertical icon on modifiers implies drag-to-reorder but there's no drag-and-drop implementation.
- **Line 384:** `firstPrice` derived from `sizeRows[0]?.price` — if user deletes all size rows, preview shows "$0.00" which is misleading.
- **Line 1894-1916:** `<style jsx>` block is used for responsive styles — this is a Next.js CSS-in-JS pattern but the rest of the codebase uses inline `<style>` tags or globals.css. Inconsistent approach.
- **Line 193-213:** Lead time default is all days selected. New chefs probably shouldn't default to 7/7 availability.

**Fixes for 10/10:**
- Wire up photo upload with preview
- Implement ingredients/allergens as searchable multi-selects
- Add drag-and-drop for modifier reordering
- Add form validation with field-level errors
- Add "Preview as customer" button
- Add unsaved changes warning on navigation

---

### 6. Flash Sales (`/src/app/(portal)/flash-sales/page.tsx`)
**Score: 8/10**

**Strengths:**
- Full lifecycle management (Live/Upcoming/Draft/Past)
- Creation wizard with 3-step tabs (Details/Menu/Launch)
- Per-item flash pricing, quantity limits, and per-customer limits
- Visibility controls (Public/VIP/Private)
- Timeline visualization (Open > Close > Fulfill)
- Notification preview with editable text
- Checkout timer configuration
- Show-inventory toggle

**Issues:**
- **Line 509-582:** Action buttons (View Orders, Close Early, Edit, Cancel, etc.) are all either `<Link>` or `<button>` but none have onClick handlers that do anything meaningful. "Close Early", "Cancel", "Continue Editing", "Delete", "View Summary", "Duplicate" are all dead.
- **Line 1576-1588:** "Schedule Flash Sale" button just calls `onClose()` — doesn't save any data or show a success toast.
- **Line 1569-1571:** "Save as Draft" also just calls `onClose()` with no feedback.
- **Line 606-609:** Creation wizard dates are hardcoded to 2026-05-09 through 2026-05-11. These will look dated quickly. Should use relative dates.
- **Line 1095-1346:** Menu tab's available dishes list doesn't show images — just text. For a food platform, this is a missed opportunity.
- **Line 662-670:** Panel has `border: 1px solid rgba(51,31,46,0.08)` on the card but cards already have a border from the `.card` class — double border.
- **Line 134:** No skeleton loading state.

**Fixes for 10/10:**
- Wire up all action buttons with toasts at minimum
- Show dish images in the menu selection step
- Add skeleton loading
- Add "Duplicate" functionality that pre-fills the creation form
- Add analytics summary for past sales (orders over time, popular items)
- Dynamic date defaults

---

### 7. Operations (`/src/app/(portal)/operations/page.tsx`)
**Score: 8.5/10**

**Strengths:**
- Four store states (Pending/Approved-OFF/Live/Rejected) with distinct UI for each
- Rejected state with specific fix-it links per issue
- Weekly schedule with inline time-window editing
- "Copy Monday to weekdays" shortcut
- Block Today quick action
- Turn-off confirmation dialog
- Time Off with auto-pause indicator
- Date Overrides with calendar stamps and custom windows
- Auto-accept orders toggle

**Issues:**
- **Line 111-113:** `let nextId = 100; const genId = ()` — `nextId` is a local variable inside the component function, so `genId()` would always start at 100 if it weren't for the `Date.now()` suffix. Unusual pattern but works.
- **Line 432-498:** Time window selects have inline dropdown styling (`background: "none", border: "none"`) which looks good but removes any visual affordance that they're interactive. On mobile, these tiny inline selects may be hard to tap.
- **Line 586:** "Add time off" button creates hardcoded entry "Jan 10-12, 2026" — should open a date picker or at least use today's date.
- **Line 657:** "Add override" creates hardcoded "January 15, 2026" entry — same issue.
- **Line 89-95:** Date values in INITIAL_TIME_OFF and INITIAL_OVERRIDES are set to 2025 dates — already in the past relative to the demo date (May 2026).
- **Line 186-204:** Demo state toggle is always visible — no way to hide it for a clean demo presentation.

**Fixes for 10/10:**
- Add proper date picker for time off and overrides
- Use relative/future dates for mock data
- Add validation for overlapping time windows
- Add visual weekly calendar view (not just list)
- Add "Preview customer view of your hours" feature
- Hide demo toggle behind a query parameter

---

### 8. Reviews (`/src/app/(portal)/reviews/page.tsx`)
**Score: 7.5/10**

**Strengths:**
- Three tabs (Chef Profile/Dishes/Bundles)
- Rating distribution bar chart
- Expandable dish/bundle review lists
- Reply composer with character count
- Sort dropdown with click-outside dismissal
- Initials avatar fallback

**Issues:**
- **Line 16-22:** All reviews are 5 stars. The breakdown shows "5 star: 4, everything else: 0". This makes the distribution bars meaningless and doesn't test the UI with mixed ratings.
- **Line 181-193:** Sort function uses `list.reverse()` which mutates the array, and `list.sort()` which also mutates. Since `list` is a spread copy, it's technically safe but the "Oldest" sort just reverses the default order — it doesn't actually sort by date.
- **Line 317-318:** `<div className="accent-line" />` appears between header and content — this horizontal accent bar is a nice touch but isn't used consistently on other pages.
- **Line 471-543:** Dishes tab and Bundles tab (lines 547-619) are nearly identical code. Should be extracted to a shared component.
- **Line 80-108:** Dish review data has fractional ratings (5.0, 4.8, 4.2) but the StarRow component only renders full stars — no half-star support.
- **Line 159-233:** No loading/skeleton state.
- **Line 240-263:** Tab underline is at the top of the page with sort dropdown on the same row — on narrow screens, the sort button may be pushed to a new line breaking the visual alignment.

**Fixes for 10/10:**
- Add mixed-rating mock data (some 3-4 star reviews)
- Implement half-star rendering
- Extract shared dish/bundle review list component
- Add date-based sorting (parse actual dates, not just reverse)
- Add loading skeleton
- Add review response analytics (response rate, average response time)
- Add "Flag inappropriate review" option

---

### 9. Profile (`/src/app/(portal)/profile/page.tsx`)
**Score: 7.5/10**

**Strengths:**
- Collapsible section cards (consistent with Create Dish page)
- Live status indicator on profile card
- Cuisine search with dropdown autocomplete
- Character count on tagline
- Banner image upload placeholder
- Preview Store link

**Issues:**
- **Line 74-102:** Profile photo + name card has no responsive breakpoint — the 80px avatar + text works on desktop but may crowd on very narrow screens.
- **Line 76-93:** Profile photo upload uses a `<label>` wrapping an invisible `<input type="file">` — but there's no onChange handler or preview. The photo never actually changes.
- **Line 110-136:** "Your Kitchen" section has a `<select>` for cooking experience but no visual indicator of the current selection's meaning. "5" maps to "3-5 years" but the label just says "Cooking Experience".
- **Line 192-211:** Cuisine dropdown only shows when `cuisineSearch` has a value AND `filteredCuisines.length > 0`. If user clicks the input without typing, nothing happens. Should show all available cuisines on focus.
- **Line 251-287:** `SectionCard` component is defined inline but is identical to the one in `menu/new/page.tsx`. Should be a shared component.
- **Line 55-71:** Header has Save button at top and bottom — redundant but acceptable. However, the top "Save" gives no indication of unsaved changes.
- No form validation — empty business name is accepted.
- No loading/skeleton state.

**Fixes for 10/10:**
- Show all cuisines on input focus (not just when typing)
- Add form validation (required fields)
- Add unsaved changes indicator
- Extract SectionCard to shared component
- Add photo crop/preview on upload
- Add loading skeleton

---

### 10. Payments (`/src/app/(portal)/payments/page.tsx`)
**Score: 8/10**

**Strengths:**
- Three-state demo (Not Connected / Needs Info / Connected) covers full lifecycle
- "Get paid for your cooking" hero with 3-step visual journey
- FAQ accordion with smooth expand/collapse
- Info blocks grid (Secure/Fast/Transparent)
- Connected state: total earnings, next payout, bank account display
- Transaction history with type badges (order/payout/fee)
- Stripe Dashboard external link

**Issues:**
- **Line 15-20:** Transaction dates are hardcoded to April-May 2026. Order numbers (#1042, #1041, #1038) partially overlap with other pages' order data but amounts don't match ($48.00 vs $49.00 for #1042).
- **Line 93-98:** "Connect with Stripe" button directly sets state to "C" (Connected) — skipping the "B" (Needs Info) state entirely. Should go A > B > C.
- **Line 222-224:** Total earnings "$2,184.50" matches dashboard's "Revenue This Month: $2,184" approximately but not exactly (dashboard lacks cents).
- **Line 280-286:** "Stripe Dashboard" link uses `href="#"` — dead link.
- **Line 30:** No loading/skeleton state.
- **Line 102:** Info blocks grid uses `minmax(150px, 1fr)` which may cause 1-column layout on small screens. On 375px with padding, 150px minimum is tight.

**Fixes for 10/10:**
- Wire Stripe connect flow: A > B > C sequentially
- Fix Stripe Dashboard link (external URL or toast)
- Ensure revenue figures match across pages
- Add loading skeleton
- Add payout history view
- Add export transactions (CSV)

---

### 11. Settings (`/src/app/(portal)/settings/page.tsx`)
**Score: 7.5/10**

**Strengths:**
- Three-tab organization (Account/Integrations/Help)
- Comprehensive notification matrix (categories x channels with toggles)
- Channel management with "Send test" functionality and loading states
- Tutorial grid with progress tracking
- Video tutorials placeholder with play button
- Chef Playbook section
- Security section (password change, 2FA placeholder)
- Danger zone with delete confirmation

**Issues:**
- **Line 77-97:** Massive amount of state declared — 15+ useState calls. Should be consolidated into a reducer or form state object.
- **Line 253-254:** "Log out" and "Delete my account" are in the same visual group with minimal visual separation. "Delete my account" should have much more visual warning.
- **Line 277:** Integrations tab title "POS & Integrations" doesn't match the tab label "Integrations".
- **Line 338-355:** Tutorial grid cards are buttons that all fire `toast("Tutorial: {title} -- coming soon")`. None actually do anything.
- **Line 362-368:** Guide tabs use inline icons (Video, BookOpen) but these aren't consistent with tab patterns elsewhere.
- **Line 373:** Video player placeholder is a dark card with a play button — good concept but the video URL is just a toast. Should at minimum embed a YouTube video.
- **Line 235-238:** Password change form has no validation, no password strength indicator, no confirm-password field.
- No loading/skeleton state.

**Fixes for 10/10:**
- Add confirm-password and password strength indicator
- Add working tutorial walkthroughs (at least step indicators)
- Consolidate state management
- Add distinct visual treatment for destructive actions
- Add loading skeleton
- Make notification toggles persist (currently reset on page refresh)

---

### 12. Store Preview (`/src/app/(portal)/store-preview/page.tsx`)
**Score: 7/10**

**Strengths:**
- Full customer-facing store preview
- Banner image with gradient overlay
- Chef avatar positioned over banner edge
- "Preview Mode" badge
- Bio with expandable "Read more"
- Dish cards with photo overlay pattern and "Add" buttons
- "Powered by Yalla Bites" footer

**Issues:**
- **Line 36-38:** Dish prices don't match prices on Menu page. Mansaf is $22 here but $28 on Menu. Falafel is $14 here but $12 on Menu. Shawarma is $16 — matches Menu.
- **Line 54:** Negative margin `margin: "-16px auto"` — hacky layout adjustment. Should use proper layout containment.
- **Line 138-148:** Rating shows "4.8" but Reviews page has all 5-star reviews (5.0 average). Dashboard also says "4.8".
- **Line 251-258:** "Add" button fires toast "Preview only" but the button is styled as a real interactive element. Should look disabled or have a different visual treatment.
- **Line 188-203:** Dish grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` but Store Preview has its own max-width (960px), making the 3-column layout rarely trigger.
- **Line 166:** Content padding is `32px 24px 40px` — the 32px top padding combined with the 40px bottom after the "About" section below the avatar creates inconsistent spacing.
- No loading/skeleton state.
- No way to toggle between "customer view" and "chef view" annotations.

**Fixes for 10/10:**
- Sync dish prices with Menu page data
- Sync rating with Reviews page data
- Add "Edit" quick links overlaid on each section (edit profile, edit dish, etc.)
- Add device frame toggle (phone/tablet/desktop preview)
- Add loading skeleton
- Remove hacky negative margins

---

### 13. Pickup Address (`/src/app/(portal)/pickup-address/page.tsx`)
**Score: 7/10**

**Strengths:**
- Clean map placeholder with grid pattern and pin marker
- Address card with Copy and Edit functionality
- Pickup instructions with inline editing
- "Pickup hours follow your store schedule" info callout with link to Operations

**Issues:**
- **Line 26-71:** Map is a CSS placeholder, not an actual map. For a billion-dollar platform, this needs at minimum a static Google Maps embed or Mapbox image.
- **Line 79-104:** Address editing is a single text input — should be structured (street, city, state, zip) for proper geocoding.
- **Line 13:** Default address "2847 Elm Street, Dallas, TX 75226" is reasonable mock data.
- **Line 17-18:** `setCopied` uses navigator.clipboard.writeText which may fail silently in non-HTTPS contexts. No error handling.
- No validation on address changes.
- No loading/skeleton state.
- No "Verify address" or geocoding step.

**Fixes for 10/10:**
- Add real map integration (Google Maps static image at minimum)
- Use structured address fields
- Add address verification/geocoding
- Add delivery zone visualization
- Add loading skeleton
- Add error handling for clipboard API

---

### 14. Login (`/src/app/login/page.tsx`)
**Score: 8.5/10**

**Strengths:**
- Beautiful centered layout with warm decorative blobs
- Film grain overlay for editorial feel
- Magic link primary flow (modern, passwordless)
- Google OAuth option
- Collapsible password section (progressive disclosure)
- Proper 48px input height, 52px CTA
- Help email link at bottom
- Accessible touch targets (44px minimum)

**Issues:**
- **Line 85-88:** "Send me a login link" navigates directly to `/welcome` — no email validation, no loading state, no "check your email" confirmation screen.
- **Line 119-120:** Google sign-in also navigates to `/welcome` — no actual OAuth flow simulated.
- **Line 50-55:** Logo uses `/logo-light.png` — if this file doesn't exist, the page will show a broken image. No fallback.
- **Line 68-79:** Email input has no `name` attribute — password managers won't autofill properly.
- **Line 172-176:** Password input also has no `name` attribute.
- **Line 178-184:** "Sign in" button is `btn-ghost` — should be more prominent since it's a primary action.
- No "Create account" or "Apply as chef" flow for new users.

**Fixes for 10/10:**
- Add email validation before allowing "Send login link"
- Add "Check your email" confirmation state
- Add `name="email"` and `name="password"` attributes
- Add "Apply as a chef" link for new user acquisition
- Add loading state on sign-in buttons
- Make password sign-in button more prominent (btn-dark)

---

### 15. Welcome (`/src/app/welcome/page.tsx`)
**Score: 8.5/10**

**Strengths:**
- Celebration emoji with glow effect
- Personalized "Welcome, Amira!" with italic display font
- 5-step roadmap with icon + number + chevron
- Gradient-border cards with hover state
- "Let's go" gradient CTA
- "Skip for now" option (good for returning users)

**Issues:**
- **Line 108:** `style={{textAlign:"center"}}` — inline style with no space. Minor code style issue.
- **Line 131-193:** Step cards link to actual pages but there's no tracking of which steps are done. User can click "Go live!" first without completing prerequisites.
- **Line 14-45:** Steps data doesn't include descriptions — the dashboard onboarding has detailed `detail` strings for each step but Welcome page just has titles.
- **Line 196-206:** "Let's go" button goes to `/dashboard` which will show ModeB (active dashboard) by default, not ModeA (setup). New user would expect to see the setup checklist.
- No loading/skeleton state (acceptable for a simple page).
- Decorative blobs mirror login page exactly — could be more distinctive.

**Fixes for 10/10:**
- Link "Let's go" to dashboard with setup mode pre-selected
- Add step descriptions matching dashboard onboarding
- Track completed steps visually (checkmarks on done items)
- Add progress indicator (0 of 5 complete)
- Make step order match the dashboard's 10-step onboarding phases

---

### 16. Sidebar (`/src/components/layout/sidebar.tsx`)
**Score: 8.5/10**

**Strengths:**
- Collapsible with smooth animation
- Active item has red left-border accent
- Hover states with color transitions
- Group labels (Main/Business/Account)
- Chef avatar card with "View My Store" link
- Badge count on Orders
- Tooltip support when collapsed (`title` attribute)

**Issues:**
- **Line 124-128:** Active path matching is exact (`activePath === item.href`). Subpages like `/orders/1042` highlight the sidebar correctly via the layout's `oneSegmentKey`, but `/menu/new` would highlight "Menu" which is correct.
- **Line 136-139:** Padding logic for collapsed state has inconsistent values — `isActive ? "0 10px 0 8px" : "0 10px"` for expanded, `"0"` for collapsed. The 8px vs 10px difference accounts for the border-left but is fragile.
- **Line 67:** Sidebar width transitions from 56px to 260px — the 56px collapsed mode only shows icons, but there's no tooltip delay, making rapid hover-over jarring.
- **Line 93:** Logo doesn't scale down when sidebar is collapsed — it gets clipped by the 56px width.
- **Line 96:** Logo is wrapped in a Link to `/dashboard` — good for navigation but the img has no responsive handling for collapsed state.

**Fixes for 10/10:**
- Show a smaller logo/icon when collapsed
- Add keyboard shortcut to toggle sidebar (e.g., Cmd+\)
- Add drag-to-resize sidebar
- Add tooltip hover delay for collapsed mode
- Add notification dots on nav items for unread states

---

### 17. Bottom Tab Bar (`/src/components/layout/bottom-tab-bar.tsx`)
**Score: 8/10**

**Strengths:**
- Fixed bottom with glass morphism
- Active indicator dot below icon
- Badge count on Orders tab
- Safe area bottom padding
- 44px minimum touch targets per tab

**Issues:**
- **Line 18-23:** Only 5 tabs shown (Home/Orders/Menu/Reviews/Profile). Missing: Flash Sales, Payments, Operations, Settings, Pickup Address. These are only accessible via the mobile drawer.
- **Line 14:** `onMore` prop is defined in the interface but never wired up — was intended for a "More" tab to access other pages.
- **Line 37-39:** Active detection: Dashboard matches on `activePath === "/dashboard" || activePath === "/"`, others use `startsWith`. This means `/menu/new` will highlight "Menu" — correct behavior.
- **Line 61-62:** Icon `strokeWidth` is 1.5 for all icons — active icons should be thicker (strokeWidth 2) for visual emphasis.
- No haptic feedback on tap (iOS/Android).

**Fixes for 10/10:**
- Add "More" tab that opens the full nav drawer
- Differentiate active icon weight
- Add subtle scale animation on tap
- Consider moving badge to a dot (less cluttered on 5-item bar)

---

### 18. Top Bar (`/src/components/layout/top-bar.tsx`)
**Score: 8/10**

**Strengths:**
- Responsive: hamburger + centered title on mobile, breadcrumbs on desktop
- Cmd+K search pill (desktop)
- Bell with red notification dot
- Avatar link to profile
- Glass morphism sticky positioning

**Issues:**
- **Line 117-143:** Cmd+K search pill fires a toast "Search coming soon" — the most common power-user action is non-functional.
- **Line 146-177:** Bell notification links to `/orders` — should link to a notifications panel or at minimum show a dropdown.
- **Line 165-172:** Bell notification dot is hardcoded visible. No way to dismiss or mark as read.
- **Line 22:** `height: 52` on header — this is shorter than the standard 64px used by most apps. Combined with 13px font breadcrumbs, it may feel cramped on desktop.
- **Line 27-41:** Mobile hamburger button has `width: 40, height: 40` — meets 44px min-height due to the header's 52px constraint, but the button itself is 40px which is below the 44px guideline.

**Fixes for 10/10:**
- Implement Cmd+K search (even a simple one)
- Add notification dropdown or panel
- Make bell dot conditional on actual unread state
- Increase header height to 56-64px
- Increase hamburger button to 44px

---

### 19. Mobile Drawer (`/src/components/layout/mobile-drawer.tsx`)
**Score: 8/10**

**Strengths:**
- Slide-in animation from left
- Backdrop blur with fade-in
- Matches sidebar navigation structure exactly
- Close button with proper positioning
- Chef avatar footer with sign-out link
- Links auto-close drawer on navigation

**Issues:**
- **Line 68:** `if (!open) return null` — no exit animation. Drawer disappears instantly when closed. Should animate out.
- **Line 38-64:** Nav groups array is duplicated from sidebar.tsx — should be a shared constant.
- **Line 97-109:** Drawer width is 280px — on 375px screens, only 95px of backdrop is visible for tap-to-close. This is fine but could be wider tapping area.
- **Line 251-258:** Sign-out link goes to `/login` — no confirmation dialog for logout.
- No swipe-to-close gesture.
- No keyboard trap (focus should be contained within the drawer when open for accessibility).

**Fixes for 10/10:**
- Add exit animation (slide out + fade)
- Extract shared nav data to a constants file
- Add swipe-to-close gesture
- Add focus trapping for accessibility
- Add logout confirmation
- Add ESC key to close

---

### 20. Portal Layout (`/src/app/(portal)/layout.tsx`)
**Score: 8.5/10**

**Strengths:**
- Clean composition: Sidebar + TopBar + BottomTabBar + MobileDrawer
- Route-based breadcrumb configuration
- Responsive padding (16px mobile, 20px tablet, 32px desktop)
- Smart path matching: 2-segment first, then 1-segment fallback
- Bottom padding for mobile (pb-24 accounts for bottom bar)

**Issues:**
- **Line 109-118:** `activePath` is always `/${oneSegmentKey}` — for order detail pages `/orders/1042`, activePath becomes `/orders` which correctly highlights Orders in nav. But for deeply nested routes that don't exist yet, the fallback is "Dashboard" which may confuse.
- **Line 131-141:** Responsive padding uses injected `<style>` with `!important` — overrides should be in globals.css for maintainability.
- **Line 15-98:** routeMap doesn't include an entry for `orders/[id]` — the order detail page gets "Dashboard" as fallback breadcrumbs. Should show "Dashboard > Orders > Order #1042".
- **Line 141:** `pb-24 lg:pb-0` — 24 = 96px which overshoots the 56px bottom bar height. The extra 40px provides breathing room but is imprecise.

**Fixes for 10/10:**
- Add dynamic route handling for `/orders/[id]`
- Move responsive padding to globals.css
- Calculate bottom padding precisely from bottom bar height + safe area
- Add page transition animations between routes
- Add breadcrumb trail for order detail pages

---

### 21. Global CSS (`/src/app/globals.css`)
**Score: 9/10**

**Strengths:**
- World-class design system with clear documentation comments
- 3-tier shadow system (card/card-2/sticker) inspired by Stripe
- Spring-based easing curves
- Comprehensive button variants (red/amber/sage/ghost/terracotta/dark/gradient)
- 6-tier pill/badge system
- Toggle component with snap animation
- Skeleton loading with shimmer
- Receipt-row pattern for financial data
- Glass morphism utility
- Reduced motion media query
- Film grain overlay effect
- Responsive typography scaling
- 44px minimum touch targets enforced
- iOS zoom prevention (16px font on inputs)
- Horizontal overflow prevention
- Custom scrollbar styling

**Issues:**
- **Line 508:** `.btn-red` has `border-radius: 9999px` — making ALL red buttons pill-shaped. But this means `btn-red` on action buttons (like cancel confirmation) will be rounded pills when they should be 12px rounded rectangles. Conflating the pill shape with the color.
- **Line 717-767:** Mobile breakpoint at 639px uses `!important` on everything — a nuclear approach. This makes it impossible to override specific mobile styles without more `!important`.
- **Line 443:** `.section-stack > * + * { margin-top: 24px }` uses lobotomized owl pattern which is elegant but doesn't work well with conditional rendering (React fragments, ternary-rendered blocks).
- **Line 114:** `* { box-sizing: border-box; margin: 0; }` — this global reset is applied outside of `@layer base`, meaning it can't be overridden by Tailwind utilities without `!important`.
- **Line 177-178:** Focus styles use `!important` for `box-shadow` on inputs — this conflicts with any component that applies its own box-shadow to inputs.
- **Line 363:** `.textarea { resize: vertical; min-height: 100px; }` — 100px min-height for all textareas including small ones like the review reply composer.
- No dark mode support. The system is cream-only.

**Fixes for 10/10:**
- Separate `.btn-red` color from `.btn-pill` shape
- Reduce `!important` usage in mobile breakpoint
- Move global reset inside `@layer base`
- Add dark mode palette (even if secondary)
- Add container query support for component-level responsiveness
- Add print styles

---

## Cross-Cutting Issues

### 1. Data Inconsistency (Severity: HIGH)
Mock data is not centralized. Each page defines its own orders, dishes, prices, and ratings independently. This creates visible contradictions:
- Order IDs: Dashboard uses #1042-1040, Orders page uses #a8f2c1-style hashes
- Prices: Mansaf is $28 (Menu), $22 (Store Preview), $24 (Flash Sales available dishes)
- Rating: 4.8 (Dashboard, Store Preview) vs 5.0 (Reviews page)
- Priya R.'s order: pickup (Dashboard) vs delivery (Orders)

**Fix:** Create a shared `/src/data/mock-data.ts` file with all orders, dishes, customers, and prices. Import everywhere.

### 2. Missing Loading States (Severity: MEDIUM)
Only Dashboard and Orders have skeleton loading. 13 of 15 pages have no loading state, creating inconsistent perceived performance.

**Fix:** Add skeleton states to every page, or create a shared `PageSkeleton` component.

### 3. Non-Functional Upload Zones (Severity: MEDIUM)
Photo upload areas on Profile, Create Dish, and Dashboard quick-add are purely decorative. No file inputs are wired, no preview states exist.

**Fix:** Wire up file inputs with `URL.createObjectURL()` preview. Even without a backend, showing the selected image proves the UI works.

### 4. Duplicated Components (Severity: LOW)
`SectionCard` is defined identically in both `profile/page.tsx` and `menu/new/page.tsx`. Navigation groups are duplicated between `sidebar.tsx` and `mobile-drawer.tsx`.

**Fix:** Extract shared components and constants.

### 5. Inconsistent Tab Styling (Severity: LOW)
Some pages use red underline tabs (Menu, Reviews, Settings), others use dark underline tabs (Flash Sales, Operations Time Off). The active color alternates between `var(--color-red)` and `var(--color-brown)`.

**Fix:** Standardize on one tab style. Red underline is more on-brand.

### 6. Context Menu Patterns (Severity: LOW)
Menu page dish cards and section rows use custom dropdown menus without click-outside dismissal. Reviews page sort dropdown correctly implements click-outside via `useRef` + `useEffect`. These patterns should be unified.

**Fix:** Create a shared `<Dropdown>` component with click-outside handling.

---

## The Billion-Dollar Punch List

### CRITICAL (Broken/Ugly/Confusing) — Fix Before Any Demo

1. **[C1] Order detail page data mismatch** — Orders list links to detail pages using hash-based IDs that don't exist in the detail page's lookup. Every "View full details" click shows the wrong order. *Fix: Unify order ID system or add hash-to-data mapping.*

2. **[C2] Order stepper ignores "paid" status** — The first status a chef sees (paid) shows no active step in the progress stepper. Step 1 should be "Confirm" and show as current. *Fix: Add step index 0 for "paid" status or prepend a "Paid" step.*

3. **[C3] `.btn-red` forces pill shape globally** — Line 508 of globals.css adds `border-radius: 9999px` to `.btn-red`, which affects cancel confirmation buttons and other non-pill contexts. *Fix: Remove `border-radius: 9999px` from `.btn-red`, keep it on `.btn-pill` and `.btn-gradient`.*

4. **[C4] Tab count badges don't update** — Orders page tab counts use `useMemo([])` with no dependencies, so advancing an order's status doesn't update the "Paid: 2" / "Confirmed: 1" counts. *Fix: Add `statusOverrides` to useMemo dependency array.*

5. **[C5] Menu dish cards link to blank create form** — Clicking any dish card navigates to `/menu/new` which is always a blank form. There's no edit mode. *Fix: Either add edit capability or remove the click-through.*

### IMPORTANT (Inconsistency/Sizing/Spacing) — Fix Before Launch

6. **[I1] Create shared mock data file** — Centralize all orders, dishes, customers, prices, and ratings into `/src/data/mock-data.ts`. Import everywhere. Eliminates all cross-page data contradictions.

7. **[I2] Add skeleton loading to all pages** — Create a shared `<PageSkeleton variant="list|grid|form">` component. Apply to Menu, Flash Sales, Reviews, Profile, Payments, Settings, Operations, Pickup Address, Store Preview.

8. **[I3] Fix pagination touch targets** — Orders page pagination buttons are 28x28px. Make them 44x44px on mobile (keep 28px on desktop with surrounding padding).

9. **[I4] Unify tab underline color** — Standardize on red underline for all tabs. Currently: Menu (red), Reviews (red), Settings (red), Flash Sales (brown), Operations (red). Change Flash Sales to red.

10. **[I5] Extract SectionCard component** — Move from inline definitions to `/src/components/ui/section-card.tsx`. Used on Profile and Create Dish pages.

11. **[I6] Extract nav groups constant** — Move from sidebar.tsx and mobile-drawer.tsx to `/src/lib/constants/navigation.ts`.

12. **[I7] Add click-outside to Menu context menus** — Dish card and section row dropdown menus lack click-outside dismissal. Create shared `<Dropdown>` component.

13. **[I8] Store Preview prices** — Sync with Menu page data. Mansaf: $28 not $22. Falafel: $12 not $14.

14. **[I9] Store Preview rating** — Sync with Reviews data. Should show 5.0 not 4.8. Or add some 4-star reviews to Reviews page to make 4.8 accurate.

15. **[I10] Add order detail route to layout breadcrumbs** — `/orders/[id]` should show "Dashboard > Orders > Order #ID" not fall back to "Dashboard".

16. **[I11] Mobile hamburger button size** — Top bar hamburger is 40x40px. Increase to 44x44px for accessibility compliance.

17. **[I12] Fix mobile bottom padding calculation** — Layout uses `pb-24` (96px) for a 56px bar. Use `pb-16` (64px) or calculate precisely.

### POLISH (Micro-interactions/Details) — Fix for Premium Feel

18. **[P1] Add exit animation to mobile drawer** — Currently disappears instantly. Add reverse slide-out + fade-out.

19. **[P2] Differentiate active bottom tab icon** — Use `strokeWidth: 2` for active tab icons, `1.5` for inactive.

20. **[P3] Add focus trapping to mobile drawer** — For accessibility, focus should be contained within the drawer when open. Also add ESC to close.

21. **[P4] Add half-star support to Reviews** — StarRow component only renders full stars. Dish ratings like 4.8 and 4.2 should show partial fills.

22. **[P5] Add hover states to Dashboard stat cards** — Currently no visual feedback on hover. Add `card-hover` class or subtle color shift.

23. **[P6] Collapsed sidebar logo** — When sidebar is collapsed to 56px, the full logo gets clipped. Show a symbol/icon-only logo instead.

24. **[P7] Email/password name attributes on Login** — Add `name="email"` and `name="password"` for password manager autofill support.

25. **[P8] Login "Sign in" button prominence** — Password sign-in button is `btn-ghost`. Should be `btn-dark` since it's a primary action.

26. **[P9] Welcome page "Let's go" destination** — Should navigate to dashboard in setup mode (ModeA), not default dashboard (ModeB).

27. **[P10] Wire photo upload previews** — On Profile and Create Dish, use `URL.createObjectURL()` to show selected image preview.

28. **[P11] Remove module-level mutable variable** — Menu page line 199: `let nextSectionId = 5` should be managed in state.

29. **[P12] Move inline `<style>` tags to globals.css** — Multiple pages inject `<style>` blocks for responsive overrides. Consolidate into the design system CSS.

30. **[P13] Add unsaved changes warning** — Profile and Create Dish forms should warn before navigation if there are uncommitted changes.

31. **[P14] Add mixed-rating review data** — All 5-star reviews make the distribution chart pointless. Add some 3-4 star reviews.

32. **[P15] Improve Operations time window select affordance** — Inline selects with `background: none, border: none` don't look tappable on mobile.

### STRETCH (Aspirational Features) — For v2

33. **[S1] Implement Cmd+K search** — Even a simple filter across pages/orders/dishes would be powerful.

34. **[S2] Add notification panel** — Bell icon should open a dropdown with recent notifications (new orders, reviews, payouts).

35. **[S3] Add real map on Pickup Address** — Google Maps static image or Mapbox GL integration.

36. **[S4] Add dark mode** — The design system's warm tones would translate beautifully to a dark palette.

37. **[S5] Add drag-and-drop** — For menu section reordering and customization modifier reordering.

38. **[S6] Add page transition animations** — Cross-fade or slide between routes for app-like feel.

39. **[S7] Add keyboard shortcuts** — Beyond Cmd+K: Cmd+N for new dish, Cmd+O for orders, etc.

40. **[S8] Add "What's New" changelog** — For platform updates, shown in Settings > Help.

41. **[S9] Add real-time order updates** — WebSocket or polling for new order notifications.

42. **[S10] Add multi-language support** — The chef demographic likely includes non-English speakers.

---

**Total items: 42**
- Critical: 5
- Important: 12
- Polish: 15
- Stretch: 10

**Estimated effort to reach 9.5/10:** 2-3 focused dev days on Critical + Important items.
**Estimated effort to reach 10/10:** 5-7 days including all Polish items.

---

*This audit was conducted by reading every line of every file. The portal is genuinely impressive — it's closer to a shipping product than 95% of demos I've reviewed. The issues above are refinements, not rewrites. Ship the Critical fixes, then iterate.*
