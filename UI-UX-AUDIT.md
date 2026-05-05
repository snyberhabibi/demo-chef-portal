# UI/UX Audit — Yalla Bites Chef Portal
**Date:** May 4, 2026
**Auditor perspective:** VP of Design at Stripe/Airbnb reviewing before a board presentation
**Live URL:** https://demo-chef-portal.vercel.app

---

## Executive Summary

**Overall score: 6.8/10**

This portal has a genuinely strong design foundation. The warm cream-and-brown palette, the typography system, the Stripe-inspired card hierarchy -- these are not amateur choices. The design system in `globals.css` is one of the best custom CSS systems I have seen in a prototype.

But the gap between the system's *potential* and its *execution* is where this falls apart. There is overuse of decorative effects (accent-line on nearly every page, btn-gradient used promiscuously), inconsistent spacing between pages, dead buttons that erode trust, a mobile experience that has not been pressure-tested, and several pages that feel like they were built in a sprint and never reviewed.

A chef in Dallas cooking mansaf from her kitchen would open this and think "wow, this looks nice." But within 10 minutes, she would hit three dead buttons, wonder why the "Create Section" button does nothing, and start to question whether this platform is actually ready. That is the gap we need to close.

---

## Global Issues (Every Page)

### Design System Overuse
- **`.accent-line` appears on 14+ pages.** It should appear on 3-4 key pages max (Login, Dashboard, Reviews summary). When everything has a gradient underline, nothing does. It becomes visual noise.
- **`.btn-gradient` is used for too many actions.** "Send me a login link," "Let's go," "Save Dish," "Continue," "Post Reply," "View Full Playbook PDF," "Request Branded Packaging," "Send test order," "Connect with Stripe" -- this is the brand CTA and it should be reserved for THE ONE primary action on each page. Secondary actions should use `btn-dark` or `btn-ghost`.
- **`.text-gradient` usage:** Login page (good), Reviews summary (fine), Payments connected state (fine), Tutorials "Start" links (too much -- 8 instances on one page). Should be 2-3 places in the entire app.
- **`.glow-*` effects:** Used on Welcome celebration, Operations live banner, Payments payout, Settings avatar, Pickup pin, Portal Guide play button, Store Preview badge, Integrations Square icon. Some add value (Operations live status). Most are invisible noise.
- **`.grain` texture:** Used on Login, Store Preview banner, Dashboard sticker, Packaging CTA. Effectively invisible on most screens. Remove from everything except the Login page where the editorial feel makes sense.

### Inline Styles vs CSS Classes
Nearly every component uses verbose inline `style={{}}` objects instead of utility classes or CSS. This makes the codebase brittle and hard to maintain. Lines like `style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", whiteSpace: "nowrap" }}` appear hundreds of times. This is not a design issue per se, but it signals a codebase that was built fast without a component library.

### Touch Target Compliance
The bottom tab bar icons are 20px with the tab area relying on flex spacing. The actual touch targets appear compliant (44px+ via the Link wrapper), but the visual hit areas feel small. Several inline buttons (e.g., the X to remove a cuisine tag on Profile, line 269) have no explicit min-height and may fail the 44px test.

---

## Per-Page Audit

---

### Login Page -- /login
**Current score: 8/10**

**What works:**
- Clean, focused single-column layout with proper max-width (380px)
- Password-less login as default is a smart UX choice for the audience
- Collapsible password section keeps the page clean
- Proper help link with mailto
- Decorative blobs are subtle and tasteful

**What's broken or ugly:**
- The `accent-line` after the headline (line 64) adds nothing here. The headline already has `text-gradient` for emphasis. Double-decorating dilutes both.
- The "Forgot password?" button (line 191-202) has no `onClick` handler -- it is a dead button.
- The password section duplicates the email field (line 172-176). If I entered my email above, it should pre-fill or this field should not exist.

**What a VP of Design at Stripe would flag:**
- The Google button SVG (lines 121-143) is hand-coded inline. This is fragile.
- No error states shown for invalid email
- No loading state on the CTA button
- Caption text "We'll email you a login link" should appear as a toast *after* clicking, not before. Before clicking, it reads as redundant.

**Specific fixes needed:**
1. Remove `accent-line` from this page entirely
2. Wire up "Forgot password?" or remove it
3. Pre-fill email in the password section from the top input
4. Add a loading spinner state to "Send me a login link"

---

### Welcome Page -- /welcome
**Current score: 7.5/10**

**What works:**
- Celebration emoji in a circle is warm and inviting
- The 5-step onboarding checklist with icons is clear
- Two CTAs ("Let's go" + "Skip for now") give the chef agency
- Proper use of `card-gradient-border` for the step cards

**What's broken or ugly:**
- Two `<h1>` tags on the same page (lines 111, 115). Screen readers will be confused. The name "Amira!" should be a `<span>` inside the first h1.
- "Go live!" step links to `/operations` (line 44) which is confusing -- that is the same destination as "Set your hours."
- The `accent-line` under the subtitle (line 133) is again unnecessary with the headline already being visually prominent.

**What a VP of Design at Stripe would flag:**
- The step cards are all identical -- no visual differentiation for completed vs. upcoming. In a real onboarding, steps 1-4 should show progress state.
- "Takes about 5 minutes" is a great touch but should be backed by actual timing data.

