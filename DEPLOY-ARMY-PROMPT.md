# Chef Portal — Deploy the Army

Paste this entire prompt into a new Claude Code session to deploy the implementation army.

---

## Context

I'm building the Yalla Bites Chef Portal demo prototype at `~/demo-chef-portal/`. It's a Next.js 15 + Tailwind CSS prototype live at https://demo-chef-portal.vercel.app (GitHub: snyberhabibi/demo-chef-portal).

Three audits were just completed:
- `~/demo-chef-portal/DEFINITIVE-AUDIT.md` — 42 items (5 critical, 12 important, 15 polish, 10 stretch), 8.2/10 overall
- `~/demo-chef-portal/.reference/MOBILE-AUDIT.md` — 2 critical layout breaks, 11 iOS zoom issues, 15 sub-44px touch targets
- `~/demo-chef-portal/.reference/CUTTING-EDGE-UX-RESEARCH.md` — Top 20 patterns ranked by impact

Read all three audit files FIRST. Then deploy 5 parallel agents to fix everything:

## Agent 1: Critical Fixes (5 items)
Read `DEFINITIVE-AUDIT.md` section "Critical". Fix:
1. Order detail data mismatch — hash IDs from orders list must map to detail page lookup
2. Order stepper must handle "paid" as the first active status
3. `.btn-red` in globals.css forces `border-radius: 9999px` — remove the pill override so btn-red can be used for non-pill buttons (cancel, destructive actions)
4. Tab count badges on orders page must update when orders are optimistically advanced
5. Menu dish cards should show dish name in the edit form when clicked (pre-fill the form with the dish's data)

## Agent 2: Mobile Fixes (all items from MOBILE-AUDIT.md)
Read `.reference/MOBILE-AUDIT.md`. Fix every issue:
- Operations weekly schedule: stack time pickers below day name on mobile (flex-wrap or flex-col at 640px)
- Create Dish pricing rows: stack vertically on mobile
- iOS zoom: remove ALL inline fontSize overrides on inputs (12px, 13px, 14px, 15px) — let the global CSS `16px !important` rule work. Use className-based sizing instead.
- Sticky bottom bars: add `env(safe-area-inset-bottom)` padding
- Profile header: add `flex-wrap`
- Flash Sales creation panel: single column on mobile
- Create Dish modifier grid: responsive columns
- Fix all 15 sub-44px touch targets: hamburger→44px, bell→44px, avatar→36px→44px, drawer close→44px, drawer nav links→44px, pagination buttons→36px min

## Agent 3: Data Consistency + Shared Mock Data
Create `/src/lib/mock-data.ts` with ALL mock data in one place:
- Dishes (11 items with consistent names, prices, images, categories, cuisines)
- Orders (12 items referencing dish data, consistent prices/payouts)
- Reviews (4 items with ratings that average correctly)
- Chef profile (name, tagline, rating, order count)
- Flash sales (mock data)

Then update EVERY page to import from this shared file instead of hardcoding data inline. This eliminates all cross-page contradictions (Mansaf $28 vs $100, rating 4.8 vs 5.0, etc.).

Pages to update: dashboard, orders, orders/[id], menu, flash-sales, reviews, store-preview, payments (transaction history).

## Agent 4: Important Fixes (12 items from DEFINITIVE-AUDIT.md)
Read `DEFINITIVE-AUDIT.md` section "Important". Fix all 12 items. Key ones:
- Add skeleton loading to the 13 pages that lack it
- Fix store preview to use shared mock data
- Add order detail route to layout breadcrumbs
- Fix Flash Sales creation panel form validation
- Fix all inline style inconsistencies flagged in the audit

## Agent 5: Polish + Cutting-Edge Patterns
Read `.reference/CUTTING-EDGE-UX-RESEARCH.md`. Implement the top 5 high-impact patterns:
1. **Order stage pipeline** — Add a kanban-style view option on the orders page (columns: New → Preparing → Ready → Done)
2. **Celebration animation** — When a chef completes onboarding step 10 (Go Live), show a confetti animation
3. **Real-time stock indicators** — On the Flash Sales live card, show "12 of 50 claimed" with a progress bar
4. **Bottom sheet for mobile order actions** — When tapping an order action button on mobile, show a confirmation bottom sheet instead of just a toast
5. **Audio alert icon** — Add a speaker icon on the orders page header that toggles "New order alerts" on/off (visual only for prototype)

After ALL 5 agents complete, do a final `next build` check and deploy to Vercel:
```
cd ~/demo-chef-portal && git add -A && git commit -m "fix: complete audit implementation — 42 items" && git push origin main && vercel --prod --yes
```

The target is 9.5/10. Every button works. Every pixel is intentional. This is the reference standard for the dev team.
