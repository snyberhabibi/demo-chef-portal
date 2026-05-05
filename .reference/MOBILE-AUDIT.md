# Mobile Audit Report -- Yalla Bites Chef Portal

**Target:** iPhone Safari at 375px  
**Date:** 2026-05-04  
**Auditor:** Claude Opus 4.6  

---

## Table of Contents

1. [Global CSS](#1-global-css)
2. [Portal Layout](#2-portal-layout)
3. [Bottom Tab Bar](#3-bottom-tab-bar)
4. [Top Bar](#4-top-bar)
5. [Mobile Drawer](#5-mobile-drawer)
6. [Dashboard](#6-dashboard)
7. [Orders List](#7-orders-list)
8. [Order Detail](#8-order-detail)
9. [Menu Page](#9-menu-page)
10. [Create Dish (menu/new)](#10-create-dish)
11. [Flash Sales](#11-flash-sales)
12. [Operations](#12-operations)
13. [Reviews](#13-reviews)
14. [Profile](#14-profile)
15. [Payments](#15-payments)
16. [Settings](#16-settings)
17. [Store Preview](#17-store-preview)
18. [Login](#18-login)
19. [Welcome](#19-welcome)

---

## 1. Global CSS

**File:** `src/app/globals.css`

### Issues Found

#### ISSUE G-1: Duplicate mobile media query blocks (conflict risk)
There are TWO mobile breakpoint blocks: `@media (max-width: 640px)` at line 480 and `@media (max-width: 639px)` at line 717. The 640px block applies at exactly 640px but the 639px block does not, creating a 1px gap where card padding is 16px from the first rule but not overridden by the second. Both blocks set `.card` padding and `.btn` sizes with different specificity (the second uses `!important`).

**Severity:** Low -- the 1px gap is unlikely to be hit in practice, but the duplication is fragile.

**Fix:**
```css
/* Remove the first block at line 480-485 entirely. 
   The @media (max-width: 639px) block at line 717 already covers 
   everything with !important and is more comprehensive. */

/* DELETE lines 480-485: */
/* @media (max-width: 640px) {
  .card { padding: 16px; border-radius: 16px; }
  .card-sticker { padding: 20px; border-radius: 16px; }
  .btn { min-height: 44px; font-size: 15px; }
  .btn-sm { min-height: 36px; }
} */
```

#### ISSUE G-2: `.input` font-size in base styles is 15px, not 16px
At line 357, `.input` has `font-size: 15px`. iOS Safari zooms on focus for any input with font-size below 16px. The mobile override at line 758 does set `font-size: 16px !important`, so this is ONLY a problem for inline `style={{ fontSize: 13 }}` or `style={{ fontSize: 12 }}` overrides that many pages apply (see orders search, flash sales inputs, customization builder inputs).

**Severity:** HIGH -- Any input with an inline `fontSize` smaller than 16 will cause iOS zoom.

**Fix:**
```css
/* Line 357: Change base font-size to 16px */
.input, .textarea, .select {
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 1px solid rgba(51,31,46,0.12); background: #fff;
  color: var(--color-brown); font-size: 16px; line-height: 1.5;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}
```

#### ISSUE G-3: `.toggle` touch target is only 44x24
The toggle switch is 44px wide but only 24px tall. Apple HIG recommends 44x44 minimum touch targets.

**Severity:** Medium

**Fix:**
```css
/* Add padding around toggle for larger hit area */
.toggle {
  width: 44px; height: 24px; background: #c4b8bf;
  border-radius: 12px; position: relative; cursor: pointer;
  flex-shrink: 0; transition: background var(--t-fast) var(--ease-spring);
  border: none; padding: 0;
  /* Expand touch target */
  min-height: 44px;
  display: flex;
  align-items: center;
}
.toggle-thumb {
  position: absolute; top: 50%; margin-top: -10px; left: 2px;
  width: 20px; height: 20px;
  background: #fff; border-radius: 50%;
  transition: transform var(--t-fast) var(--ease-spring);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.08);
}
```

### No Issues
- `overflow-x: hidden` on html/body/main prevents horizontal scroll -- GOOD
- `input, textarea, select { font-size: 16px; }` in base layer -- GOOD
- `-webkit-text-size-adjust: 100%` present -- GOOD
- Reduced motion media query present -- GOOD
- `.bottom-sheet` has safe-area padding -- GOOD

---

## 2. Portal Layout

**File:** `src/app/(portal)/layout.tsx`

### Issues Found

#### ISSUE L-1: Main padding is 16px on mobile -- adequate but tight
The `main` element uses `style={{ padding: "16px" }}` as default, which is fine for 375px.

**Severity:** None -- this is acceptable.

#### ISSUE L-2: Bottom tab clearance uses `pb-24` (96px) -- correct
The `<div className="pb-24 lg:pb-0">` provides 96px of bottom padding on mobile to clear the 56px tab bar + safe area. This is correct.

### No Issues
- Sidebar is hidden on mobile via its own responsive logic -- GOOD
- MobileDrawer is conditionally rendered -- GOOD
- The inline `<style>` for responsive padding works correctly -- GOOD

---

## 3. Bottom Tab Bar

**File:** `src/components/layout/bottom-tab-bar.tsx`

### Issues Found

#### ISSUE BT-1: Total height with safe area may be insufficient
The bar is `height: 56` with `paddingBottom: env(safe-area-inset-bottom)`. On iPhone with home indicator, this adds ~34px, making total height ~90px. The pb-24 (96px) in the layout covers this.

**Severity:** None -- math checks out.

#### ISSUE BT-2: Tab touch targets are narrow
Each tab uses `flex: 1` which at 375px width / 5 tabs = 75px wide. The minHeight is 44px. However, the actual tappable area is the full `<Link>` element which fills the space. This is acceptable.

#### ISSUE BT-3: Badge font-size 9px is very small
The badge on the Orders tab uses `fontSize: 9` which may be hard to read.

**Severity:** Low -- it is a badge count, not critical text.

### No Issues
- z-index 50 -- appropriate, won't conflict with drawer (z-61) -- GOOD
- `lg:hidden` hides on desktop -- GOOD
- Safe area inset applied -- GOOD

---

## 4. Top Bar

**File:** `src/components/layout/top-bar.tsx`

### Issues Found

#### ISSUE TB-1: Hamburger button is 40x40, below 44px minimum
The hamburger button is `width: 40, height: 40`. Apple HIG recommends 44px minimum.

**Severity:** Medium

**Fix:**
```tsx
// Change width and height to 44
style={{
  width: 44,
  height: 44,
  ...
}}
```

#### ISSUE TB-2: Bell icon touch target is 36x36 -- below 44px
The notification bell link is `width: 36, height: 36`.

**Severity:** Medium

**Fix:**
```tsx
// Change to 44x44
style={{
  width: 44,
  height: 44,
  ...
}}
```

#### ISSUE TB-3: Avatar is 28x28 -- too small for a tap target
The profile avatar link is only 28x28.

**Severity:** Medium -- this links to the profile page, so it should be tappable.

**Fix:**
```tsx
// Wrap in a larger touch area or increase size
<Link
  href="/profile"
  className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
  style={{ width: 44, height: 44 }}
>
  <img
    src="..."
    alt="Profile"
    className="rounded-full object-cover"
    style={{ width: 28, height: 28 }}
  />
</Link>
```

### No Issues
- Header height 52px is appropriate -- GOOD
- z-index 30 -- below bottom tab bar (50), appropriate -- GOOD
- Glass effect with backdrop-filter -- GOOD
- Title is centered on mobile with truncation -- GOOD

---

## 5. Mobile Drawer

**File:** `src/components/layout/mobile-drawer.tsx`

### Issues Found

#### ISSUE MD-1: Drawer width is fixed 280px -- could overflow on very narrow screens
At 280px, on a 375px screen this leaves 95px for the backdrop visible area, which is fine for close-by-tap-outside. No issue.

#### ISSUE MD-2: Close button is 36x36 -- below 44px
The close button at top-right is `width: 36, height: 36`.

**Severity:** Medium

**Fix:**
```tsx
style={{
  width: 44,
  height: 44,
  ...
}}
```

#### ISSUE MD-3: Nav link height is 40px -- below 44px touch target
Each navigation link is `height: 40`.

**Severity:** Medium

**Fix:**
```tsx
style={{
  height: 44,
  ...
}}
```

### No Issues
- z-index 61 for drawer, 60 for backdrop -- correctly above bottom tab (50) -- GOOD
- Backdrop click closes drawer -- GOOD
- `overflowY: "auto"` on drawer -- GOOD for scrolling on small screens
- Animation is smooth slide-in -- GOOD

---

## 6. Dashboard

**File:** `src/app/(portal)/dashboard/page.tsx`

### Issues Found

#### ISSUE D-1: Mode toggle buttons lack min-height 44px
The "Setup" / "Dashboard" toggle buttons have `padding: "6px 16px"` and no explicit height. At font-size 13px + padding, total height is roughly 33px -- below 44px minimum.

**Severity:** Medium

**Fix:**
```tsx
style={{
  padding: "6px 16px",
  fontSize: 13,
  fontWeight: 600,
  minHeight: 44,
  ...
}}
```

#### ISSUE D-2: Search bar input font-size is 14px -- will cause iOS zoom
The search input at line 686 has `fontSize: 14` inline. This overrides the mobile CSS rule and will trigger iOS Safari zoom on focus.

**Severity:** HIGH

**Fix:**
```tsx
style={{
  fontSize: 16, // prevent iOS zoom
  ...
}}
```

#### ISSUE D-3: Order card row 1 could overflow at 375px
The order row packs: status dot (8px) + customer name (flex) + ready-by time + price + chevron. At 375px minus 16px padding on each side = 343px of content width. With a long "Ready 6:30 PM" label (~90px) + price (~$49.00 = 50px) + chevron (14px), the name truncates correctly via `overflow: hidden; textOverflow: ellipsis; whiteSpace: nowrap`. This is acceptable.

#### ISSUE D-4: Stat cards -- 2-column grid at 375px works
`grid-cols-2` at 375px gives each card ~160px. Card padding on mobile is 16px (from CSS override). The `clamp(24px, 5vw, 32px)` for the value at 375px = ~18.75px (clamped to 24px). This works.

### No Issues
- Flash sale cards have `minWidth: 280` in horizontal scroll -- fits 375px with 16px padding = 343px usable, so cards will scroll horizontally as intended -- GOOD
- `overflowX: auto` on flash sales container -- GOOD
- Skeleton loading responsive -- GOOD

---

## 7. Orders List

**File:** `src/app/(portal)/orders/page.tsx`

### Issues Found

#### ISSUE O-1: Mobile search input font-size is 13px -- causes iOS zoom
The mobile search at line 540 has `fontSize: 13`. This will cause iOS Safari to zoom when the input is focused.

**Severity:** HIGH

**Fix:**
```tsx
style={{
  fontSize: 16, // prevent iOS zoom
  ...
}}
```

#### ISSUE O-2: Filter tabs could overflow without scrollbar indication
The filter tabs container uses `overflowX: auto` with `scrollbarWidth: none`. Users may not know to scroll. However, the tabs fit within 375px at 11px font size with 7 standard tabs, so overflow is unlikely unless "Prep List" pushes it over.

**Severity:** Low

#### ISSUE O-3: Action buttons in order cards ("Confirm ->") are `btn-sm` (36px height) -- this is acceptable for inline actions, but the click target includes the role="button" span which has `minWidth: 80`.

**Severity:** None -- 80x36 is adequate for an inline action.

#### ISSUE O-4: Pagination buttons are 28x28 -- below 44px
The page number buttons are `width: 28, height: 28`.

**Severity:** Medium

**Fix:**
```tsx
style={{
  width: 36,
  height: 36,
  ...
}}
```

#### ISSUE O-5: Rows-per-page select has `minHeight: 28` -- below 44px
**Severity:** Low -- this is a secondary control.

### No Issues
- Mobile search is full-width below tabs -- GOOD
- Order cards are full-width stacked -- GOOD
- Expandable sections use max-height transition -- GOOD
- Text sizes are readable -- GOOD

---

## 8. Order Detail

**File:** `src/app/(portal)/orders/[id]/page.tsx`

### Issues Found

#### ISSUE OD-1: Sticky bottom bar position at `bottom: 56px` on mobile
The CSS at line 838 correctly positions the action bar at `bottom: 56px` on `max-width: 1023px` to sit above the bottom tab bar. However, this does not account for `env(safe-area-inset-bottom)`.

**Severity:** HIGH -- On iPhone with home indicator, the sticky bar will be partially hidden behind the safe area.

**Fix:**
```css
@media (max-width: 1023px) {
  .order-sticky-bar {
    bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important;
  }
}
```

#### ISSUE OD-2: Stepper circles are 22px on mobile (via `w-[22px] h-[22px]`)
At 375px, 4 stepper circles + 3 connector lines must fit. 22px circles + labels work, but the labels at `text-[10px]` are 10px -- which is quite small but readable.

**Severity:** Low

#### ISSUE OD-3: 2-column layout correctly collapses to single column
The `order-detail-cols` defaults to `flexDirection: "column"` and only uses grid at `min-width: 1024px`. This is correct.

#### ISSUE OD-4: Back button is 36x36 -- below 44px
The back arrow link is `width: 36, minWidth: 36, height: 36, minHeight: 36`.

**Severity:** Medium

**Fix:**
```tsx
style={{ width: 44, minWidth: 44, height: 44, minHeight: 44, borderRadius: 10 }}
```

#### ISSUE OD-5: Phone/email action buttons at 36x36 on mobile (`w-9 h-9`)
The `w-9 h-9` = 36px. These are adequate since they are spaced apart.

**Severity:** Low

#### ISSUE OD-6: `paddingBottom: 100` on the container plus `pb-24` from layout = 196px bottom space
This is excessive but not broken. The sticky bar covers the bottom content correctly.

### No Issues
- ETA card uses clamp for font size -- GOOD
- Receipt rows are readable at 375px -- GOOD
- Cancel confirmation flows correctly -- GOOD

---

## 9. Menu Page

**File:** `src/app/(portal)/menu/page.tsx`

### Issues Found

#### ISSUE M-1: Search input font-size is 14px -- causes iOS zoom
Line 590: `fontSize: 14` on the search input.

**Severity:** HIGH

**Fix:**
```tsx
fontSize: 16, // prevent iOS zoom
```

#### ISSUE M-2: Dish grid uses `minmax(200px, 1fr)` which fits well at 375px
At 375px - 32px padding = 343px. A `minmax(200px, 1fr)` grid would collapse to 1 column. But there is padding from `.card` (16px on mobile) plus the content-wide wrapper. Actually, with 16px page padding on each side, available width = 343px. `minmax(200px, 1fr)` = 1 column at 343px. This gives a single-column layout on mobile.

**Severity:** None -- but users lose the 2-column grid on mobile. This is actually a design choice, not a bug.

**NOTE:** If you want 2 columns at 375px, change to:
```css
gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"
```

#### ISSUE M-3: Category pills scroll container lacks scroll hint
The category pills have `overflowX: auto` with a gradient mask (`maskImage`), which is actually a nice UX hint that there is more content. This is good.

#### ISSUE M-4: Status filter pills may overflow on mobile
Four status pills ("All", "Published", "Draft", "Archived") at 375px with 12px padding each. Total width approximately: 4 * ~75px = 300px. With 6px gaps + 32px page padding, this is borderline. The `flex-wrap` on the parent container handles overflow.

**Severity:** Low

#### ISSUE M-5: Three-dot menu button on dish cards is 30x30 -- below 44px
**Severity:** Low -- it is a secondary action.

#### ISSUE M-6: Create modal grid uses `gridTemplateColumns: "1fr 1fr"` -- may be tight
At 375px, modal width is `maxWidth: 480, margin: "0 16px"` = 343px. Two columns at ~160px each with 12px gap is fine.

#### ISSUE M-7: Tab buttons lack min-height 44px
The Dishes/Bundles/Sections tabs at line 441 have `padding: "10px 20px"` with no explicit height. Total height is approximately 38px (14px font + 20px padding). Below 44px.

**Severity:** Medium

**Fix:**
```tsx
style={{
  padding: "10px 20px",
  minHeight: 44,
  ...
}}
```

#### ISSUE M-8: Section rows in Sections tab are 52px (minHeight: 52) -- adequate but the more-menu button is 36x36.

### No Issues
- Bundles search input (fontSize 14) -- same iOS zoom issue as M-1
- Grid collapses properly on narrow screens -- GOOD

---

## 10. Create Dish

**File:** `src/app/(portal)/menu/new/page.tsx`

### Issues Found

#### ISSUE CD-1: 2-column layout uses `gridTemplateColumns: "1fr 240px"` -- no mobile override inline
The CSS override at line 1895 `@media (max-width: 1023px)` correctly collapses to `grid-template-columns: 1fr`. The right sidebar is hidden via `hidden lg:block`. GOOD.

#### ISSUE CD-2: Bottom bar sticky position at `bottom: 56px` does not account for safe area
Same issue as OD-1. The `create-dish-bottom-bar` is fixed at `bottom: 56px`.

**Severity:** HIGH

**Fix:**
```css
@media (max-width: 1023px) {
  .create-dish-bottom-bar {
    bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important;
    ...
  }
}
```

#### ISSUE CD-3: Pricing size rows use horizontal flex layout that overflows on mobile
Each size row has: portion select (flex: 1 1 140px) + size input (flex: 1 1 100px) + price input (width: 100px) + delete button (40px). Total minimum: 140 + 100 + 100 + 40 = 380px. At 375px - 32px padding - 24px card padding = 319px. THIS WILL OVERFLOW.

**Severity:** CRITICAL

**Fix:**
```css
/* Add to globals.css or inline styles */
@media (max-width: 639px) {
  /* Stack size rows vertically on mobile */
  .create-dish-layout .flex.items-center.gap-2 {
    flex-wrap: wrap;
  }
}
```

Better fix -- restructure the size rows on mobile:
```tsx
// In the SizeRow rendering, wrap the row at mobile:
<div
  key={row.id}
  className="flex items-center gap-2 flex-wrap"
  style={{
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(51,31,46,0.08)",
    background: "#fff",
  }}
>
```

Adding `flex-wrap` to the size row container will allow it to wrap. Also set the delete button to auto-position:
```css
@media (max-width: 639px) {
  /* Size row inputs stack */
  .size-row-portion { flex: 1 1 100% !important; }
  .size-row-size { flex: 1 1 calc(50% - 24px) !important; }
  .size-row-price { flex: 0 0 calc(50% - 24px) !important; width: auto !important; }
}
```

#### ISSUE CD-4: Column headers for pricing are invisible/misleading on mobile
The header row at line 711 shows "Portion Label | Size | Price" in a flex row with fixed widths matching the inputs. When inputs wrap, these headers become misaligned.

**Severity:** Medium -- hide on mobile

**Fix:**
```tsx
<div
  className="hidden sm:flex items-center gap-2 eyebrow"
  ...
>
```

#### ISSUE CD-5: Customization builder modifier grid overflows on mobile
The modifier grid uses `gridTemplateColumns: "20px 1fr 100px 32px"` (or `"20px 1fr 100px 70px 32px"` for quantity mode). At 375px - 32px padding - 40px card padding - 40px section padding = ~263px. The grid minimum: 20 + ~100 + 100 + 32 = 252px for non-quantity, barely fits. For quantity mode: 20 + ~70 + 100 + 70 + 32 = 292px -- OVERFLOWS.

**Severity:** HIGH (for quantity selection type)

**Fix:**
```css
@media (max-width: 639px) {
  /* Stack modifier options vertically on mobile */
  .modifier-grid {
    grid-template-columns: 1fr !important;
    gap: 8px !important;
  }
  .modifier-grid > :first-child { display: none; } /* hide grip icon */
}
```

Or better, wrap modifiers in a card-like stacked layout on mobile.

#### ISSUE CD-6: Quantity-specific fields use `flex gap-2` with 3 equal children
Three inputs ("Total Required", "Min Different Options", "Max Different Options") at `flex: 1` each. At ~263px available width, each gets ~83px. With 10px padding each side, that leaves 63px for content. The label text "Max Different Options" will be clipped. The inputs are okay since they are number inputs.

**Severity:** Medium -- labels will truncate

**Fix:**
```css
@media (max-width: 639px) {
  /* Stack quantity fields */
  .quantity-fields {
    flex-direction: column;
  }
}
```

#### ISSUE CD-7: Category grid uses `grid-cols-2 sm:grid-cols-3`
At 375px, this gives 2 columns per row. Each button has `h-[52px] sm:h-[64px]` -- so 52px on mobile. This is above 44px minimum. GOOD.

### No Issues
- SectionCard toggle buttons fill full width -- GOOD
- Description textarea works at full width -- GOOD
- Available days pills wrap with `flex-wrap` -- GOOD

---

## 11. Flash Sales

**File:** `src/app/(portal)/flash-sales/page.tsx`

### Issues Found

#### ISSUE FS-1: Create panel order window uses `grid-cols-2` with date+time inputs
The "Order Window" section at line 792 uses `grid grid-cols-2 gap-3`. Each column has a date input + time input in a flex row. At 375px - 32px page padding - 32px card padding = 311px. Two columns = ~150px each. A date input needs ~120px and a time input needs ~100px. In a flex row with gap-6, this is 226px -- OVERFLOWS within the 150px column.

**Severity:** HIGH -- date/time inputs will be clipped or cause horizontal scroll.

**Fix:**
```tsx
// Change to single column on mobile
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 4 }}>
```

#### ISSUE FS-2: Time inputs use `type="time"` with `style={{ width: 100 }}`
The time inputs in the fulfillment windows at lines 910, 925, etc. have `width: 90` -- these are hardcoded pixel widths that don't adapt.

**Severity:** Medium

**Fix:**
```tsx
style={{ width: "auto", minWidth: 80, flex: "0 0 auto" }}
```

#### ISSUE FS-3: Flash sale item config grid uses `grid-cols-3`
Each added item shows "Flash Price | Qty Limit | Per Customer" in a 3-column grid (line 1226). At narrow width (~311px), each column = ~97px. The inputs have `fontSize: 12, height: 32`. Font size 12 will cause iOS zoom on focus.

**Severity:** HIGH -- iOS zoom on focus

**Fix:**
```tsx
// All inputs in the flash sale creator need fontSize: 16
style={{ fontSize: 16, height: 36 }}
```

#### ISSUE FS-4: "Schedule Flash Sale" button may be clipped on narrow screens
The launch tab actions row uses `flexWrap: "wrap"` which handles overflow. The button itself has `padding: "10px 20px"` -- at narrow width it will wrap below the "Back" button. This is acceptable.

### No Issues
- Tab buttons have adequate touch targets -- GOOD
- Sale cards are full-width -- GOOD
- Action buttons use `btn-sm` (36px min-height) which is acceptable for secondary actions -- GOOD

---

## 12. Operations

**File:** `src/app/(portal)/operations/page.tsx`

### Issues Found

#### ISSUE OP-1: Weekly schedule rows overflow at 375px -- CRITICAL
Each row layout: Day name (width: 80) + toggle (44px) + time windows (flex) + Add button (shrink-0). The time window pills contain two `<select>` elements. At 375px - 32px padding = 343px for content-narrow (which is max-width: 640px, so full width on mobile minus padding). Actual available: 343 - 40px card padding = 303px.

With day name (80px) + gap (12px) + toggle (44px) + gap (12px) + Add button (~60px) = 208px fixed. That leaves 95px for the time windows. A single time select ("10:00 AM") rendered with `fontSize: 13` in a pill with padding needs ~100px minimum. Two selects plus a dash = ~210px. This WILL OVERFLOW.

**Severity:** CRITICAL

**Fix:**
```css
@media (max-width: 639px) {
  /* Stack operations schedule rows */
  .ops-schedule-row {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    padding: 12px 16px !important;
  }
  .ops-schedule-row .day-name {
    width: auto !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100% !important;
  }
  .ops-time-windows {
    width: 100% !important;
    padding-left: 0 !important;
  }
}
```

Alternatively, restructure: put day name + toggle on one line, time windows on the next line full-width:
```tsx
// Each day becomes:
<div style={{ padding: "12px 16px" }}>
  {/* Row 1: Day + toggle + add */}
  <div className="flex items-center justify-between">
    <span>{day}</span>
    <div className="flex items-center gap-2">
      <button className="toggle ...">...</button>
      <button className="btn btn-ghost btn-sm">Add</button>
    </div>
  </div>
  {/* Row 2: Time windows (full width) */}
  {daySchedule.enabled && (
    <div className="flex flex-wrap gap-2 mt-2">
      {/* time pills here */}
    </div>
  )}
</div>
```

#### ISSUE OP-2: Time select dropdowns inside pills have no explicit width
The `<select>` elements inside the time window pills use `padding: 0` and `background: none`. On iOS Safari, the native select picker works, but the rendered text may be clipped.

**Severity:** Low

#### ISSUE OP-3: "Block Today" button may overflow header on narrow screens
The weekly hours header has the title on the left and "Block Today" button on the right. At 375px, both fit.

**Severity:** None

### No Issues
- Store status cards use borderLeft accent -- readable -- GOOD
- Auto-accept toggle row is properly laid out -- GOOD
- Time off and override entries use flex layout with wrapping -- GOOD

---

## 13. Reviews

**File:** `src/app/(portal)/reviews/page.tsx`

### Issues Found

#### ISSUE R-1: Rating summary card layout at 375px
The card uses `flex flex-col sm:flex-row`. On mobile (below 640px), it stacks vertically: rating number on top, distribution bars below. The rating number uses `fontSize: "clamp(32px, 8vw, 48px)"` which at 375px = 30px (clamped to 32px). This works.

**Severity:** None

#### ISSUE R-2: Reply composer textarea font-size is 14px
At line 424, `fontSize: 14` on the textarea will cause iOS zoom.

**Severity:** HIGH

**Fix:**
```tsx
style={{ minHeight: 64, fontSize: 16, ... }}
```

#### ISSUE R-3: Sort dropdown button is `btn btn-ghost btn-sm` (36px)
**Severity:** Low

#### ISSUE R-4: Review text uses `text-[13px] sm:text-[14px]` -- readable at 13px
**Severity:** None

### No Issues
- Tab buttons are adequate size -- GOOD
- Reply buttons are `btn btn-ghost btn-sm` -- acceptable -- GOOD
- Dish/bundle expandable rows have adequate tap area -- GOOD

---

## 14. Profile

**File:** `src/app/(portal)/profile/page.tsx`

### Issues Found

#### ISSUE P-1: Header buttons may overflow on mobile
The header has: title/subtitle on left + "Preview Store" button + "Save" button on right. At 375px, the title + two buttons may not fit in one row. There is no `flex-wrap` on the container.

**Severity:** HIGH -- buttons will be clipped or cause overflow

**Fix:**
```tsx
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
```

#### ISSUE P-2: Profile card uses `alignItems: "center"` with 80px avatar
The card has: 80px avatar + name/tagline. At 375px - 32px padding - 32px card padding = 311px. Avatar (80px) + gap (20px) = 100px, leaving 211px for text. This is fine.

**Severity:** None

#### ISSUE P-3: Cuisine tags wrap correctly with `flexWrap: "wrap"` -- GOOD

#### ISSUE P-4: Bottom save buttons use `justifyContent: "flex-end"` with no wrapping
At very narrow width, the "Discard" + "Save Changes" buttons fit: ~85px + ~130px + 8px gap = ~223px. At 343px available, this fits.

**Severity:** None

### No Issues
- SectionCard components collapse/expand properly -- GOOD
- Input fields are full-width -- GOOD
- Cuisine search dropdown works -- GOOD

---

## 15. Payments

**File:** `src/app/(portal)/payments/page.tsx`

### Issues Found

#### ISSUE PAY-1: 3-step visual may be cramped at 375px
The connect steps use `flex items-center justify-center`. Three step circles + two connector lines. At 375px, each circle is `w-6 h-6 sm:w-7 sm:h-7` (24px on mobile), labels below use `whiteSpace: "nowrap"`. "Connect Stripe" + "Verify identity" + "Start earning" -- the longest label is "Verify identity" at ~90px. With connectors `w-6 sm:w-10` (24px on mobile), total width estimate: 3 * (24 + ~80) + 2 * 24 = ~360px. This barely fits at 375px - 32px padding = 343px. The labels may overlap.

**Severity:** Medium

**Fix:**
```tsx
// Allow wrapping or reduce connector width on mobile
<div className="w-4 sm:w-10" style={{ height: 1.5, ... }} />
```

And reduce step label font size:
```tsx
<span className="caption text-[10px] sm:text-[12px]" ...>
```

#### ISSUE PAY-2: Info block grid uses `minmax(150px, 1fr)`
At 343px, this gives 2 columns (~165px each) or 1 column depending on gap. With gap: 12, two columns = 150 + 150 + 12 = 312px. This fits in 343px.

**Severity:** None

#### ISSUE PAY-3: Transaction rows work at mobile width
The row uses `flex items-center gap-3` with: date (minWidth: 90) + description (flex-1 truncate) + amount. At 343px: 90 + 24 (gaps) + amount (~60px) = 174px, leaving 169px for description. This works with truncation.

**Severity:** None

### No Issues
- FAQ accordion works correctly -- GOOD
- Connected state cards are full-width -- GOOD
- Large numbers use clamp() for responsive sizing -- GOOD

---

## 16. Settings

**File:** `src/app/(portal)/settings/page.tsx`

### Issues Found

#### ISSUE S-1: Notification grid with 3 toggle columns may be tight
Each notification row has: label (flex: 1) + 3 toggle columns (width: 64 each). Total fixed: 3 * 64 = 192px. At 343px available, the label gets 151px. This is tight but workable with truncation.

**Severity:** Low -- labels may truncate

#### ISSUE S-2: Toggle touch targets in notification grid
Each toggle is in a 64px wide cell. The toggle itself is 44x24px. The cell provides adequate width for the touch target.

**Severity:** Low (see G-3 for toggle height issue)

#### ISSUE S-3: Tutorial grid uses `minmax(260px, 1fr)`
At 343px, this forces 1 column (260 < 343, so 1 column). Each tutorial card will be full-width. This is correct.

#### ISSUE S-4: Integration channel cards with action buttons
Each card has: icon (40px) + text (flex-1) + "Send test" button + "Edit" button. At 343px - 32px card padding: 311px. Icon (40) + gap (16) + buttons (~160px) = 216px, leaving 95px for text. The text will truncate but the `.min-w-0` class is present.

**Severity:** Low

#### ISSUE S-5: Tab buttons lack explicit min-height
The settings tabs use `padding: "10px 20px"` with no explicit height. Approximately 38px tall.

**Severity:** Medium

**Fix:**
```tsx
style={{ padding: "10px 20px", minHeight: 44, ... }}
```

### No Issues
- Password fields at full width -- GOOD
- Delete account confirmation is properly contained -- GOOD
- Video placeholder scales correctly -- GOOD

---

## 17. Store Preview

**File:** `src/app/(portal)/store-preview/page.tsx`

### Issues Found

#### ISSUE SP-1: Banner height is fixed 240px -- fine for mobile
At 375px width, a 240px banner creates a good visual proportion.

#### ISSUE SP-2: Content padding is 24px on all sides
At 375px: 375 - 48px padding = 327px for content. This is fine.

#### ISSUE SP-3: Dish grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
On mobile, dishes are 1 column (full width). This is correct.

#### ISSUE SP-4: "Add" button on dish card overlay is very small
The add button has `minHeight: 0, padding: "6px 14px", fontSize: 11`. This is intentionally small as part of the card overlay design, but may be hard to tap.

**Severity:** Low

#### ISSUE SP-5: Negative margin `margin: "-16px auto"` adjusts for page padding
This makes the store preview full-bleed. The banner at 375px fills edge to edge. GOOD.

### No Issues
- Back button is 40px -- close to 44px -- ACCEPTABLE
- Status pills wrap properly -- GOOD
- Bio expand/collapse works -- GOOD

---

## 18. Login

**File:** `src/app/login/page.tsx`

### Issues Found

#### ISSUE LG-1: Container max-width is `max-w-[340px] sm:max-w-[380px]`
At 375px with `px-5` (20px on each side), content area is 335px. Max-width 340px means the container fits.

**Severity:** None

#### ISSUE LG-2: Email input height is 48px with 14px border-radius -- GOOD
The input uses class `input` which has base font-size 15px. The mobile CSS override applies 16px. But the inline `fontSize: 15` may override the CSS since inline styles have higher specificity than class-based styles.

**Severity:** Medium -- inline style may cause iOS zoom

**Fix:**
```tsx
style={{
  height: 48,
  borderRadius: 14,
  fontSize: 16, // explicitly prevent iOS zoom
}}
```

#### ISSUE LG-3: Password section input uses class `input` only -- GOOD
No inline fontSize override, so the mobile CSS `fontSize: 16px !important` applies correctly.

#### ISSUE LG-4: All buttons are adequate size
- "Send me a login link" is `btn-lg` (52px) -- GOOD
- "Continue with Google" is 48px -- GOOD
- "Sign in with password" is 44px min-height -- GOOD
- "Forgot password?" is 44px min-height -- GOOD

### No Issues
- Centered layout works at 375px -- GOOD
- Blob decorations are absolute positioned and won't cause overflow -- GOOD
- `overflow-hidden` on container -- GOOD

---

## 19. Welcome

**File:** `src/app/welcome/page.tsx`

### Issues Found

#### ISSUE W-1: Step cards min-height is `min-h-[48px] sm:min-h-[56px]`
At 48px on mobile, this is above 44px minimum. GOOD.

#### ISSUE W-2: Container max-width is `max-w-[340px] sm:max-w-[480px]`
At 375px with 20px padding on each side = 335px. Max-width 340px fits.

#### ISSUE W-3: CTA button is `btn-lg` (52px) full-width -- GOOD

#### ISSUE W-4: "Skip for now" link has `minHeight: 44` -- GOOD touch target

### No Issues
- All elements fit within 375px -- GOOD
- Text is readable -- GOOD
- Celebration emoji container responsive with `w-14 h-14 sm:w-[72px] sm:h-[72px]` -- GOOD

---

## Summary of Critical & High Issues

### CRITICAL (will break layout at 375px)

| ID | Page | Issue | 
|----|------|-------|
| CD-3 | Create Dish | Pricing size rows overflow (380px min in 319px space) |
| OP-1 | Operations | Weekly schedule rows overflow (time pickers need ~210px in 95px space) |

### HIGH (causes iOS Safari zoom or positioning bugs)

| ID | Page | Issue |
|----|------|-------|
| G-2 | Global CSS | `.input` base font-size 15px; any inline override below 16px causes zoom |
| D-2 | Dashboard | Search input fontSize 14 causes iOS zoom |
| O-1 | Orders | Mobile search fontSize 13 causes iOS zoom |
| M-1 | Menu | Search input fontSize 14 causes iOS zoom |
| OD-1 | Order Detail | Sticky bar doesn't account for safe-area-inset-bottom |
| CD-2 | Create Dish | Bottom bar doesn't account for safe-area-inset-bottom |
| CD-5 | Create Dish | Modifier grid overflows in quantity mode |
| FS-1 | Flash Sales | Date/time grid-cols-2 overflows on mobile |
| FS-3 | Flash Sales | Item config inputs fontSize 12 causes iOS zoom |
| R-2 | Reviews | Reply textarea fontSize 14 causes iOS zoom |
| P-1 | Profile | Header buttons overflow without flex-wrap |

### MEDIUM (sub-optimal touch targets or minor UX)

| ID | Page | Issue |
|----|------|-------|
| G-3 | Global CSS | Toggle height 24px (should be 44px touch area) |
| TB-1 | Top Bar | Hamburger 40x40 (should be 44x44) |
| TB-2 | Top Bar | Bell icon 36x36 (should be 44x44) |
| TB-3 | Top Bar | Avatar 28x28 (should be 44x44 touch area) |
| MD-2 | Drawer | Close button 36x36 |
| MD-3 | Drawer | Nav links 40px height |
| D-1 | Dashboard | Mode toggle under 44px |
| O-4 | Orders | Pagination buttons 28x28 |
| OD-4 | Order Detail | Back button 36x36 |
| M-7 | Menu | Tab buttons under 44px |
| CD-4 | Create Dish | Size row headers misalign on wrap |
| CD-6 | Create Dish | Quantity field labels truncate |
| PAY-1 | Payments | 3-step visual may overlap labels |
| S-5 | Settings | Tab buttons under 44px |
| LG-2 | Login | Email input inline fontSize 15 may override CSS |

---

## Consolidated CSS Fix Block

Add this to the end of `globals.css` (before the closing comment):

```css
/* ========================================================================
   MOBILE AUDIT FIXES — 375px perfection
   ======================================================================== */

@media (max-width: 639px) {
  /* FIX G-2: Ensure all inputs are 16px to prevent iOS zoom */
  input, textarea, select,
  .input, .textarea, .select {
    font-size: 16px !important;
  }

  /* FIX TB-1/TB-2/TB-3: Top bar touch targets */
  header button,
  header a {
    min-width: 44px;
    min-height: 44px;
  }

  /* FIX MD-2/MD-3: Drawer touch targets */
  .mobile-drawer-close { min-width: 44px; min-height: 44px; }
  .mobile-drawer-link { min-height: 44px !important; }

  /* FIX M-7/S-5: Tab buttons need 44px height */
  [role="tablist"] button,
  .tab-button {
    min-height: 44px;
  }

  /* FIX CD-3: Stack pricing size rows on mobile */
  .size-row-wrap {
    flex-wrap: wrap !important;
  }
  .size-row-wrap > * {
    flex: 1 1 calc(50% - 8px) !important;
    min-width: 0 !important;
  }
  .size-row-wrap > *:first-child {
    flex: 1 1 100% !important;
  }

  /* FIX OP-1: Stack operations schedule on mobile */
  .ops-day-row {
    flex-wrap: wrap !important;
  }
  .ops-day-row .time-windows {
    flex: 1 1 100% !important;
    padding-left: 0 !important;
  }

  /* FIX FS-1: Flash sale date/time to single column */
  .flash-sale-order-window {
    grid-template-columns: 1fr !important;
  }

  /* FIX OD-1/CD-2: Sticky bars account for safe area */
  .order-sticky-bar {
    bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important;
  }
  .create-dish-bottom-bar {
    bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important;
  }

  /* FIX P-1: Profile header wrap */
  .profile-header {
    flex-wrap: wrap !important;
    gap: 8px !important;
  }

  /* FIX O-4: Pagination buttons larger */
  .pagination-btn {
    min-width: 36px !important;
    min-height: 36px !important;
  }
}
```

**NOTE:** Many of these fixes require adding corresponding class names to the components. The alternative approach is to apply the fixes directly as inline styles or Tailwind classes in each component file. The class-based approach above is shown for reference -- the actual implementation requires updating each TSX file to use these class names.

---

## Priority Order for Fixes

1. **Input font-size (all pages)** -- Add `fontSize: 16` to every search input and form input that has an inline style override. This affects 8+ pages and is the single most impactful fix for iPhone Safari users.

2. **Operations weekly schedule row overflow** -- Restructure to stack on mobile. This is completely broken at 375px.

3. **Create Dish pricing rows overflow** -- Add flex-wrap or restructure to stack. Completely broken at 375px.

4. **Sticky bar safe-area positioning** -- Fix order detail and create dish bottom bars to account for iPhone home indicator.

5. **Flash sales date/time grid** -- Change to single column on mobile.

6. **Touch targets** -- Increase hamburger, bell, close buttons to 44px minimum.