**Specific fixes needed:**
1. Fix the duplicate h1 -- use a single h1 with the name as a styled span
2. Give "Go live!" its own destination or make it a non-link "coming soon" item
3. Remove accent-line

---

### Dashboard -- /dashboard
**Current score: 8.5/10**

**What works:**
- The A/B mode toggle between Onboarding and Dashboard is excellent product thinking
- Progress ring SVG is well-executed and satisfying
- Phased onboarding checklist with color-coded left borders is very clear
- Stat cards with sparklines are Stripe-quality
- Urgency strip with horizontal scroll is smart for mobile
- Inline quick-add dish form (step 5 expansion) is a genuinely delightful UX pattern
- Time-appropriate greeting is a nice personal touch
- "Today" summary banner at the bottom is useful

**What's broken or ugly:**
- The mode toggle tabs (lines 308-348) use raw inline styles for what should be a reusable tab component. The tab styling is duplicated verbatim.
- In Mode A, the "Need help? Talk to a real human" link (line 742) goes to `/help` which does not exist in the router config. Dead link.
- The motivational sticker (line 720) says "12 chefs went live this week in Dallas" -- this is hardcoded. In production this would feel stale fast.
- Mode B quick actions: "Create Dish" uses `btn-gradient` which is correct as the primary action. But "View My Store" and "Manage Hours" are plain cards that look identical to each other but different from the CTA. The hierarchy is right, but the three cards at different visual weights look unbalanced.

**What a VP of Design at Stripe would flag:**
- `accent-line` under "RECENT ORDERS" eyebrow (line 933) is excessive. The eyebrow label itself is sufficient.
- The recent orders in Mode B link all rows to `/orders` generically (line 952) instead of `/orders/{id}`. A chef tapping an order expects to see that specific order.
- The stat sparklines are decorative -- they do not change. In production, these need to be real or removed.

**Specific fixes needed:**
1. Fix the `/help` dead link -- point to `/portal-guide` or a support mailto
2. Link recent order rows to specific order detail pages
3. Remove accent-line from the "RECENT ORDERS" section header
4. Make the 3 quick-action cards equal height on mobile (they already are via `height: 72`)

---

### Orders List -- /orders
**Current score: 8/10**

**What works:**
- Filter tabs with counts are clear and functional
- Search works with customer name, order ID, and dish name
- Urgency indicators (overdue, due-soon) with red/amber left borders are excellent
- Empty state with icon and CTA is well-done
- Pagination with rows-per-page selector is Stripe-quality
- Inline action buttons (Confirm, Prep, Ready, Hand Off) with color-coded states

**What's broken or ugly:**
- The `accent-line-sm` after the filter tabs (line 433) is unnecessary clutter
- Mobile search has a `marginTop: -8` hack (line 478) -- this suggests the spacing system is not handling the layout correctly
- The action buttons inside `<Link>` wrappers use `e.preventDefault()` and `e.stopPropagation()` (line 758-759). This works but is a code smell -- the button steals the click from the Link.

**What a VP of Design at Stripe would flag:**
- The payout amount is shown on every row (line 743-750) as a tiny caption under the price. This is useful but the visual hierarchy makes it hard to read. Consider removing it from the list and showing it only in the detail view.
- On mobile, the method pills and ready-by times are hidden (`hidden md:flex`, line 680). This means mobile users lose important context about delivery vs. pickup and when to have the order ready.
- The pagination buttons (lines 815-838) use inline styles that duplicate the entire pill styling. Should use `.pill .pill-brown` pattern consistently.

**Specific fixes needed:**
1. Remove `accent-line-sm` after the filter tabs
2. Show at least the delivery/pickup icon on mobile (even if the text is hidden)
3. Fix the `marginTop: -8` hack with proper spacing

---

### Order Detail -- /orders/[id]
**Current score: 8.5/10**

**What works:**
- Progress stepper with pulse animation on the current step is polished
- ETA card with countdown is immediately useful
- Receipt-style order summary with dotted lines is Stripe-perfect
- Payout highlight in sage is clear and motivating
- Activity timeline is clean
- Customer card with call/email actions and Maps link
- Item cards with customization details are thorough
- Sticky bottom CTA bar on mobile

**What's broken or ugly:**
- The page is hardcoded to show order `#a8f2c1` regardless of the URL (line 23). This means every order detail link shows the same content.
- The bottom bar uses `btn-gradient` (line 749) for the action button. On this page, the action button should match the order-state-specific color (red for Confirm, amber for Prep, sage for Ready).
- Cancel order link (line 713-729) only shows a toast. No confirmation dialog, no actual state change.

**What a VP of Design at Stripe would flag:**
- The 2-column layout (left: items/customer, right: summary/timeline) only activates at 1024px (line 310-317). Between 768-1024px, it is a single column which wastes horizontal space.
- The customer note (lines 409-443) uses a `Quote` icon but the styling makes it look like an error message at first glance.

**Specific fixes needed:**
1. The hardcoded order data should at minimum show different content for different URLs
2. Bottom action button should use state-specific colors, not btn-gradient
3. Add a confirmation dialog for cancel order

---

### Menu (Dishes) -- /menu
**Current score: 7.5/10**

**What works:**
- Dual filter system (status pills + category pills with emojis) is intuitive
- Photo-forward card grid with status overlays is visually strong
- 3-dot menu on hover is a nice touch
- Create dish modal with "From Scratch" vs. "From Template" is thoughtful
- Empty state with CTA

