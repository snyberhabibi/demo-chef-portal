# Final Fix Plan — Chef Portal to 9.5/10

**Based on:** UI/UX audit (6.8/10), design brief, superdesign system, brand bible, Stripe/Airbnb research
**Decision-maker:** Yusuf delegated design authority to Claude for this pass
**Goal:** Every page bulletproof. Every button works. Every effect earns its place.

---

## PHASE 1: Trust Killers (P0) — Kill every dead button

### 1.1 Mobile Navigation (THE #1 bug)
- **Hamburger menu**: Wire up in layout.tsx → opens a full-screen drawer overlay with ALL nav items (matching sidebar groups)
- **"More" tab**: Opens the same drawer (not /settings)
- **Bottom tab active state**: Use `startsWith()` not exact match — /orders/abc123 should highlight Orders tab
- **Tab labels**: Bump from 10px to 11px

### 1.2 Dead Buttons — Wire up ALL 20+
Every dead button gets ONE of these treatments:
- **Navigate somewhere** (Link/router.push)
- **Show a toast** ("Coming soon — this feature is in development")
- **Open a confirmation dialog**
- **Toggle state visually**

Specific assignments:
| Button | Fix |
|--------|-----|
| Login "Forgot password?" | Toast: "Check your email for a reset link" |
| Dashboard "Need help?" | Link to /tutorials (not /help) |
| Menu 3-dot menus | Open a dropdown with Edit/Archive/Delete — Edit links to /menu/new, others show toast |
| Menu "From Template" | Toast: "Templates coming soon" |
| Menu/New upload zones | Add a hidden file input that opens the file picker (even if it doesn't upload) |
| Menu/New "Add Group" | Toast: "Customization groups coming soon" |
| Bundles cards | Link to /bundles (stay on page) instead of /menu/new |
| Sections "Create Section" | Toast: "Section created!" (add a mock section to state) |
| Sections 3-dot menu | Open dropdown with Rename/Delete — both show toasts |
| Sections drag handles | Remove drag handles AND "Drag to reorder" text — replace with sort order numbers |
| Profile Save/Discard | Save: toast "Profile saved". Discard: confirm dialog then navigate to /dashboard |
| Settings "Change photo" | Open a file picker |
| Settings "Set up 2FA" | Toast: "Two-factor authentication coming soon" |
| Tutorials ALL 8 links | Link to /tutorials (stay on page) + toast "Tutorial: [name] — interactive tutorials coming soon" |
| Portal Guide video | Toast: "Video playback coming soon" |
| Portal Guide PDF | Toast: "PDF download coming soon" |
| Packaging "Shop Now" | Use real external URLs (webstaurantstore.com links from the real portal audit) |
| Integrations Edit/Setup | Toast: "Channel configuration coming soon" |
| Top Bar Cmd+K | Toast: "Search coming soon" |
| Top Bar hamburger | Wire to mobile drawer (see 1.1) |

### 1.3 Menu card links
- Dish cards → link to /menu/new (acceptable for prototype — it's the closest edit experience)
- BUT add toast: "Editing: [dish name]" when clicked

---

## PHASE 2: Effect Discipline — Earn every gradient

### 2.1 Remove accent-line from:
- Welcome page
- Orders page (after filter tabs)
- Menu page (after heading AND after filters — both)
- Bundles page
- Sections page
- Tutorials page
- Settings page (danger zone)
- Payments page
- Menu/New sidebar steps
- Profile sidebar steps
- Dashboard "RECENT ORDERS" section

### 2.2 KEEP accent-line ONLY on:
- Login page (under headline) — editorial moment
- Dashboard Mode A (under phase headers) — onboarding emphasis
- Reviews page (after tabs) — section separator

### 2.3 Downgrade btn-gradient to btn-dark:
- Menu/New "Save Dish" → btn-dark
- Profile "Continue" → btn-dark  
- Reviews "Post Reply" → btn-dark btn-sm
- Portal Guide "View Full Playbook" → btn-dark
- Packaging "Request Branded Packaging" → btn-dark
- Integrations "Send test order" → btn-dark
- Store Preview "Add" buttons → btn-sm btn-dark

### 2.4 KEEP btn-gradient ONLY for:
- Login "Send me a login link" — THE primary action
- Welcome "Let's go" — THE onboarding CTA
- Dashboard "Create Dish" quick action — THE primary business action
- Order detail sticky bar CTA — THE urgent action
- Payments "Connect with Stripe" — THE money action

### 2.5 Remove text-gradient from:
- Tutorials "Start" links (ALL 8) → use simple red text
- Payments earnings number → use plain fraunces
- Reviews "4.0" rating → use plain fraunces

### 2.6 KEEP text-gradient ONLY on:
- Login "your kitchen" in headline — editorial moment

### 2.7 Remove glow effects from:
- Settings avatar (glow-orange) — looks like an error
- Pickup address pin (glow-red) — unnecessary
- Packaging CTA card (grain) — invisible

### 2.8 Remove grain from:
- Dashboard motivational sticker
- Store Preview banner (image covers it)
- Packaging CTA card
- KEEP only on Login page

---

## PHASE 3: Data & Content Fixes

### 3.1 Reviews
- Fix Jordan L. rating: change from 1★ to 5★ (matches positive review text)
- Default ALL reply composers to closed (Priya R. should not be open by default)
- Implement actual sort logic (Newest/Oldest/Highest/Lowest reorder the reviews array)
- Add click-outside-to-close on sort dropdown

### 3.2 Order Detail
- Bottom bar action button: use state-specific colors (btn-red for Confirm, btn-amber for Prep, btn-sage for Ready) NOT btn-gradient
- Add confirmation dialog for "Cancel this order" (bottom sheet on mobile)

### 3.3 Dashboard Mode B
- Recent order rows: link to /orders/[id] using actual order hash
- Fix "/help" dead link → /tutorials

### 3.4 Menu
- Use distinct images for all 11 dishes (no duplicates)
- Remove pagination (only 11 items, single page)

### 3.5 Profile
- Step 5 "Continue" button: change from disabled to "Finish" that navigates to /dashboard with a celebration toast
- Step 5 schedule: add text "Manage your hours on the Operations page →" with link

### 3.6 Operations
- Label demo state buttons clearly: add "Demo:" prefix and muted styling
- Add 15-minute interval time options

### 3.7 Payments
- Label demo state buttons clearly
- Wire "Stripe Dashboard" link to show a toast

### 3.8 Store Preview
- Back button: use router.back() not hardcoded /dashboard
- Add chef bio/about section between hero and dishes
- Disable "Add" buttons visually with tooltip "Preview only"

---

## PHASE 4: Responsive & Mobile Polish

### 4.1 Mobile Drawer Navigation
Create a proper full-screen mobile drawer component:
- Dark backdrop (rgba(51,31,46,0.4) + blur)
- White drawer sliding from left (280px wide)
- Same nav groups as sidebar
- Chef card at bottom
- Close on backdrop click or X button
- Close on navigation

### 4.2 Bottom Tab Active States
- Use `pathname.startsWith(tab.href)` for matching
- /orders/abc123 → Orders tab active
- /menu/new → Menu tab active

### 4.3 Menu/New Wizard Mobile
- Fix double bottom bar conflict (wizard nav + portal tab bar)
- Hide portal tab bar when on /menu/new and /profile (wizard pages)

### 4.4 Content Width Consistency
Verify every page uses the right width class:
- Forms: content-narrow (640px)
- Lists/grids: content-wide (1200px) or content-default (960px)
- Settings/Operations: content-narrow (640px)

---

## PHASE 5: Component Quality

### 5.1 Semantic HTML
- Every page must have exactly ONE h1
- Fix Welcome page: merge two h1s into one with styled span
- Fix Packaging page: use h1 not div for heading
- Fix Integrations page: add h1

### 5.2 Sort Dropdown
- Reviews: implement actual sort
- Reviews: add click-outside-to-close
- Make it a reusable pattern

### 5.3 Form Inputs
- Settings name: use controlled input (value + onChange) not defaultValue
- Profile: basic validation (business name required)

---

## Implementation Strategy — 3 Agents

### Agent 1: Trust & Navigation
- Mobile drawer component (new file)
- Wire up ALL dead buttons (use toast for "coming soon" features)
- Fix bottom tab active states
- Fix Menu card links
- Fix dashboard /help dead link
- Wire hamburger menu
- Fix "More" tab

### Agent 2: Effect Cleanup & Data Fixes
- Remove accent-line from 11 pages (keep on 3)
- Downgrade btn-gradient on 7 pages (keep on 5)
- Remove text-gradient from 3 pages (keep on 1)
- Remove glow/grain where noted
- Fix Reviews data (Jordan rating, composer state, sort)
- Fix Order detail bottom bar colors
- Fix Menu duplicate images
- Fix Profile step 5 finish action
- Fix Store Preview back button and bio section

### Agent 3: Polish & Semantics
- Fix all semantic HTML (h1 per page)
- Fix Operations/Payments demo labels
- Fix Welcome duplicate h1
- Remove unnecessary pagination
- Fix form inputs (controlled components)
- Add confirmation dialogs (cancel order, store toggle off, profile discard)
- Content width consistency check

---

## Success Criteria — When We're Done

Every page passes:
- [ ] Zero dead buttons — every clickable element does something
- [ ] ONE h1 per page
- [ ] accent-line on max 3 pages
- [ ] btn-gradient on max 5 instances total
- [ ] text-gradient on max 1 instance
- [ ] Mobile drawer works from hamburger AND "More" tab
- [ ] Bottom tab highlights correctly on sub-routes
- [ ] No duplicate images on the same page
- [ ] No demo state buttons visible without clear "Demo:" labels
- [ ] Content centered with appropriate max-width
- [ ] Touch targets 44px+ on mobile
- [ ] Every toast is under 40 characters

**Target score: 9.5/10**
