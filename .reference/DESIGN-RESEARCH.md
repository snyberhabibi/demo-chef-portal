# Design Research: Billion-Dollar Chef Portal

> Research compiled 2026-05-04 from Stripe Dashboard, Linear, Airbnb Host Portal, Notion, and SaaS best practices.
> Goal: Extract specific, actionable design patterns for the Yalla Bites chef portal.

---

## 1. Stripe Dashboard

### What Makes It Feel Premium

Stripe's dashboard communicates trust and competence through restraint. Every pixel serves a purpose.

#### Pattern 1: Perceptually Uniform Color System (CIELAB)

Stripe built their entire color palette in CIELAB color space instead of HSL/RGB. This means:
- Colors **5+ levels apart** guarantee 4.5:1 contrast for small text (WCAG 2.0 AA)
- Colors **4+ levels apart** work for icons and large text (3:1 ratio)
- All hues have identical perceived visual weight -- no single color dominates
- Yellow and blue at the same "lightness" actually look the same brightness to human eyes

**Chef Portal Application:** Build the status color system (pending, approved, active, suspended) using perceptually uniform lightness steps so no single status screams louder than others. Use a 9-step scale per hue where step 5+ always passes contrast on white.

#### Pattern 2: Six-Tier Badge/Status Taxonomy

Stripe uses exactly six semantic badge types with clear behavioral definitions:
| Type | Meaning | Action Required |
|------|---------|-----------------|
| Neutral | Default state, working as expected | None |
| Info | Important attribute or key state | None |
| Positive | Good outcome, success | None |
| Negative | Bad outcome | None |
| Warning | Needs attention | Optional |
| Urgent | Needs immediate action | Required |

**Chef Portal Application:** Map chef statuses directly: Neutral (draft), Info (under review), Positive (approved/active), Negative (rejected), Warning (documents expiring), Urgent (food safety issue).

#### Pattern 3: Stat Cards with Inline Sparklines

Stripe's component library includes dedicated `Sparkline` components designed to sit inside stat cards. Key specs:
- Sparklines accept `x`, `y`, and `color` channel data
- Support currency formatting with 150+ currency codes and fractional digit control
- Tooltips toggle on/off for hover detail
- `nice` prop rounds axis scales to clean values for readability
- `zero` prop forces inclusion of zero baseline

**Chef Portal Application:** Chef earnings card shows a sparkline of last 30 days revenue. Order count card shows a sparkline of daily order volume. Both use currency formatting with `fractionalDigits: 0` for clean display.

#### Pattern 4: Three-View Layout Architecture

Stripe Apps uses three distinct view containers for different cognitive modes:
1. **ContextView** -- renders in a side drawer alongside main content (browsing mode)
2. **FocusView** -- full blocking backdrop for multi-step workflows (action mode)
3. **SettingsView** -- dedicated configuration page (setup mode)

**Chef Portal Application:** Chef profile viewing = ContextView (drawer). Menu item creation = FocusView (blocking modal). Kitchen settings/hours = SettingsView (dedicated page).

#### Pattern 5: Toast Timing Rules Based on Cognitive Load

Stripe's toast system uses a precise timing matrix:
| Has Pending State | Has Action Button | Auto-Dismiss |
|-------------------|-------------------|--------------|
| No | No | 4 seconds |
| No | Yes | 6 seconds |
| Yes | No | Never |
| Yes | Yes | Never |

Messages capped at 30 characters max. Clicking the action button auto-dismisses.

**Chef Portal Application:** "Order confirmed" = 4s auto-dismiss. "Menu published" with "Undo" button = 6s. "Uploading menu photos..." = persistent until complete. All toast messages under 30 characters.

---

## 2. Linear

### What Makes It Feel Fast

Linear's design philosophy centers on a "calmer, more consistent interface" (March 2026 redesign). The product feels fast because it eliminates friction at every interaction point.

#### Pattern 1: Keyboard-First Navigation with Vim-Style Shortcuts

Linear uses single-key and chord shortcuts for every action:
- `G` then `I` = Go to Inbox
- `G` then `M` = Go to My Issues
- `G` then `X` = Go to Archive
- `J` / `K` = Navigate up/down through lists (Vim-style)
- `U` = Toggle read/unread
- `H` = Snooze/Remind
- `Shift` + `V` = Toggle display options
- `Cmd/Ctrl` + `B` = Toggle between list and board layout
- `Cmd/Ctrl` + `J` = Open AI agent (command palette)
- `Cmd/Ctrl` + `I` = Toggle details sidebar
- `]` and `[` = Toggle sidebar/details panes
- `T` = Collapse/expand group headers
- `Backspace` = Delete notification
- `Shift` + `Backspace` = Delete all notifications