**What's broken or ugly:**
- The `accent-line` under "Dishes" heading (line 301) is here again. Remove it.
- Another `accent-line-sm` after the filters (line 419). Too much decoration.
- Every dish card links to `/menu/new` (line 474) -- clicking "Homemade Mansaf" should open an edit view, not the create view.
- The 3-dot menu button (line 524-540) has no onClick handler. It is purely decorative. A chef would expect Edit, Duplicate, Archive, Delete options.
- Both modal options ("From Scratch" and "From Template") link to the same `/menu/new` page (lines 219, 257). The template option is fake.
- Some dishes reuse the same Unsplash image (e.g., Hummus and Tabouleh both use the same photo at line 57 and 73). This looks like a bug, not variety.

**What a VP of Design at Stripe would flag:**
- The pagination shows "Showing 1-11 of 11" with a single page button (lines 574-587). This is useless chrome -- remove pagination entirely until there is more than one page of content.
- The category filter scrollbar is hidden with `scrollbarWidth: "none"` (line 361) but there is no visual affordance that this scrolls. Add fade edges or an arrow.
- Card image border-radius is `20px 20px 0 0` (line 491) but the card itself uses `rounded-[20px]` (line 477). These match, but the inner image has a different radius via inline style. Be consistent.

**Specific fixes needed:**
1. Remove both accent-lines
2. Link dish cards to `/menu/{id}/edit` not `/menu/new`
3. Wire up the 3-dot menu with real actions
4. Use different images for different dishes
5. Remove pagination until it is actually needed

---

### Create/Edit Dish -- /menu/new
**Current score: 7/10**

**What works:**
- 5-step wizard with sidebar stepper is clear and well-structured
- Live preview card in the sidebar updates with the dish name
- Tip box with lightbulb icon is helpful
- Category selection as a visual grid with emojis is delightful
- Spice level as pill toggles is perfect for the audience
- Portion size table with add/remove is functional
- Mobile step indicator (pill dots) is clean
- Fixed bottom navigation bar

**What's broken or ugly:**
- The "Save Dish" button (line 132) navigates to `/menu` without saving anything. No confirmation, no toast, no validation.
- "Discard" button (line 129) also just navigates away with no confirmation.
- Step 2 (Media): The upload zone and image slots (lines 529-584) are entirely non-functional. No file input, no click handler. They look clickable but do nothing.
- Step 3: Ingredients, Allergens, and Dietary Labels fields (lines 748-780) are all `readOnly` inputs with placeholder text. They look like select fields but cannot be interacted with.
- Step 5: "Add Group" button (line 851) has no onClick. Dead button.
- The bottom navigation bar (lines 877-939) overlaps with the portal layout's bottom tab bar on mobile. Both are fixed at the bottom.
- `accent-line-sm` under the current step in the sidebar (line 214). Unnecessary.

**What a VP of Design at Stripe would flag:**
- The wizard layout grid is `260px 1fr` (line 141) but the content area has `maxWidth: 600` (line 319). This means on wide screens there is a lot of wasted space to the right.
- There is no "Required" indicator styling beyond the asterisk in the field label text. Stripe uses subtle red asterisks with proper aria attributes.
- The preview card shows "$0.00" as the price (line 285-286) which feels broken rather than empty.

**Specific fixes needed:**
1. Add save confirmation with toast feedback
2. Add discard confirmation dialog
3. Make upload zones functional or clearly mark as "coming soon"
4. Fix the double-bottom-bar conflict on mobile
5. Show "--" instead of "$0.00" when no price is set

---

### Bundles -- /bundles
**Current score: 7/10**

**What works:**
- Consistent card grid style with the Dishes page (Menu and Bundles feel like siblings -- good)
- Status filter pills match the Menu page pattern
- Item count pill on the image overlay is useful
- Subtitle explaining bundle purpose is helpful

**What's broken or ugly:**
- `accent-line` under "Bundles" heading (line 94). Again, overdone.
- "Create Bundle" button links to `/menu/new` (line 99). This is wrong -- creating a bundle is not creating a dish. Even as a prototype, this destination mismatch is confusing.
- Every bundle card links to `/menu/new` (line 204). Same issue as the Dishes page.
- No empty state defined. If all bundles are filtered out, nothing shows.
- The search functionality is duplicated with the exact same code as the Menu page. This should be a shared component.

**What a VP of Design at Stripe would flag:**
- The pagination is present but useless with only 4 items (lines 308-322).
- Bundle cards do not show what dishes are inside them. The "5 items" pill tells me quantity but not content. A chef needs to see what dishes make up the bundle.

**Specific fixes needed:**
1. Remove accent-line
2. Create a proper bundle creation flow (or link to a clear placeholder)
3. Add an empty state
4. Show dish names in the bundle card

---

### Custom Menu Sections -- /sections
**Current score: 6.5/10**

**What works:**
- Clean list layout with drag handles is appropriate for a reorderable list
- Status badges (Active/Inactive) are clear
- 3-dot menu is present

**What's broken or ugly:**
- `accent-line` under the heading (line 30). Remove.
- The drag handles (GripVertical, line 64) suggest drag-and-drop but there is no drag-and-drop implementation. This is misleading.
- "Create Section" button (line 36) has no onClick handler. Dead button.
- The 3-dot menu button (line 95-114) has no dropdown, no actions. Dead button.
- No editing capability at all. You cannot rename, toggle, or delete sections.

