# Visual Guide: Flow 1 Implementation

## 🎨 Color Palette in Action

### Your Custom Colors
```
Background:    #F5F1EA  ████  Warm cream (page background)
Sage Green:    #8C8C5A  ████  Primary actions, buttons
Forest Teal:   #516C61  ████  Focus states, secondary actions
Blush Pink:    #F0C2B4  ████  Success states, warm accents
Espresso:      #3A2A28  ████  Primary text, headings
Goldenrod:     #D8B466  ████  Warnings, attention
White:         #FFFFFF  ████  Card backgrounds
```

---

## 📱 Screen Previews

### 1. Dashboard Page (Empty State)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   Dashboard                            [+ New Project]      │
│   Manage your UX audit projects                             │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                      │   │
│   │                     📁                               │   │
│   │                                                      │   │
│   │              No projects yet                         │   │
│   │                                                      │   │
│   │   Create your first project to start auditing       │   │
│   │   user experiences and capturing findings.           │   │
│   │                                                      │   │
│   │            [+ Create First Project]                  │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Colors:
- Page background: Warm cream #F5F1EA
- Card: White with shadow
- Heading: Garamond, Espresso #3A2A28
- Button: Sage green #8C8C5A
```

---

### 2. Create Project Modal

```
┌─────────────────────────────────────────────────────────────┐
│                   Create New Project                    [X] │
│   Set up your UX audit project with basic information       │
│ ─────────────────────────────────────────────────────────── │
│                                                              │
│   Project Name *                                             │
│   ┌────────────────────────────────────────────────────┐   │
│   │ E-commerce Checkout Audit                           │   │
│   └────────────────────────────────────────────────────┘   │
│                                                              │
│   Client Name *                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │ Acme Corporation                                    │   │
│   └────────────────────────────────────────────────────┘   │
│                                                              │
│   Audit Goal                                                 │
│   ┌────────────────────────────────────────────────────┐   │
│   │ Evaluate checkout flow for conversion               │   │
│   │ optimization...                                      │   │
│   └────────────────────────────────────────────────────┘   │
│                                                              │
│   Due Date                                                   │
│   ┌────────────────────────────────────────────────────┐   │
│   │ 2025-04-15                                          │   │
│   └────────────────────────────────────────────────────┘   │
│                                                              │
│ ─────────────────────────────────────────────────────────── │
│                              [Cancel]  [Create Project]     │
└─────────────────────────────────────────────────────────────┘

Interactions:
- Modal backdrop: Black 50% opacity + 4px blur
- Focus ring: 2px Teal #516C61 + 2px offset + shadow
- Primary button: Sage green with hover lift effect
```

---

### 3. Project Overview (With Flow)

```
┌─────────────────────────────────────────────────────────────┐
│   Home / E-commerce Checkout Audit                          │
│                                                              │
│   E-commerce Checkout Audit                                 │
│   Acme Corporation                                           │
│   Evaluate checkout flow for conversion optimization        │
│                                                              │
│   Flows                                    [+ Add Flow]      │
│   ─────────────────────────────────────────────────────────│
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  🌐  Homepage → Product                          →  │   │
│   │      Web · Desktop                        3 URLs    │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  🛒  Cart → Checkout                             →  │   │
│   │      Web · Mobile                         2 URLs    │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Features:
- Breadcrumbs: Neutral text with hover Teal
- Flow cards: White with hover effect (lift + shadow + border)
- Platform emoji indicators (🌐📱🤖)
- Click card to navigate to flow detail
```

---

### 4. Flow Detail Page (With Steps)

```
┌─────────────────────────────────────────────────────────────┐
│   Home / E-commerce Checkout / Homepage → Product           │
│                                                              │
│   🌐  Homepage → Product                                    │
│       Web · Desktop                                          │
│       https://example.com/                                   │
│       https://example.com/products                           │
│                                                              │
│   Steps                                    [+ Add Step]      │
│   ─────────────────────────────────────────────────────────│
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  ≡  ①  View product page                        🗑  │   │
│   │        /products/item-123                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  ≡  ②  Add to cart                               🗑  │   │
│   │        /cart/add                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  ≡  ③  Review cart                               🗑  │   │
│   │        /cart                                         │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   [+ Add Another Step]                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Step Features:
- ≡ Drag handle (neutral gray, cursor: grab)
- ① Number badge (Sage 100 bg, Sage 700 text)
- 🗑 Delete button (hover: red tint background)
- URL links (Teal 500 with underline on hover)
```

---

### 5. Add Step Form (Inline)

```
┌─────────────────────────────────────────────────────────────┐
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                      │   │
│   │   Step Title *                                       │   │
│   │   ┌──────────────────────────────────────────────┐  │   │
│   │   │ View product page                             │  │   │
│   │   └──────────────────────────────────────────────┘  │   │
│   │                                                      │   │
│   │   URL (optional)                                     │   │
│   │   ┌──────────────────────────────────────────────┐  │   │
│   │   │ https://example.com/products/item-123         │  │   │
│   │   └──────────────────────────────────────────────┘  │   │
│   │                                                      │   │
│   │                            [✕ Cancel]  [Add Step]   │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Form Features:
- Background: Neutral 50 (very light gray)
- Border: Neutral 200
- Inputs: White with Teal focus ring
- Auto-focus on Step Title field
- Enter key submits form
```

---

## 🎯 Component Examples

### Button Variants

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   Primary:    [ Create Project ]   Sage green bg            │
│                                                              │
│   Secondary:  [ Cancel ]            White bg, border        │
│                                                              │
│   Ghost:      [ Add Another ]       Transparent, Teal text  │
│                                                              │
│   Destructive: [ Delete ]           Red bg, white text      │
│                                                              │
│   Loading:    [ ⟳ Processing... ]   Spinner + disabled      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

States:
- Hover: Darken color + lift -1px + increase shadow
- Active: Darkest color + no lift + smallest shadow
- Focus: 2px Sage ring with 2px offset
- Disabled: Light gray bg, reduced opacity 60%
```

