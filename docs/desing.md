---
name: Follow-up Board
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

The design system is engineered for high-velocity sales reps, account managers, and business operators managing contact lifecycles directly from mobile web viewports. The emotional response is centered on control, clarity, and momentum: turning chaotic backlogs into clear next-actions. 

The aesthetic is Modern SaaS Precision—anchoring high-contrast dark slate headers against clean white tactile cards, subtle cool architectural hairline borders, and targeted chromatic highlights. Interactions prioritize one-thumb operation, rapid legibility under varied lighting conditions, and strict semantic clarity for lifecycle statuses. Visual clutter is stripped away in favor of purposeful information hierarchy, tight typographic rhythms, and deliberate gesture-friendly touch footprints.

## Colors

The palette balances deep enterprise slates with pure whites and vibrant semantic status accents:

- **Canvas & Surfaces:**
  - Base canvas: `#f8fafc` (Cool gray-50) for effortless distinction against card panels.
  - Cards & Modals: `#ffffff` (Pure White).
  - Shell / Top App Bar / Bottom Nav: `#0f172a` (Slate-900) for structural grounding, with `#1e293b` (Slate-800) for nested navigation indicators.
  - Hairline dividers & borders: `#e2e8f0` (Slate-200) for surfaces on light canvas; `#334155` (Slate-700) for elements on dark canvas.

- **Brand & Action Accents:**
  - Primary Accent: `#4f46e5` (Indigo-600) for primary CTAs, active selections, and key metrics.
  - Interactive Hover/Active: `#4338ca` (Indigo-700).

- **Lifecycle Semantic Tokens:**
  - **รอติดตาม (Pending / Scheduled):** `#f59e0b` (Amber-500) text & icon; `#fffbeb` (Amber-50) container background; `#fde68a` (Amber-200) container border.
  - **กำลังติดต่อ (In Progress / Active Dialogue):** `#0284c7` (Sky-600) text & icon; `#f0f9ff` (Sky-50) container background; `#bae6fd` (Sky-200) container border.
  - **สำเร็จ (Completed / Won):** `#10b981` (Emerald-500) text & icon; `#ecfdf5` (Emerald-50) container background; `#a7f3d0` (Emerald-200) container border.
  - **ยกเลิก (Cancelled / Inactive):** `#64748b` (Slate-500) text & icon; `#f1f5f9` (Slate-100) container background; `#cbd5e1` (Slate-300) container border.

## Typography

Typography relies on `Inter` for its tall x-height, tabular numerical features, and tight legibility across compact mobile screens. (For deployments requiring native Thai glyph sets, fall back automatically to `Prompt` or `Noto Sans Thai` while maintaining identical weight scales).

- Display levels prioritize negative letter tracking (`-0.01em` to `-0.02em`) to maintain tightness in condensed mobile card views.
- Tabular figures (`tnum`) must be enforced for dates, phone numbers, deal sizes, and relative timestamps ("2h ago", "14:30").
- Status chips and micro-labels leverage uppercase tracking with `label-sm` to maintain instant visual scanning without overpowering contact names.

## Layout & Spacing

The layout operates on a mobile-first, single-column fluid container system designed to prevent horizontal overflow while respecting mobile browser chrome:

- **Mobile Viewports (< 640px):** Single-column stacked feed. Side margins are locked to `1rem` (16px) with an internal component gap rhythm of `0.875rem` (14px). Safe areas (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`) are reserved strictly for fixed headers and sticky operational trays.
- **Tablet / Desktop Viewports (≥ 640px):** Content wraps into an adaptive multi-column Kanban or master-detail layout pinned to a max container width of `1080px`, scaling margins up to `2rem`.
- **Vertical Rhythm:** 4px grid base. Card internal padding is uniformly set to `space-md` (14px) for compact efficiency, expanding to `space-lg` (20px) for detailed profile sheets and modal bottom-sheets.

## Elevation & Depth

Visual hierarchy uses a refined hybrid of ambient tinted shadows and delicate slate hairline borders:

- **Level 0 (Canvas Base):** Flat `#f8fafc`, no shadow, no border.
- **Level 1 (Feed & Kanban Cards):** Surface `#ffffff`, border `1px solid #e2e8f0`, shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`. Gives cards distinct tactile presence without heaviness.
- **Level 2 (Active/Pressed Cards & Dropdowns):** Border `1px solid #cbd5e1`, shadow `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, Bottom Sheets & Sticky Rails):** Surface `#ffffff` with frosted backdrop blur (`backdrop-filter: blur(12px)` over `rgba(15, 23, 42, 0.4)`), border-t `1px solid #e2e8f0`, shadow `0 -4px 16px -2px rgba(15, 23, 42, 0.08)`.
- **Level 4 (Sticky Top Bars):** Solid `#0f172a` with subtle bottom border `1px solid #1e293b`.

## Shapes

The design system implements modern rounded geometry (`roundedness: 2`):

- **Cards & Detail Tiles:** Standard `0.5rem` (8px) to `0.75rem` (12px), creating friendly, approachable panels that nest cleanly on narrow displays.
- **Action Buttons & Input Fields:** `0.5rem` (8px) for compact, balanced ergonomics.
- **Status Badges, Filter Pills & Avatar Rings:** Fully pill-shaped (`9999px`) to create clear formal distinction against rectangular data panels.
- **Bottom Drawers & Overlays:** Rounded top corners at `1rem` (16px) with flat bottoms to dock flush with the device screen.

## Components

### Buttons
- **Primary:** Background `#4f46e5`, text `#ffffff`, height 44px (minimum touch target), font `label-lg`, radius `0.5rem`. Active state compresses slightly (`transform: scale(0.98)`).
- **Secondary / Outlined:** Background `#ffffff`, border `1px solid #cbd5e1`, text `#0f172a`.
- **Quick Action Icon Buttons:** 40x40px square with 8px radius, subtle border `#e2e8f0`, hover background `#f1f5f9`. Used for direct call, WhatsApp/LINE, and note-taking triggers.

### Status Chips (Pills)
- Rendered in `label-sm` with 4px vertical, 8px horizontal padding, and circular status dots (6x6px).
- Dynamic theming:
  - *รอติดตาม:* Amber text `#b45309`, background `#fef3c7`, dot `#f59e0b`.
  - *กำลังติดต่อ:* Sky text `#0369a1`, background `#e0f2fe`, dot `#0284c7`.
  - *สำเร็จ:* Emerald text `#047857`, background `#d1fae5`, dot `#10b981`.
  - *ยกเลิก:* Slate text `#475569`, background `#f1f5f9`, dot `#94a3b8`.

### Follow-up Contact Card
- White surface, `0.75rem` border-radius, 1px border `#e2e8f0`.
- Top row: Lead name (`headline-sm`), deal value, and semantic status chip.
- Middle row: Company name, last contacted timestamp, and next scheduled follow-up alarm.
- Bottom action shelf: Divided hairline border-t `#f1f5f9` containing immediate one-tap triggers (Call, Message, Log Activity, Reschedule).

### Inputs & Form Elements
- Text Fields: 44px height, background `#ffffff`, border `1px solid #cbd5e1`, text `body-md`, focused state transitions border to `#4f46e5` with an outer ring `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- Checkboxes: 20x20px with 4px border-radius, checking fills with `#4f46e5`.

### Navigation & Trays
- **Sticky Top Bar:** Compact 52px height, `#0f172a` slate surface, high-contrast white text, search icon, and pipeline filter dropdown.
- **Sticky Bottom Action Bar:** 64px height + safe area, docking bottom filters, batch actions, and a prominent floating-style "+ Lead" quick-add button.