**What a VP of Design at Stripe would flag:**
- This page is functionally dead. Every interactive element is non-functional. A chef landing here would immediately lose trust.
- The page subtitle says "Drag to reorder" but dragging does nothing.
- There is no empty state for zero sections.

**Specific fixes needed:**
1. Remove accent-line
2. Either implement drag-and-drop or remove the drag handles and "Drag to reorder" text
3. Wire up Create Section, 3-dot menu, and toggle functionality
4. Add inline editing for section names

---

### Reviews -- /reviews
**Current score: 8/10**

**What works:**
- Three-tab system (Chef Profile, Dishes, Bundles) is well-organized
- Rating summary card with distribution bars is Stripe-quality
- Reply composer with character counter is thorough
- Existing reply display with left-border accent is clean
- Dish/Bundle accordion with individual reviews is space-efficient
- Sort dropdown is functional

**What's broken or ugly:**
- `accent-line` on line 290. Remove.
- Jordan L. has a 1-star rating (line 63) but the review text is overwhelmingly positive ("everyone went back for seconds"). This makes the demo data look obviously fake and careless.
- The `text-gradient` on the "4.0" rating (line 299) is decorative overkill for a number.
- Sort dropdown (lines 238-287) has no backdrop click-to-close. You can only close it by selecting an option.
- The sort functionality does not actually sort anything. Clicking "Oldest" or "Highest" does not reorder the reviews.

**What a VP of Design at Stripe would flag:**
- The reply composer opens by default for Priya R.'s review (line 55, `composerOpen: true`). This is jarring -- the page loads with a textarea already visible.
- There is no way to delete a posted reply.
- No pagination on reviews. With many reviews, this page would become very long.

**Specific fixes needed:**
1. Remove accent-line
2. Fix Jordan L.'s rating to 5 stars to match the review text
3. Default all composers to closed
4. Implement actual sorting
5. Add click-outside-to-close on the sort dropdown

---

### Profile -- /profile
**Current score: 7/10**

**What works:**
- 5-step wizard format is consistent with the Create Dish flow
- Sidebar with progress bar and step navigation
- Tip box per step is helpful
- Cuisine tag system with add/remove is intuitive
- Operations step with toggles and weekly schedule
- "Preview My Store" link in the top bar

**What's broken or ugly:**
- `accent-line-sm` under the current step in sidebar (line 174). Remove.
- The "Discard" button (line 98) has no handler. Dead button.
- The "Save" button (line 99) has no handler. Dead button.
- Step 5 (Operations) weekly schedule (lines 370-395) is read-only. You cannot change the hours. The operations page handles this, but having it here as a read-only table is confusing -- is it informational or is it broken?
- The "Continue" button at step 5 is disabled with `opacity: 0.5` (line 437). This means there is no way to "finish" the profile wizard. The user is stuck.

**What a VP of Design at Stripe would flag:**
- The profile page duplicates a lot of the Operations page (toggles, schedule). This creates confusion about where to manage these settings.
- No form validation at all. Business name could be empty.
- The branding step (Step 4) is just an upload zone with no preview of how the banner looks on the store.

**Specific fixes needed:**
1. Wire up Save/Discard buttons
2. Make the schedule in Step 5 either editable or clearly link to Operations with "Manage these on the Operations page"
3. Add a "Finish" action at step 5 instead of a disabled Continue
4. Add basic form validation

---

### Operations -- /operations
**Current score: 8/10**

**What works:**
- State machine (Pending/Approved-OFF/Live/Rejected) is well-thought-out
- Each state has a distinct, appropriate visual treatment
- The "live" state with green glow toggle is satisfying and clear
- Rejected state with specific fix items and links is actionable
- Weekly schedule with expandable time pickers per day
- "Copy to all weekdays" is a genuine time-saver
- Auto-accept toggle is important and well-placed

**What's broken or ugly:**
- The state toggle buttons at the top (lines 51-75) are demo controls that should be hidden in production. They look like they are part of the interface.
- The "Fix this" links in the rejected state (line 184) all go to `/profile`, which is correct but could be more specific (e.g., deep-link to the relevant profile step).
- The "Resubmit for Review" button (line 192) is permanently disabled with no path to enable it.
- Time picker only offers hour increments (8, 9, 10... no 8:30, 9:15). Real chefs have specific hours.

**What a VP of Design at Stripe would flag:**
- No accent-line on this page. Good.
- The weekly schedule card does not have a visible save action. If I change hours, when are they saved? Auto-save? There is no feedback.
- The toggle between "live" and "approved-off" is instant with no confirmation. Accidentally toggling this off could mean missed orders.

**Specific fixes needed:**
1. Hide or clearly label the demo state buttons
2. Add finer time increments (15-minute intervals)
3. Add a confirmation dialog before toggling the store off
4. Add save feedback for schedule changes

---

### Payments -- /payments
**Current score: 7.5/10**

**What works:**
- Three clear states (Not connected, Needs info, Connected) with good visual differentiation
- Connected state with total earnings, next payout, bank account is comprehensive
- Transaction history is Stripe-like with type pills (order/payout/fee)
- FAQ accordion is well-implemented
- Info blocks (Secure, Fast, Transparent) build trust