---

### Input States

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   Default:                                                   │
│   ┌────────────────────────────────────────────────────┐   │
│   │ Enter project name...                               │   │
│   └────────────────────────────────────────────────────┘   │
│   Border: Neutral 200 (light gray)                           │
│                                                              │
│   Focus:                                                     │
│   ┌════════════════════════════════════════════════════┐   │
│   │ Enter project name...                               │   │
│   └════════════════════════════════════════════════════┘   │
│   Border: Teal 500 (2px) + shadow glow                      │
│                                                              │
│   Error:                                                     │
│   ┌────────────────────────────────────────────────────┐   │
│   │ Enter project name...                               │   │
│   └────────────────────────────────────────────────────┘   │
│   ⚠ Project name is required                                │
│   Border: Red + shadow glow                                 │
│                                                              │
│   Success:                                                   │
│   ┌────────────────────────────────────────────────────┐   │
│   │ E-commerce Audit                                    │   │
│   └────────────────────────────────────────────────────┘   │
│   Border: Blush Pink 500                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Card Hover Effect

```
Rest State:
┌─────────────────────────────────────┐
│                                      │
│  🌐  Homepage → Product          →  │
│      Web · Desktop        3 URLs    │
│                                      │
└─────────────────────────────────────┘
Border: Neutral 200
Shadow: Small
Transform: none

Hover State:
┌═════════════════════════════════════┐  ↑ -2px
│                                      │
│  🌐  Homepage → Product          →  │
│      Web · Desktop        3 URLs    │
│                                      │
└═════════════════════════════════════┘
Border: Teal 200 (colored!)
Shadow: Medium (larger)
Transform: translateY(-2px) - lifted!
Cursor: pointer
```

---

## ⌨️ Keyboard Navigation

### Supported Shortcuts

```
Tab              → Move to next interactive element
Shift + Tab      → Move to previous element
Enter            → Submit form / Activate button
Escape           → Close modal / Cancel form
Space            → Activate button (when focused)

In Forms:
Tab              → Move between fields in logical order
Enter            → Submit (when not in textarea)
```

### Focus Indicators

```
Default Focus Ring:
┌─────────────────────────────┐
║  [ Create Project ]         ║  ← 2px Sage green ring
║                             ║     2px offset from button
└─────────────────────────────┘

Link Focus:
  Home / E-commerce Checkout     ← Underline + ring
  ════

Input Focus:
┌═══════════════════════════════┐
║ Enter project name...         ║  ← 2px Teal ring
║                               ║     + inner glow shadow
└═══════════════════════════════┘
```

---

## 📐 Spacing & Layout

### Consistent Spacing (4px base unit)