**Chef Portal Application:** Implement single-key shortcuts for power-user chefs managing many orders: `J`/`K` to navigate order list, `A` to accept, `R` to reject, `D` to mark delivered, `?` to show shortcut overlay.

#### Pattern 2: Dimmed Sidebar with Content-Area Emphasis

Linear's March 2026 redesign specifically dimmed navigation sidebars to push visual focus toward the content area. The sidebar serves as a quiet index, not a visual competitor.

Sidebar organization:
- Top: Inbox (notification center)
- Second: My Issues (personal dashboard)
- Third: Teams (expandable, supports 5 levels of nesting)
- Fourth: Views (custom saved filters)
- Bottom: Settings

Right-click on sidebar items opens full context menus. Retired/inactive items hide from sidebar automatically.

**Chef Portal Application:** Use a dimmed (#fafafa bg or equivalent) sidebar with muted icon colors. Active section gets a subtle left border accent, not a background fill. Sidebar sections: Dashboard, Orders, Menu, Reviews, Earnings, Settings.

#### Pattern 3: Smart Focus Prioritization in Personal Dashboard

Linear's "My Issues" uses an intelligent "Focus" grouping that automatically orders work by urgency:
1. Urgent and SLA-bound items (top)
2. Blocking work affecting others
3. Current cycle assignments
4. Active in-progress work
5. Triage and backlog items (bottom)

Auto-subscription to assigned, mentioned, and created items. Bulk keyboard operations for subscription management.

**Chef Portal Application:** Chef's "Today" view auto-prioritizes: (1) Orders needing immediate action, (2) Expiring documents/certifications, (3) Unread customer reviews, (4) Menu items needing attention, (5) Upcoming scheduled orders.

#### Pattern 4: Advanced Filtering with Natural Language AI

Linear supports combining AND/OR filter conditions with nested logic. Their "AI filter" allows describing searches in natural language (e.g., "show me high priority bugs assigned to me this week").

Filter sidebar shows quick-access facets: assignees, labels, projects, leads, health status.

**Chef Portal Application:** Implement faceted filters for orders: status chips (New, Preparing, Ready, Delivered), date range, customer rating, order value range. Consider AI filter: "show me orders over $50 from this week."

#### Pattern 5: Notification Inbox with Snooze and Bounded Capacity

Linear's inbox has a hard cap of 500 notifications. Key patterns:
- Snooze temporarily hides a notification; it reappears unread at a scheduled time
- New activity cancels active snoozes (the item resurfaces)
- Reminders are separate from snooze -- they fire at scheduled times independently
- Bulk operations: mark all read, delete all, delete read only
- Contextual search filters by title, ID, type, or assignee
- Comment send behavior is configurable: `Enter` or `Cmd/Ctrl + Enter`

**Chef Portal Application:** Chef notification center with snooze for "review later" items. Cap at 200 notifications. Categories: Orders, Reviews, Platform Announcements, Document Reminders.

---

## 3. Airbnb Host Portal

### What Makes It Trustworthy

Airbnb's host portal earns trust through progressive disclosure, clear financial transparency, and a guided onboarding that never overwhelms.

#### Pattern 1: Multi-Step Onboarding with One-Thing-Per-Screen

Airbnb's listing creation flow uses a strict one-question-per-screen approach:
- Screen 1: Property type (apartment, house, etc.)
- Screen 2: Space type (entire place, private room, shared room)
- Screen 3: Location (map + address)
- Screen 4: Guest capacity
- Screen 5: Amenities (checkbox grid)
- Screen 6: Photos (drag-and-drop upload with reorder)
- Screen 7: Title
- Screen 8: Description
- Screen 9: Pricing
- Screen 10: Calendar/availability
- Screen 11: House rules
- Screen 12: Review and publish

Progress bar at top shows completion percentage. Each screen has a single primary action button. Back navigation preserves all entered data.

**Chef Portal Application:** Chef onboarding mirrors this exactly:
1. Kitchen type (home kitchen, commercial, food truck)
2. Cuisine type
3. Location/service area
4. Menu items (guided creation)
5. Kitchen photos
6. Food safety certifications (document upload)
7. Availability/hours
8. Pricing and delivery radius
9. Review and submit for approval

#### Pattern 2: Earnings Display with Period Comparison

Airbnb's earnings dashboard shows:
- Current period earnings (prominent, large number)
- Comparison to previous period (percentage change)
- Breakdown by listing (when multiple properties)
- Payout schedule with expected dates
- Transaction history with status indicators (paid, pending, processing)
- Export capability for tax/accounting

**Chef Portal Application:** Chef earnings card: large "$2,847" current month, "+12% vs last month" in green, breakdown by menu category (mains, sides, desserts), next payout date and amount, downloadable transaction history.

#### Pattern 3: Calendar with Visual Density Encoding

Airbnb's host calendar uses color/visual density to encode information:
- Available dates: white/light background
- Blocked dates: gray strikethrough
- Booked dates: colored fills (different colors for different reservation sources)
- Price shown in each date cell
- Minimum stay restrictions shown as connected bars
- Click-and-drag to select date ranges for bulk actions

**Chef Portal Application:** Chef availability calendar: green = available, gray = unavailable, blue = has orders, red = fully booked. Each cell shows order count. Click-and-drag to set availability for date ranges. Weekly pattern templates for recurring schedules.

#### Pattern 4: Photo Upload with AI-Suggested Ordering

Airbnb's photo upload:
- Drag-and-drop multi-file upload
- Automatic thumbnail generation
- Drag-to-reorder with smooth animation
- AI suggests optimal photo order (exterior first, then rooms, then details)
- Minimum photo count enforced (5 photos)
- Caption field per photo
- Cover photo designation (first position)
- 280x280px minimum for icons, 1500px minimum for covers

**Chef Portal Application:** Menu item photos: drag-and-drop upload, auto-crop to food-photo-friendly aspect ratio (4:3), reorder by drag, primary photo auto-selected, minimum 1 photo per menu item. Kitchen photos for profile: minimum 3, auto-suggest order (kitchen, prep area, packaging).

#### Pattern 5: Review Response Flow with Suggested Templates

Airbnb's review management:
- Reviews displayed with star ratings, guest photo, date, and full text
- Response field appears inline (not in a modal)
- Character limit for responses
- "Public response" label clearly shown
- Templates/suggestions for common response scenarios
- Response time tracking (hosts see how quickly they typically respond)
- Overall rating breakdown by category (cleanliness, accuracy, communication, etc.)

**Chef Portal Application:** Customer review cards show: star rating, customer name (first name + last initial), order items, review text. Response field inline with template suggestions ("Thank you for your feedback!", "We're sorry about your experience..."). Track response rate and average response time. Rating breakdown: food quality, portion size, packaging, delivery time.

---

## 4. Notion

### What Makes It Calm

Notion achieves calm through generous whitespace, a restrained color palette, and content that adapts to context rather than forcing fixed layouts.

#### Pattern 1: Sidebar with Tab-Based Top-Level Navigation

Notion's redesigned sidebar uses tabs as primary navigation:
- **Home tab**: Customizable sections (Upcoming events, Recents, Favorites, Agents, Teamspaces, Shared, Private)
- **Chats tab**: AI agent conversations sorted by recency, blue dot for unread
- **Meetings tab**: Upcoming events and meeting history
- **Inbox tab**: Consolidated mentions, comments, updates, reminders with bulk actions (Mark all read, Archive all, Archive read)
- **Search**: Opens a modal for workspace-wide search

Each tab has a creation button at the bottom. Sections within tabs can be shown/hidden and reordered via three-dot context menus.

**Chef Portal Application:** Use tab-based top navigation within the sidebar: Dashboard (home), Orders (active work), Menu (content management), Inbox (notifications/messages), Search. Each tab has customizable section ordering.

#### Pattern 2: Seven Database View Types for the Same Data

Notion lets users view the same dataset in seven different formats:
1. **Table** -- rows and columns, freeze columns, inline editing
2. **Board** -- Kanban by any property (status, category, etc.)
3. **Timeline** -- Gantt-style with duration bars
4. **Calendar** -- date-based grid layout
5. **List** -- minimal, clean, title-focused
6. **Gallery** -- image-card grid (highlights Files & media properties)
7. **Chart** -- bar, line, or donut visualizations

Users switch between views instantly. Each view can have independent filters, sorts, and property visibility.

**Chef Portal Application:** Orders viewable as: Table (detailed data), Board (kanban by status: New > Preparing > Ready > Delivered), Calendar (by delivery date). Menu viewable as: Gallery (photo cards), Table (spreadsheet-style editing), Board (by category).

#### Pattern 3: Slash Commands for Rapid Content Creation

Notion uses `/` prefix commands for inline content creation:
- `/text`, `/h1`, `/h2`, `/h3` for structure
- `/todo`, `/toggle`, `/quote`, `/callout` for special blocks
- `/image`, `/video`, `/file`, `/embed` for media
- `/table`, `/board`, `/calendar` for data views
- `/mention`, `/date`, `/reminder` for references
- `/duplicate`, `/moveto`, `/delete` for management

Combined with `@` for mentions, `[[` for page links, and `+` for new page creation.

**Chef Portal Application:** Menu item creation could use a block-based editor where chefs type `/ingredient` to add ingredient blocks, `/allergen` for allergen tags, `/photo` for inline images, `/price` for pricing blocks.

#### Pattern 4: Three-Layer Filter Logic with AND/OR Nesting

Notion's advanced filters support:
- Simple filters: property + condition
- Compound filters: AND/OR groups
- Nested filters: up to 3 levels deep
- Sub-grouping within groups for swim-lane views
- Empty group hiding toggle
- Saved filter presets per view

Sort behavior is property-type-aware: text sorts alphabetically, numbers sort numerically, select properties sort by user-defined order.

**Chef Portal Application:** Order filtering: "Show orders WHERE status = Preparing AND total > $30 OR customer is repeat customer." Save as "High-Value Active Orders" view. Sub-group by delivery zone.

#### Pattern 5: Generous Whitespace with Full-Width Toggle

Notion defaults to a content-width layout with side margins, but offers a "Full width" toggle to expand content edge-to-edge. Additional whitespace controls:
- Three font choices: Default, Serif, Mono
- "Small text" toggle to reduce font size page-wide
- Callout blocks with customizable icons (emoji, uploaded images, or random)
- Cover images (1500px minimum, Unsplash integration)
- Page icons (280x280px, emoji or custom)
- Dividers for visual section breaks
- Backlinks section (toggleable)

**Chef Portal Application:** Use a content-width default (max-width: 768px for forms, 1200px for tables) with generous side margins. Offer a "compact" toggle for chefs who want denser information display. Menu item pages get cover images (the hero food photo).

---

## 5. General SaaS Admin Portal Best Practices

### Compiled from Vercel Geist, Carbon Design System, NNGroup, and Laws of UX

#### Pattern 1: Skeleton Loading States (Not Spinners)

Modern SaaS products use content-shaped skeleton screens instead of spinners:
- Vercel Geist includes dedicated `Skeleton` and `Loading Dots` components
- Skeletons match the shape of incoming content (card-shaped, table-row-shaped, text-line-shaped)
- Animated shimmer effect (subtle left-to-right gradient sweep)
- Carbon Design System: "Loading displays when information takes an extended amount of time to process"

Anti-pattern: A blank white screen or a centered spinner with no content shape hints.

**Chef Portal Application:** Every data-loading state shows a skeleton matching the content shape. Orders list skeleton = 5 rows with icon + 3 text lines + status badge placeholder. Dashboard stats skeleton = 4 cards with sparkline placeholder. Never show a blank screen.

#### Pattern 2: Command Palette (Cmd+K) as Universal Search

Vercel Geist includes a dedicated `Command Menu` component. Linear uses `Cmd/Ctrl + K` (now `Cmd + J` for AI agent). Notion uses `Cmd/Ctrl + K` for search. Stripe uses `?` for keyboard shortcuts.

The pattern:
- Single keyboard shortcut opens a modal search
- Type to search across all entities (orders, chefs, menu items, customers)
- Results grouped by type with keyboard navigation
- Recent searches shown on empty state
- Actions available directly from results (e.g., "View Order #1234", "Edit Menu Item")

**Chef Portal Application:** `Cmd/Ctrl + K` opens a command palette. Search across orders, menu items, customers, reviews. Show recent items on empty state. Direct actions: "Go to Order #4521", "Edit Chicken Shawarma", "View Today's Earnings."

#### Pattern 3: Progressive Disclosure Through Accordions and Drawers

Both Stripe and Carbon emphasize progressive disclosure:
- Stripe's Accordion: title + optional subtitle + optional media + up to 2 actions per item
- Disabled accordions show information but remove interaction (rather than hiding entirely)
- Stripe's drawer (ContextView) shows details alongside list content
- Carbon's "Read-only inputs" pattern for displaying form data without edit capability

**Chef Portal Application:** Order details expand in an accordion or slide-open drawer -- not a full page navigation. Chef profile sections (Personal Info, Kitchen Details, Documents, Bank Info) use accordions. Completed/locked sections show data read-only with an "Edit" button.

#### Pattern 4: Empty States as Onboarding Opportunities

NNGroup's three rules for empty states:
1. **Communicate system status** -- never show a truly blank screen
2. **Provide learning cues** -- explain what content could appear and how to create it
3. **Create direct task pathways** -- include action buttons ("Add your first menu item", "Set your availability")

Anti-pattern: "No records found" with no next step. Also: showing "No records" and then populating content seconds later (erodes trust).

**Chef Portal Application:** Empty menu: illustration + "Add your first dish" + "Your menu items will appear here. Start by adding your signature dish." + [Add Menu Item] button. Empty orders: "No orders yet" + "Once you publish your menu, orders will appear here" + [Preview Your Menu] link. Empty reviews: "Reviews will appear after your first order is delivered."

#### Pattern 5: Consistent Component Vocabulary Across the Product

Vercel Geist provides a comprehensive component taxonomy:
- **Feedback**: Toast, Modal, Drawer, Error, Empty State
- **Data Display**: Table, Badge, Pill, Status Dot, Gauge
- **Navigation**: Menu, Command Menu, Context Menu, Tabs, Breadcrumb, Collapse
- **Form**: Input, Textarea, Select, Multi Select, Combobox, Checkbox, Radio, Toggle, Switch
- **Layout**: Grid, Scroller, Pagination

The key insight: every component has one job and appears the same everywhere. A `StatusDot` is always a small colored circle. A `Badge` is always a pill with text. A `Toast` is always bottom-positioned and auto-dismissing.

**Chef Portal Application:** Define and document every component once. Status dots for order states. Badges for chef tier (Bronze, Silver, Gold). Toasts for action confirmations. Modals for destructive actions only. Drawers for detail views. Tables for data lists. This vocabulary must be consistent across every page.

---

## Combined Recommendations: Top 15 Patterns to Adopt

Ranked by impact on chef portal quality and user trust.

### Tier 1: Foundation (Build These First)

**1. Skeleton Loading States, Never Spinners**
Source: Vercel Geist, Carbon Design System
Impact: Eliminates the "is it broken?" moment. Content-shaped skeletons with shimmer animation for every data-loading state. This is the single biggest signal of a premium product.

**2. Six-Tier Status Badge System (Stripe)**
Source: Stripe Badge Component
Impact: A universal visual language for every state in the system. Map all chef, order, menu, and document states to Neutral/Info/Positive/Negative/Warning/Urgent. Use perceptually uniform colors from a CIELAB-derived palette.

**3. One-Thing-Per-Screen Onboarding (Airbnb)**
Source: Airbnb Host Onboarding
Impact: Chef onboarding is the first impression. Each screen asks one question. Progress bar at top. Back button preserves data. This pattern has proven conversion rate advantages across every marketplace.

**4. Keyboard-First Navigation (Linear)**
Source: Linear Keyboard Shortcuts
Impact: Power-user chefs processing 50+ orders/day need speed. `J`/`K` for navigation, single-key actions for common tasks, `?` for shortcut overlay. This separates a tool from a toy.

**5. Empty States as Onboarding (NNGroup)**
Source: NNGroup Empty State Research
Impact: Every empty state is an opportunity to teach and convert. Never show blank screens. Always include: explanation, illustration, and a primary action button.

### Tier 2: Navigation and Information Architecture

**6. Dimmed Sidebar with Content Emphasis (Linear)**
Source: Linear March 2026 Redesign
Impact: The sidebar should be a quiet navigation aid, not compete with content. Dimmed background, muted icons, subtle active-state indicator (left border, not background fill).

**7. Command Palette / Universal Search (Cmd+K)**
Source: Linear, Notion, Vercel
Impact: The fastest way to get anywhere. One shortcut, search everything. Recent items on empty state. Direct actions from results. This is table stakes for any modern SaaS product.

**8. Tab-Based Sidebar Sections (Notion)**
Source: Notion Sidebar Redesign
Impact: Organize the sidebar into tabs (Dashboard, Orders, Menu, Inbox) with customizable section visibility. Three-dot menus for section management. Blue dot indicators for unread items.

### Tier 3: Data Display and Interaction

**9. Multiple View Types for the Same Data (Notion)**
Source: Notion Database Views
Impact: Orders as table, board (kanban), or calendar. Menu as gallery or table. Let chefs choose how they see their data. Each view has independent filters and sorts.

**10. Stat Cards with Inline Sparklines (Stripe)**
Source: Stripe Sparkline Component
Impact: Dashboard stat cards show the number AND the trend. "247 orders" with a 30-day sparkline tells a story that a plain number cannot. Use currency formatting, force zero baseline.

**11. Smart Prioritization in Personal Dashboard (Linear)**
Source: Linear Focus Mode
Impact: The chef's "Today" view auto-sorts by urgency: orders needing action > expiring documents > unread reviews > menu attention > scheduled orders. No manual sorting needed.

### Tier 4: Feedback and Communication

**12. Toast Timing Matrix (Stripe)**
Source: Stripe Toast Component
Impact: Precise auto-dismiss timing based on content type. Success = 4s. Success with undo = 6s. Pending/loading = persistent. Max 30 characters. This removes the "did my action work?" anxiety.

**13. Notification Inbox with Snooze (Linear)**
Source: Linear Inbox
Impact: A dedicated notification center with snooze, mark read/unread, bulk actions, and bounded capacity (cap at 200). Categories for orders, reviews, platform announcements. Snooze resurfaces items at chosen time.

### Tier 5: Content and Forms

**14. Three-View Layout Architecture (Stripe)**
Source: Stripe ContextView/FocusView/SettingsView
Impact: Browsing = side drawer. Multi-step creation = full blocking modal. Configuration = dedicated page. Match the cognitive mode to the UI container. Never force a full page load for a quick detail view.

**15. Inline Review Response with Templates (Airbnb)**
Source: Airbnb Review Management
Impact: Reviews display inline with a response field underneath -- no modal needed. Offer template suggestions for common scenarios. Track response rate and average response time as a chef performance metric.

---

## Implementation Priority

| Phase | Patterns | Effort |
|-------|----------|--------|
| Phase 1: Foundations | #1 Skeletons, #2 Status Badges, #5 Empty States, #6 Sidebar | 1 week |
| Phase 2: Navigation | #7 Command Palette, #8 Tab Sidebar, #14 View Architecture | 1 week |
| Phase 3: Data | #9 View Types, #10 Sparkline Stats, #11 Smart Priority | 1 week |
| Phase 4: Onboarding | #3 One-Per-Screen Onboard, #4 Keyboard Shortcuts | 1 week |
| Phase 5: Polish | #12 Toast Timing, #13 Notification Inbox, #15 Review Response | 1 week |

---

## Design Token Recommendations

Based on this research, the chef portal design system should include:

```
/* Color: CIELAB-derived 9-step scales */
--status-neutral: /* gray scale */
--status-info: /* blue scale */
--status-positive: /* green scale */
--status-negative: /* red scale */
--status-warning: /* amber scale */
--status-urgent: /* red-orange scale, higher saturation */

/* Spacing: 4px base unit */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif
--font-mono: 'JetBrains Mono', monospace
--text-xs: 12px / 16px
--text-sm: 14px / 20px
--text-base: 16px / 24px
--text-lg: 18px / 28px
--text-xl: 20px / 28px
--text-2xl: 24px / 32px
--text-3xl: 30px / 36px

/* Sidebar */
--sidebar-width: 240px
--sidebar-collapsed-width: 48px
--sidebar-bg: #fafafa (light) / #111111 (dark)
--sidebar-active-border: 2px solid var(--brand-primary)

/* Animation */
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
--skeleton-shimmer: 1.5s linear infinite

/* Toast */
--toast-success-duration: 4000ms
--toast-action-duration: 6000ms
--toast-max-chars: 30

/* Content Width */
--content-max-width-form: 768px
--content-max-width-table: 1200px
--content-max-width-full: 100%
```

---

*Sources: Stripe Dashboard Docs, Stripe Apps Design System, Stripe Accessible Color Systems Blog, Linear Changelog (March 2026), Linear Documentation (Views, Display Options, Custom Views, My Issues, Inbox, Projects), Notion Help Center (Sidebar, Keyboard Shortcuts, Database Views, Filters & Sorts, Content Styling), Airbnb Host Onboarding Flow Analysis, Vercel Geist Design System, Carbon Design System, NNGroup Empty State Research, Laws of UX, shadcn/ui Data Table Patterns.*