**What's broken or ugly:**
- State A has `accent-line` (line 55). Remove.
- State toggle buttons (lines 36-42) are demo controls exposed to the user.
- State C has `text-gradient` on the earnings number (line 216). This is acceptable but combined with `glow-sage` on the card (line 211), it is overdecorated.
- The "Stripe Dashboard" link (line 274) goes to `#`. Dead link.
- The "Manage" button next to the bank account (line 241) has no handler. Dead button.

**What a VP of Design at Stripe would flag:**
- In State A, the "Connect with Stripe" button is `btn-gradient btn-block btn-lg` (line 94). This is correct use of the gradient CTA.
- The transaction history shows only 5 items with no pagination or "View more" link.
- No export/download option for transaction history.

**Specific fixes needed:**
1. Remove accent-line from State A
2. Hide demo state buttons
3. Wire up "Manage" button and "Stripe Dashboard" link
4. Add "View all transactions" with pagination

---

### Settings -- /settings
**Current score: 7.5/10**

**What works:**
- Notification matrix (categories x channels) is a proven pattern
- Toggle scaling for the matrix cells is smart space-saving
- Security section with password change and 2FA is appropriately organized
- Danger zone at the bottom with confirmation dialog is well-implemented
- Phone edit inline with save/change toggle

**What's broken or ugly:**
- `accent-line` in the danger zone (line 235). Remove.
- `glow-orange` on the avatar (line 44). This makes the profile photo look like it has an error.
- "Set up" 2FA button (line 228) has no handler. Dead button.
- "Change photo" button (line 53) has no handler. Dead button.
- The co-pilot invite section (lines 143-176) says "coming soon" but the expandable pattern makes it look functional. Use a disabled state instead.
- The full name input (line 62) uses `defaultValue` instead of `value` with onChange. This means React does not control the input -- saving would lose changes.
- Email is read-only but there is no way to change it. No "Change email" flow.

**What a VP of Design at Stripe would flag:**
- The password change section (lines 184-215) is hidden behind a chevron with no indication that this is expandable. Users might not find it.
- No save button at the bottom of the page. If I change my name and notification preferences, how do I save?

**Specific fixes needed:**
1. Remove accent-line and glow-orange
2. Add a global save button or auto-save with feedback
3. Wire up dead buttons (Change photo, Set up 2FA)
4. Use controlled inputs for the name field

---

### Tutorials -- /tutorials
**Current score: 6.5/10**

**What works:**
- Progress bar at the top is motivating
- Card grid layout with icon, title, description, and step count is clear
- Completed state with checkmark pill

**What's broken or ugly:**
- `accent-line` under the progress bar (line 94). Remove.
- `text-gradient` is used on EVERY card's "Start" / "Run again" link (line 167). That is 8 gradient texts on one page. This is the worst overuse of the effect in the entire app.
- Every card links to `#` (line 120). ALL eight tutorials are dead links.
- The progress bar claims 1/8 completed but there is no way to actually complete tutorials since they all link to `#`.

**What a VP of Design at Stripe would flag:**
- The card icons all use the same style (cream-deep circle). There is no visual variety to distinguish "Managing Orders" from "Creating Dishes." Consider using the brand colors to differentiate categories.
- No search or filter on tutorials. With 8 items this is fine, but the page structure does not scale.

**Specific fixes needed:**
1. Remove accent-line
2. Replace `text-gradient` on card links with a simple red color
3. Link tutorials to actual content or at minimum a "Coming soon" page
4. Differentiate card colors by category

---

### Portal Guide -- /portal-guide
**Current score: 6/10**

**What works:**
- Tab system (Video Tutorials / Chef Playbook) is clean
- Video placeholder with play button is well-styled
- Playbook card with download CTA is clear

**What's broken or ugly:**
- The video placeholder (lines 53-90) is entirely non-functional. No video URL, no click handler. The "Click to play video" caption is misleading.
- The "View Full Playbook PDF" button (line 118) has no handler. Dead button.
- The video title says "Yalla Bites Chef Success Playbook" and the PDF also says "Chef Success Playbook." The naming collision between the video and PDF sections is confusing.
- This page and the Tutorials page overlap conceptually. Why are there two separate help/guide sections?

**What a VP of Design at Stripe would flag:**
- The Chef Playbook tab has only one item. This is a tab with one card. It should either have more content or not be a tab.
- No accent-line on this page. Good.

**Specific fixes needed:**
1. Either embed an actual video or show a clear "Video coming soon" message
2. Wire up the PDF download
3. Consider merging this page with Tutorials into a single "Help Center"

---

### Pickup Address -- /pickup-address
**Current score: 7.5/10**

**What works:**
- Map placeholder with grid pattern and pin is creative for a demo
- Inline editing for address and instructions is well-implemented
- Copy-to-clipboard with feedback is a nice touch
- Informational banner about pickup hours linking to Operations

**What's broken or ugly:**
- The map area (lines 26-71) does not use a real map. For a production app, Google Maps or Mapbox is essential. For a demo, the placeholder is acceptable but should say "Map integration coming soon."
- `glow-red` on the pin (line 49). Unnecessary for a placeholder.

**What a VP of Design at Stripe would flag:**
- No accent-line on this page. Good.
- The address card has a "Primary" pill (line 77) suggesting multiple addresses, but there is no way to add a secondary address.
- No validation on the address field. A chef could save an empty address.

**Specific fixes needed:**
1. Add address validation or at minimum a non-empty check
2. If multiple addresses are supported, add an "Add address" button. If not, remove the "Primary" pill.