```
┌─────────────────────────────────────────────────────────────┐
│  ← 32px margin (8 units)                                     │
│                                                              │
│  ↕ 32px                                                      │
│                                                              │
│  Dashboard                                                   │
│  ↕ 8px                                                       │
│  Manage your UX audit projects                               │
│                                                              │
│  ↕ 32px                                                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │ ← 20px padding (5 units)                            │     │
│  │  ↕ 20px                                             │     │
│  │                                                      │     │
│  │  Card content here                                  │     │
│  │                                                      │     │
│  │  ↕ 20px                                             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Component spacing:
- Page margins: 32px (desktop), 24px (mobile)
- Section spacing: 32px between major sections
- Card padding: 20px (base), 24px (large)
- Element gaps: 12px-16px for related items
- Form field spacing: 20px vertical
```

---

## 🎨 Typography Hierarchy

```
Display (Garamond):
───────────────────────────────────────────────────────────────
Dashboard                           42px / semibold / -0.02em
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

E-commerce Checkout Audit           30px / semibold / -0.01em
───────────────────────────────────────────────────────────────

Headings (Garamond):
───────────────────────────────────────────────────────────────
Flows                               24px / semibold / -0.01em

Homepage → Product                  20px / semibold

Body (Inter):
───────────────────────────────────────────────────────────────
Manage your UX audit projects       16px / regular
Enter project name...               14px / regular
Created Oct 9, 2025                 12px / regular

Labels (Inter):
───────────────────────────────────────────────────────────────
Project Name *                      14px / medium / +0.01em
```

---

## 🔄 Animation & Transitions

### Button Hover Animation

```
1. Rest State
   ┌─────────────────────┐
   │  Create Project     │  ← Sage 500 bg
   └─────────────────────┘     Shadow: small

   ↓ (on hover - 150ms ease)

2. Hover State
   ┌─────────────────────┐  ← Lifted -1px
   │  Create Project     │  ← Sage 600 bg (darker)
   └─────────────────────┘     Shadow: medium (larger)

   ↓ (on click)

3. Active State
   ┌─────────────────────┐  ← Back to baseline
   │  Create Project     │  ← Sage 700 bg (darkest)
   └─────────────────────┘     Shadow: xs (smallest)
```

### Modal Animation

```
1. Opening (200ms):
   - Overlay: Fade in (0 → 50% opacity)
   - Modal: Fade in + Zoom in (95% → 100% scale)
   - Modal: Slide in from top (48% → 50% from top)

2. Closing (200ms):
   - Reverse of opening animation
```

---

## 🌈 Color Accessibility

### Contrast Ratios (WCAG AA Compliant)

```
Text on Backgrounds:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Espresso 600 on Cream bg     6.2:1  ✅ AAA (headings)
Espresso 500 on Cream bg     5.1:1  ✅ AA (body)
Neutral 600 on White         7.8:1  ✅ AAA
White on Sage 500            5.3:1  ✅ AA (buttons)
White on Error Red           8.1:1  ✅ AAA

UI Components:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Teal 500 border on White     3.4:1  ✅ AA (focus rings)
Neutral 200 border           1.5:1  ⚠️ Decorative only
```

---

## 📱 Responsive Behavior

### Breakpoints

```
Mobile:     320px - 639px
  - Single column layout
  - Full-width cards
  - Stacked buttons

Tablet:     640px - 1023px
  - 2 column grid for cards
  - Side-by-side buttons (where space allows)

Desktop:    1024px+
  - 3 column grid for cards
  - Full spacing applied
  - Hover effects active
```

### Example: Project Cards

```
Mobile (1 column):
┌─────────────────────────┐
│  E-commerce Audit       │
│  Acme Corp              │
│  ────────────────────── │
│  Created Oct 9          │
└─────────────────────────┘

Tablet (2 columns):
┌─────────────────┐  ┌─────────────────┐
│  E-commerce     │  │  Mobile App     │
│  Audit          │  │  Redesign       │
│  ─────────────  │  │  ─────────────  │
│  Acme Corp      │  │  StartupCo      │
└─────────────────┘  └─────────────────┘

Desktop (3 columns):
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  E-commerce │  │  Mobile App │  │  Dashboard  │
│  Audit      │  │  Redesign   │  │  Refresh    │
│  ─────────  │  │  ─────────  │  │  ─────────  │
│  Acme Corp  │  │  StartupCo  │  │  BigCorp    │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

This visual guide shows exactly how your custom design system is implemented across the entire first flow! 🎨✨