---

### Packaging -- /packaging
**Current score: 6.5/10**

**What works:**
- Product grid with placeholder images is clear
- "Shop Now" external links are correctly styled as ghost buttons
- Branded packaging CTA sticker card is engaging

**What's broken or ugly:**
- No heading `<h1>` tag -- uses `<div className="heading-lg">` (line 46). This hurts SEO and accessibility.
- All "Shop Now" links go to `#` (line 83). Dead links.
- The placeholder images (`.placeholder-img`, line 67) are the same striped pattern for all 4 products. No visual distinction.
- `btn-gradient` on "Request Branded Packaging" (line 100). This is a secondary action at best -- should be `btn-dark`.
- The `grain` class on the CTA sticker card (line 93) is invisible.

**What a VP of Design at Stripe would flag:**
- The prices ($18.99, $14.99, etc.) look like product prices but there is no "Add to cart" flow. Are these external affiliate links? The UX is ambiguous.
- No filtering, sorting, or categories for the products.
- The "Request Branded Packaging" button shows "Request Sent" for 3 seconds then resets. There is no actual state persistence.

**Specific fixes needed:**
1. Use `<h1>` for the page heading
2. Wire up "Shop Now" links to actual vendor pages or remove them
3. Downgrade "Request Branded Packaging" from btn-gradient to btn-dark
4. Use different placeholder patterns or descriptions per product

---

### Store Preview -- /store-preview
**Current score: 8/10**

**What works:**
- The banner-to-hero-dark transition is beautifully executed
- Chef avatar overlapping the banner is an Airbnb-quality touch
- Quick info pills (Delivery, Pickup, 24h notice) are immediately useful
- Dish cards with photo overlay and "Add" button look like a real storefront
- "Powered by Yalla Bites" footer is professional
- Preview Mode badge warns the chef this is not the live view

**What's broken or ugly:**
- The `grain` class on the banner (line 58) is the only place where grain might actually be visible, but the image covers it entirely.
- The back button goes to `/dashboard` (line 79). It should go back to the previous page (history.back()).
- The "Add" buttons on dish cards (line 228) have `onClick={(e) => e.preventDefault()}` -- they do nothing. This is expected for a preview, but there should be a tooltip or visual indicator that these are disabled in preview mode.
- Content starts at "Popular Dishes" with `marginTop: 32` (line 162) but there is no "About" section between the hero and the dishes. A chef's bio should be visible here.
- The negative margin hack on line 48 (`margin: "-16px auto"`) is fragile.

**What a VP of Design at Stripe would flag:**
- The dish cards use `btn-gradient` for the "Add" button (line 229). This is a different variant from the full-width gradient buttons used elsewhere. Inconsistent styling.
- Only 5 dishes shown. Should match whatever is in the chef's actual menu.
- No reviews section on the store preview. Customers see reviews -- the chef should see what they look like.

**Specific fixes needed:**
1. Add an "About" section between the hero and the dishes
2. Use `router.back()` instead of hardcoded `/dashboard` for the back button
3. Add a tooltip on disabled "Add" buttons: "Preview only"
4. Add a reviews preview section

---

### Integrations -- /integrations
**Current score: 7/10**

**What works:**
- Status banner warning about phone-only notifications is proactive
- Square POS connection with toggle is clean
- Notification channels with "Send test" functionality
- Test order button with loading/success states is well-animated
- Connected vs. not-connected visual states are distinct

**What's broken or ugly:**
- No page heading. The page starts with the status banner. Add an `<h1>`.
- The "Edit" and "Set up" buttons on notification channels (line 154) have no handlers. Dead buttons.
- Webhook channel (line 28) shows "Send order data to your own endpoint" but there is no way to configure the endpoint URL.
- The Square POS toggle (line 104-108) simply toggles a boolean with no actual connection flow.

**What a VP of Design at Stripe would flag:**
- No accent-line on this page. Good.
- `btn-gradient` on "Send test order" (line 167). This should be `btn-dark` -- the test button is not the primary action on this page. The primary action is connecting channels.
- The test order feature is great but there is no indication of WHERE the test was sent.

**Specific fixes needed:**
1. Add a page heading
2. Wire up Edit/Set up buttons
3. Downgrade "Send test order" from btn-gradient to btn-dark
4. Show where the test was sent in the success state

---

### Sidebar -- sidebar.tsx
**Current score: 8/10**

**What works:**
- Grouped navigation with eyebrow labels is clear
- Active state with red left border is distinctive
- Collapsible sidebar with smooth animation
- Chef avatar card at the bottom with "View My Store" link
- Order count badge on the Orders link
- "New" badges on Bundles, Packaging, Tutorials

**What's broken or ugly:**
- The collapse toggle button (lines 275-302) has duplicate border styles (both `border: "none"` and individual border-top properties). This is a CSS conflict.
- When collapsed, the logo still renders at full size (`height: 28`). In collapsed mode, this should be a smaller icon or hidden.
- The hover state uses inline JavaScript event handlers (lines 173-185). These should be CSS `:hover` selectors.
- No tooltip on collapsed icons (line 150 has `title={collapsed ? item.label : undefined}` but titles are not good tooltips on mobile).

**What a VP of Design at Stripe would flag:**
- Navigation groups are well-organized but "Operations" has only 2 items (Address Management, Buy Packaging). This group feels thin. Consider merging with another group.
- The "Store Preview" link is buried in the sidebar footer but is one of the most important actions. Consider promoting it.

**Specific fixes needed:**
1. Fix the border conflict on the collapse button
2. Use a smaller logo mark in collapsed mode
3. Move hover states to CSS

---

### Top Bar -- top-bar.tsx
**Current score: 7.5/10**

**What works:**
- Breadcrumb navigation on desktop is clear
- Mobile: hamburger + centered title + actions is a proven pattern
- Cmd+K search pill is a power-user touch
- Bell icon with red notification dot

**What's broken or ugly:**
- The Cmd+K search pill (lines 114-139) has no handler. Dead button.
- The hamburger menu button (lines 24-38) has `onMobileMenuToggle` prop but in the layout it is not wired up (no prop passed, line 157 in layout.tsx). The hamburger does nothing.
- The bell icon links to `/orders` (line 142). It should open a notification panel, not navigate to orders.
- The avatar links to `/settings` (line 175). Arguably it should link to `/profile` since that is where the photo comes from.

**What a VP of Design at Stripe would flag:**
- The top bar height is 52px (line 19). This is fine for desktop but on mobile the top bar + bottom tab bar consume 108px of screen real estate. On a 375px-wide phone, that is significant.
- No page title context on desktop when breadcrumbs are not provided.

**Specific fixes needed:**
1. Wire up the hamburger menu to open a mobile sidebar/sheet
2. Wire up the Cmd+K search
3. Consider a notification panel instead of routing the bell to /orders

---

### Bottom Tab Bar -- bottom-tab-bar.tsx
**Current score: 7.5/10**

**What works:**
- 5 tabs with icons, labels, and active indicator dot
- Order badge count (red circle with "2")
- Safe area inset padding for iPhone

**What's broken or ugly:**
- Active state detection uses `activePath === tab.href` (line 37) which means sub-routes are not matched. If you are on `/orders/a8f2c1`, the Orders tab will NOT appear active.
- The "More" tab goes to `/settings` (line 22). It should open a bottom sheet with links to all the items not in the tab bar (Reviews, Bundles, Sections, Payments, etc.).
- Only 5 of 15+ portal pages are accessible from the tab bar. A chef on mobile has no way to reach Bundles, Sections, Reviews, Packaging, Tutorials, Portal Guide, Integrations, or Operations without discovering the hamburger menu (which is broken).

**What a VP of Design at Stripe would flag:**
- The "More" icon is `MoreHorizontal` (three dots). This is not a standard mobile pattern. Use a proper "hamburger" or "grid" icon.
- Icon sizes are 20px which is good, but the labels are 10px (line 80). This is very small and hard to read.

**Specific fixes needed:**
1. Fix active state matching to use `startsWith` instead of exact match
2. Make "More" open a full menu/bottom sheet
3. Increase tab label font size to 11px minimum

---

### Portal Layout -- layout.tsx
**Current score: 7/10**

**What works:**
- Clean layout structure: sidebar + (topbar + main) + bottom tab bar
- Route-to-config mapping for breadcrumbs and titles
- Proper sticky sidebar and main content area

**What's broken or ugly:**
- `onMobileMenuToggle` is not passed to TopBar (line 157). The hamburger menu is non-functional.
- The `<style>` tag on line 164 uses an inline media query to override padding. This should be in the CSS system.
- Bottom padding of `pb-20 lg:pb-0` (line 169) accounts for the bottom tab bar, but the Create Dish page has its own fixed bottom bar which causes double padding.
- The route map does not include an entry for `integrations` -- wait, it does (line 126). But `operations` (line 113) and `store-preview` (line 119) are both present. Good.

**What a VP of Design at Stripe would flag:**
- The main content padding is 20px on mobile and 32px on desktop (lines 162-167). This is good breathing room but should be a CSS variable for consistency.
- No error boundary or loading state at the layout level.

**Specific fixes needed:**
1. Wire up the mobile menu toggle
2. Move the inline media query to globals.css
3. Add a layout-level error boundary

---

### Global CSS -- globals.css
**Current score: 9/10**

**What works:**
- This is genuinely excellent work. The design token system, the warm palette, the Stripe-inspired shadows, the spring animations -- this is professional-grade.
- The 3-tier shadow system (card, card-2, sticker) is perfectly calibrated.
- The button system with state variants (red, amber, sage, terracotta, ghost, dark, gradient) is comprehensive.
- The toggle component with snap animation is satisfying.
- The `section-stack` utility with consistent 24px gaps is the backbone of good vertical rhythm.
- The `content-narrow/default/wide` width system creates proper reading widths.
- The `receipt-row` pattern with dotted connector is a beautiful detail.
- Focus states with orange ring are visible and brand-appropriate.
- Reduced motion media query is present.
- Custom scrollbar styling is subtle.

**What's broken or ugly:**
- The `.grain::after` pseudo-element (lines 599-608) uses an inline SVG data URI for the noise texture. This is creative but the `opacity: 0.5` combined with `mix-blend-mode: multiply` makes it nearly invisible on light backgrounds. Either increase opacity or remove the effect.
- `.blob` class (line 431) has `animation: drift 18s` which is extremely slow. On fast page transitions, users would never see the animation complete.
- The `.btn::after` pseudo-element (lines 261-265) adds a gradient overlay to ALL buttons. This is only visible on dark buttons and is unnecessary on ghost/transparent buttons.

**What a VP of Design at Stripe would flag:**
- The accent-line styles (lines 511-517) are defined but there is no guidance on when to use them. The design system enables overuse.
- No dark mode tokens despite the `@custom-variant dark` declaration (line 5).
- The `.card` class uses `padding: 24px` (line 224) but mobile overrides it to `16px` (line 481). This works but means every card needs to account for potentially different padding.
- Consider adding a `.section-heading` composite class to replace the recurring pattern of `heading + accent-line + body-sm subtitle`.

**Specific fixes needed:**
1. Increase grain opacity or remove the effect
2. Add a comment in the CSS documenting when accent-line should and should not be used
3. Consider adding a section-heading composite utility

---

## Overuse Scorecard

| Effect | Current Usage | Recommended | Action |
|--------|--------------|-------------|--------|
| `.accent-line` | 14+ pages | 3-4 pages (Login, Dashboard, Reviews) | Remove from Bundles, Sections, Menu, Tutorials, Settings, Payments, all wizard sidebars |
| `.btn-gradient` | 12+ instances | 1 per page max, primary CTA only | Downgrade secondary actions to btn-dark |
| `.text-gradient` | 6+ instances | 2-3 in entire app | Keep: Login headline, Dashboard stat. Remove: Reviews rating, Tutorials links, Payments earnings |
| `.glow-*` | 8+ instances | 3-4 key moments | Keep: Operations live status, Welcome celebration. Remove: Settings avatar, packaging pin |
| `.grain` | 4 instances | 1 (Login page only) | Remove from store preview, dashboard sticker, packaging CTA |

---

## Dead Buttons & Links Inventory

These are elements that look interactive but do nothing:

| Page | Element | Line | Issue |
|------|---------|------|-------|
| Login | "Forgot password?" | 191 | No onClick |
| Dashboard | "Need help?" link | 742 | Links to `/help` (does not exist) |
| Menu | 3-dot menu on dish cards | 524 | No dropdown/actions |
| Menu | "From Template" modal option | 257 | Same destination as "From Scratch" |
| Menu/New | Upload zones | 529-584 | No file input |
| Menu/New | "Add Group" button | 851 | No onClick |
| Bundles | All card links | 204 | Go to /menu/new instead of bundle editor |
| Sections | "Create Section" button | 36 | No onClick |
| Sections | 3-dot menu | 95 | No dropdown |
| Sections | Drag handles | 64 | No drag-and-drop |
| Profile | Save button | 99 | No handler |
| Profile | Discard button | 98 | No handler |
| Settings | Change photo | 53 | No handler |
| Settings | 2FA "Set up" | 228 | No handler |
| Tutorials | All 8 tutorial cards | 120 | Link to `#` |
| Portal Guide | Video placeholder | 53 | No video/handler |
| Portal Guide | "View Full Playbook PDF" | 118 | No handler |
| Packaging | All "Shop Now" links | 83 | Link to `#` |
| Integrations | Edit/Set up buttons | 154 | No handler |
| Top Bar | Cmd+K search | 114 | No handler |
| Top Bar | Hamburger menu | 24 | Not wired up |

**Total: 20+ dead interactive elements.** This is the single biggest trust-killer in the portal.

---

## The Billion-Dollar Test

### Does this page make me trust this platform with my business?
**7/10.** The visual design says "real business." The dead buttons say "prototype." The gap between the two is the problem.

### Would a non-technical chef understand this instantly?
**8/10.** The dashboard onboarding flow is genuinely excellent. The stat cards are clear. The order management is intuitive. But the 20+ dead buttons would create confusion about what works and what does not.

### Does it feel like Stripe/Airbnb or a hackathon project?
**7.5/10.** The design system is Stripe-tier. The CSS is beautifully crafted. But the implementation is hackathon-speed. It is a gorgeous car with no engine in half the features.

---

## Priority Fix List (Ranked)

### P0 -- Must fix before any demo
1. Wire up the hamburger menu on mobile (layout.tsx line 157)
2. Fix bottom tab bar "More" to show full navigation
3. Fix the 10 highest-traffic dead buttons (Save/Discard on Profile, Create Section, 3-dot menus, tutorial links)
4. Fix dish card links on Menu page to go to edit not create

### P1 -- Fix before investor/chef demo
5. Remove accent-line from all pages except Login, Dashboard, and Reviews
6. Downgrade btn-gradient to btn-dark on secondary actions
7. Remove text-gradient from Tutorials page
8. Wire up the search (Cmd+K or at minimum the filter inputs)
9. Fix the hardcoded order detail page
10. Fix Jordan L.'s 1-star rating to match the positive review text

### P2 -- Polish round
11. Remove grain from all pages except Login
12. Remove unnecessary glow effects
13. Add loading states to CTA buttons
14. Add confirmation dialogs for destructive actions (toggle store off, discard, cancel order)
15. Fix mobile navigation gaps (sub-route active states)

### P3 -- Before launch
16. Component-ify repeated patterns (filter bars, search inputs, wizard sidebars)
17. Move inline styles to CSS classes or Tailwind utilities
18. Add proper form validation across all forms
19. Add error boundaries and loading skeletons
20. Implement proper data fetching (even if mocked with a delay)

---

*End of audit. The foundation is strong. The CSS system is world-class. The product thinking on the dashboard is excellent. But every dead button chips away at the chef's trust. Fix the trust-killers first, then polish.*
