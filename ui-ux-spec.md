# UX Audit MVP - UI/UX Specification

## Design Philosophy

**Core Principles:**
- **Clarity over cleverness** - Every element serves a purpose
- **Speed of capture** - Minimal clicks to add findings
- **Progressive disclosure** - Show complexity only when needed
- **Professional polish** - Clients trust polished tools
- **Accessible by default** - WCAG AA compliance is non-negotiable

---

## Design System

### Color Palette

#### Background
```
Page Background: #F5F1EA  (Warm cream, sophisticated base)
Card Background: #FFFFFF  (Pure white for contrast)
Card Hover:     #FDFCFA  (Subtle warm tint)
```

#### Brand Colors

**Sage Green** (Primary, Professional & Calm)
```
- 50:  #F4F6F5
- 100: #E8EBE9
- 200: #D1D7D3
- 300: #BAC3BD
- 400: #A3AFA7
- 500: #8C8C5A  (Primary brand color)
- 600: #707048  (Primary hover)
- 700: #545436  (Primary active)
- 800: #383824
- 900: #1C1C12
```

**Forest Teal** (Secondary, Trust & Depth)
```
- 50:  #F1F4F3
- 100: #E3E9E7
- 200: #C7D3CF
- 300: #ABBDB7
- 400: #8FA79F
- 500: #516C61  (Accents, secondary actions)
- 600: #41564E  (Hover)
- 700: #31413B  (Active)
- 800: #202B28
- 900: #101614
```

**Blush Pink** (Accent, Warmth & Highlight)
```
- 50:  #FEF8F6
- 100: #FDF1ED
- 200: #FBE3DB
- 300: #F9D5C9
- 400: #F7C7B7
- 500: #F0C2B4  (Highlights, success states)
- 600: #C09B90  (Hover)
- 700: #90746C  (Active)
- 800: #604E48
- 900: #302724
```

**Espresso** (Dark, Authority & Text)
```
- 50:  #F3F1F0
- 100: #E7E3E1
- 200: #CFC7C3
- 300: #B7ABA5
- 400: #9F8F87
- 500: #3A2A28  (Primary text, dark elements)
- 600: #2E2220  (Headings)
- 700: #231918
- 800: #171110
- 900: #0C0908
```

**Goldenrod** (Warning, Energy & Attention)
```
- 50:  #FCF9F1
- 100: #F9F3E3
- 200: #F3E7C7
- 300: #EDDBAB
- 400: #E7CF8F
- 500: #D8B466  (Warnings, medium priority)
- 600: #AD9052  (Hover)
- 700: #826C3E  (Active)
- 800: #56482A
- 900: #2B2415
```

#### Semantic Colors (Enhanced)
```
Success: Blush Pink #F0C2B4 (warm, positive)
Warning: Goldenrod #D8B466 (attention, caution)
Error:   Espresso #3A2A28 with red tint #8B3A3A (critical)
Info:    Forest Teal #516C61 (informative, calm)
```

#### Neutral Tones (Warm Gray)
```
- 50:  #FAFAF9  (Lightest elements)
- 100: #F5F5F4  (Subtle backgrounds)
- 200: #E7E5E4  (Borders)
- 300: #D6D3D1  (Disabled states)
- 400: #A8A29E  (Placeholder text)
- 500: #78716C  (Secondary text)
- 600: #57534E  (Body text)
- 700: #44403C  (Emphasis)
- 800: #292524  (Strong emphasis)
- 900: #1C1917  (Darkest text)
```

### Typography

#### Font Families
```css
Headings: 'EB Garamond', 'Garamond', 'Georgia', serif
Body:     'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Mono:     'JetBrains Mono', 'Fira Code', 'Courier New', monospace
```

#### Type Scale
```
Display (Garamond):
- 4xl: 42px / 48px (2.625rem / 3rem) - weight 600 - letter-spacing: -0.02em
- 3xl: 36px / 42px (2.25rem / 2.625rem) - weight 600 - letter-spacing: -0.01em
- 2xl: 30px / 38px (1.875rem / 2.375rem) - weight 600 - letter-spacing: -0.01em

Heading (Garamond):
- xl:   24px / 32px (1.5rem / 2rem) - weight 600 - letter-spacing: -0.01em
- lg:   20px / 28px (1.25rem / 1.75rem) - weight 600 - letter-spacing: 0
- base: 18px / 26px (1.125rem / 1.625rem) - weight 600 - letter-spacing: 0

Body (Inter):
- lg:   18px / 28px (1.125rem / 1.75rem) - weight 400
- base: 16px / 24px (1rem / 1.5rem) - weight 400
- sm:   14px / 20px (0.875rem / 1.25rem) - weight 400
- xs:   12px / 16px (0.75rem / 1rem) - weight 400

Labels (Inter):
- base: 14px / 20px (0.875rem / 1.25rem) - weight 500 - letter-spacing: 0.01em
- sm:   12px / 16px (0.75rem / 1rem) - weight 500 - letter-spacing: 0.02em
```

**Font Notes:**
- Garamond adds editorial sophistication for headings and key labels
- Slightly larger sizes for Garamond to maintain readability
- Negative letter-spacing on large Garamond sizes for elegance
- Inter remains for body text for optimal screen readability

### Spacing System
```
Base unit: 4px (0.25rem)

Scale:
- 0:   0px
- 1:   4px   (0.25rem)
- 2:   8px   (0.5rem)
- 3:   12px  (0.75rem)
- 4:   16px  (1rem)      [Base spacing]
- 5:   20px  (1.25rem)
- 6:   24px  (1.5rem)
- 8:   32px  (2rem)
- 10:  40px  (2.5rem)
- 12:  48px  (3rem)
- 16:  64px  (4rem)
- 20:  80px  (5rem)
- 24:  96px  (6rem)

Common usage:
- Element padding: 12px-16px
- Section padding: 24px-32px
- Page margins: 32px-48px
- Component spacing: 16px-24px
```

### Elevation & Shadows

```css
Shadow scale:
- xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  Usage: Subtle depth (cards at rest)

- sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
  Usage: Default cards, dropdowns

- md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
  Usage: Elevated cards (hover), popovers

- lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
  Usage: Modals, dialogs

- xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
  Usage: Large overlays, important modals

- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
  Usage: Overlay panels
```

### Border Radius

```
- none: 0
- sm:   2px   (0.125rem)   [Input fields, tight UI]
- base: 6px   (0.375rem)   [Buttons, badges]
- md:   8px   (0.5rem)     [Cards, panels]
- lg:   12px  (0.75rem)    [Large containers]
- xl:   16px  (1rem)       [Modal corners]
- 2xl:  24px  (1.5rem)     [Hero sections]
- full: 9999px             [Pills, avatars]
```

### Icons

**Icon System**: Lucide React (consistent, lightweight, accessible)

**Icon Sizes**:
```
- xs:   12px  (0.75rem)
- sm:   16px  (1rem)
- base: 20px  (1.25rem)
- lg:   24px  (1.5rem)
- xl:   32px  (2rem)
```

**Common Icons**:
- Navigation: ChevronRight, ChevronDown, Menu, X
- Actions: Plus, Edit, Trash2, Save, Download, Upload, Share2
- Status: CheckCircle, AlertCircle, AlertTriangle, Info
- Flow: ArrowRight, ArrowUp, ArrowDown, Move
- Media: Image, Camera, Eye, EyeOff
- Filters: Filter, Search, SortAsc, SortDesc

---

## Component Library

### 1. Buttons

#### Variants

**Primary Button** (Main actions)
```
Default:
- Background: Sage Green-500 (#8C8C5A)
- Text: White
- Padding: 10px 20px (sm), 12px 24px (base), 14px 28px (lg)
- Border-radius: base (6px)
- Font: 14px/500 (sm), 16px/500 (base) - Inter
- Shadow: sm

Hover:
- Background: Sage Green-600 (#707048)
- Shadow: md
- Transform: translateY(-1px)

Active/Pressed:
- Background: Sage Green-700 (#545436)
- Shadow: xs
- Transform: translateY(0)

Disabled:
- Background: Neutral-200 (#E7E5E4)
- Text: Neutral-400 (#A8A29E)
- Cursor: not-allowed
- Opacity: 0.6

Loading:
- Background: Sage Green-500 (#8C8C5A)
- Show spinner + "Processing..."
- Cursor: wait
- Disabled state
```

**Secondary Button** (Alternative actions)
```
Default:
- Background: White
- Border: 1.5px solid Neutral-300 (#D6D3D1)
- Text: Espresso-500 (#3A2A28)
- Hover: Background #FDFCFA, Border Forest Teal-500 (#516C61)
```

**Ghost Button** (Subtle actions)
```
Default:
- Background: Transparent
- Text: Forest Teal-500 (#516C61)
- Hover: Background Forest Teal-50 (#F1F4F3)
```

**Destructive Button** (Delete, remove actions)
```
Default:
- Background: #8B3A3A (Error red tint)
- Text: White
- Hover: Background: #6B2C2C
```

**Icon Button**
```
Size: 36x36px (base), 40x40px (lg)
Padding: 8px
Border-radius: base (6px)
Icon size: 20px (base)
```

#### States
- Default, Hover, Active, Focus (outline ring), Disabled, Loading

#### Accessibility
- Min touch target: 44x44px
- Focus ring: 2px Sage Green-500 (#8C8C5A) with 2px offset
- ARIA: `aria-label` for icon-only, `aria-busy` for loading

---

### 2. Form Inputs

#### Text Input
```
Default:
- Height: 40px (base), 36px (sm), 44px (lg)
- Padding: 10px 12px
- Background: White
- Border: 1.5px solid Neutral-200 (#E7E5E4)
- Border-radius: base (6px)
- Font: 14px/400 (sm), 16px/400 (base) - Inter
- Text color: Espresso-500 (#3A2A28)

Focus:
- Border: 2px solid Forest Teal-500 (#516C61)
- Outline: none
- Shadow: 0 0 0 3px rgba(81, 108, 97, 0.12)

Error:
- Border: 2px solid #8B3A3A
- Shadow: 0 0 0 3px rgba(139, 58, 58, 0.12)

Success:
- Border: 2px solid Blush Pink-500 (#F0C2B4)

Disabled:
- Background: Neutral-100 (#F5F5F4)
- Text: Neutral-400 (#A8A29E)
- Cursor: not-allowed
```

**With Icon** (Search, etc.)
```
Icon position: Left or right
Icon size: 20px
Icon color: Neutral-400
Padding adjustment: Add 32px to icon side
```

#### Textarea
```
Same as text input but:
- Min height: 100px
- Resize: vertical
- Padding: 12px
```

#### Select Dropdown
```
Same as text input with:
- Chevron icon (right, 20px)
- Dropdown panel: White, Shadow-lg, Border-radius-md
- Options: 40px height, hover Primary-50
- Selected: Background Primary-100, Text Primary-700
- Max height: 300px with scroll
```

#### Checkbox & Radio
```
Size: 20x20px
Border: 2px solid Neutral-400
Border-radius: 4px (checkbox), full (radio)

Checked:
- Background: Primary-600
- Border: Primary-600
- Checkmark: White, 14px

Focus:
- Ring: 2px Primary-500 with 2px offset

Disabled:
- Border: Neutral-300
- Background: Neutral-100 (when checked)
```

#### Toggle Switch
```
Track: 44x24px, Border-radius full
Thumb: 20x20px circle, 2px margin

Off: Background Neutral-300
On: Background Primary-600
Transition: 150ms ease
```

#### Label
```
Font: 14px/500
Color: Neutral-700
Margin-bottom: 6px
Required indicator: Red asterisk
```

#### Helper Text
```
Font: 12px/400
Color: Neutral-500 (default), Error-600 (error), Success-600 (success)
Margin-top: 4px
```

#### Validation
- Inline validation on blur
- Error message with icon (AlertCircle)
- Success checkmark for confirmed fields
- Real-time validation for password strength, username availability

---

### 3. Cards

#### Base Card
```
Background: White
Border: 1px solid Neutral-200
Border-radius: md (8px)
Padding: 20px (base), 24px (lg)
Shadow: sm

Hover (if interactive):
- Shadow: md
- Border: Primary-200
- Transform: translateY(-2px)
- Transition: 150ms ease
```

#### Card Header
```
Margin-bottom: 16px
Border-bottom: 1px solid Neutral-200
Padding-bottom: 12px

Title: 18px/600, Neutral-900
Subtitle: 14px/400, Neutral-600
Actions: Right-aligned icon buttons
```

#### Card Content
```
Padding: 0 (use card padding)
Typography: Body-base
```

#### Card Footer
```
Margin-top: 16px
Padding-top: 12px
Border-top: 1px solid Neutral-200
Display: flex, justify: space-between
```

---

### 4. Badges & Tags

#### Badge
```
Sizes:
- sm: 20px height, 6px 8px padding, 12px font
- base: 24px height, 8px 12px padding, 14px font

Border-radius: base (6px) or full for pills

Variants:
- Default: Neutral-100 bg, Neutral-700 text
- Primary: Primary-100 bg, Primary-700 text
- Success: Success-100 bg, Success-700 text
- Warning: Warning-100 bg, Warning-700 text
- Error: Error-100 bg, Error-700 text

With dot indicator:
- 6px circle, left of text, 4px margin
```

#### Severity Badge (for Issues)
```
Critical: #8B3A3A bg, White text, bold
High: Goldenrod-500 (#D8B466) bg, Espresso-600 (#2E2220) text
Medium: Goldenrod-100 (#F9F3E3) bg, Goldenrod-800 (#56482A) text
Low: Neutral-100 (#F5F5F4) bg, Neutral-700 (#44403C) text
```

#### Priority Badge (for Recommendations)
```
High: Goldenrod-500 (#D8B466) bg, Espresso-600 (#2E2220) text, "!" icon
Medium: Goldenrod-100 (#F9F3E3) bg, Goldenrod-800 (#56482A) text
Low: Blush Pink-100 (#FDF1ED) bg, Blush Pink-700 (#90746C) text
```

#### Score Badge (for Ratings)
```
1-2 (Poor): #8B3A3A bg, White text
2.5-3.5 (Fair): Goldenrod-100 (#F9F3E3) bg, Goldenrod-800 (#56482A) text
3.5-4.5 (Good): Blush Pink-100 (#FDF1ED) bg, Blush Pink-700 (#90746C) text
4.5-5 (Excellent): Sage Green-500 (#8C8C5A) bg, White text

Include numeric score + descriptive text
Example: "3.2 Fair" or "4.8 Excellent"
Font: Garamond for number, Inter for label
```

---

### 5. Modals & Dialogs

#### Modal Structure
```
Overlay:
- Background: rgba(0, 0, 0, 0.5)
- Backdrop blur: 4px
- z-index: 50

Panel:
- Background: White
- Max-width: 500px (sm), 700px (md), 900px (lg)
- Max-height: 90vh
- Border-radius: xl (16px)
- Shadow: 2xl
- Padding: 32px
- Margin: 48px auto
- Overflow: auto
```

#### Modal Header
```
Padding-bottom: 20px
Border-bottom: 1px solid Neutral-200
Margin-bottom: 24px

Title: 24px/600, Neutral-900
Close button: Top-right, icon button, X icon
```

#### Modal Footer
```
Padding-top: 20px
Border-top: 1px solid Neutral-200
Margin-top: 24px
Display: flex, justify-end, gap 12px

Primary action on right
Secondary action to left of primary
Cancel always leftmost
```

#### Confirmation Dialog
```
Icon: AlertTriangle (warning), 48px, Warning-500
Title: "Are you sure?"
Description: Plain explanation of consequence
Actions: Destructive primary + Ghost cancel
```

---

### 6. Toast Notifications

```
Position: Fixed top-right, 24px margin
Width: 400px max
Stack: Newest on top, max 3 visible

Container:
- Background: White
- Border-left: 4px solid [variant color]
- Border-radius: md (8px)
- Shadow: lg
- Padding: 16px 20px
- Animation: Slide in from right, fade out

Icon: 20px, left-aligned
- Success: CheckCircle, Success-500
- Error: AlertCircle, Error-500
- Warning: AlertTriangle, Warning-500
- Info: Info, Info-500

Content:
- Title: 14px/600, Neutral-900
- Message: 14px/400, Neutral-600
- Max 2 lines, truncate with ellipsis

Close: Icon button, top-right

Duration:
- Success: 4 seconds
- Error: 6 seconds (dismissible only)
- Warning: 5 seconds
- Info: 4 seconds

Action button (optional):
- Ghost button, inline after message
```

---

### 7. Tables & Lists

#### Data Table
```
Container:
- Background: White
- Border: 1px solid Neutral-200
- Border-radius: md (8px)
- Overflow: auto

Header Row:
- Background: Neutral-50
- Border-bottom: 2px solid Neutral-200
- Sticky top on scroll
- Height: 48px
- Font: 12px/600 uppercase, Neutral-600
- Letter-spacing: 0.5px

Body Row:
- Height: 56px (base), 64px (comfortable)
- Border-bottom: 1px solid Neutral-200
- Hover: Background Neutral-50
- Selected: Background Primary-50

Cell:
- Padding: 12px 16px
- Vertical-align: middle
- Font: 14px/400

Actions Column:
- Right-aligned
- Icon buttons, visible on row hover
- Dropdown menu for 3+ actions
```

#### List View (Issues, Recommendations)
```
Item:
- Background: White
- Border: 1px solid Neutral-200
- Border-radius: md (8px)
- Padding: 16px 20px
- Margin-bottom: 12px
- Hover: Border Primary-200, Shadow-sm

Layout:
- Header: Title (16px/600) + Badges
- Meta: Timestamp, owner, etc. (12px/400, Neutral-500)
- Content: Description truncated to 2 lines
- Footer: Actions + linked items count
```

---

### 8. Navigation

#### Sidebar
```
Width: 240px (collapsed: 64px)
Background: Neutral-900
Color: White
Height: 100vh
Position: Fixed left

Logo section:
- Height: 64px
- Padding: 16px
- Border-bottom: 1px solid Neutral-800

Nav items:
- Height: 40px
- Padding: 10px 16px
- Border-radius: base (6px)
- Margin: 4px 8px
- Icon: 20px, left-aligned
- Font: 14px/500

Active:
- Background: Primary-600
- Icon + text: White

Hover:
- Background: Neutral-800

Collapsed:
- Show icon only
- Tooltip on hover
```

#### Breadcrumbs
```
Height: 32px
Font: 14px/400, Neutral-600
Separator: ChevronRight icon, 16px, Neutral-400

Current page: Neutral-900, 600 weight
Previous: Clickable, hover Primary-600
Max items: 4, truncate middle with "..."
```

#### Tabs
```
Container:
- Border-bottom: 2px solid Neutral-200

Tab:
- Padding: 12px 16px
- Font: 14px/500
- Color: Neutral-600
- Border-bottom: 2px solid transparent
- Margin-bottom: -2px

Active:
- Color: Primary-600
- Border-bottom-color: Primary-600

Hover:
- Color: Primary-500
- Background: Primary-50
```

---

### 9. Special Components

#### Rating Grid (Heuristic Scoring)
```
Layout: Table or grid
Rows: Heuristics (10)
Columns: Rating 1-5

Cell (Radio button styled):
- Size: 48x48px
- Border: 2px solid Neutral-300
- Border-radius: base (6px)
- Hover: Border Primary-400, Background Primary-50
- Selected: Background Primary-600, White text, bold
- Disabled: Neutral-200 bg, Neutral-400 text

Rating label:
- Below radio: "Critical" (1) → "Excellent" (5)
- 10px/500 font

Heuristic label:
- Left column, 14px/600
- Tooltip icon with definition

Score summary:
- Right column or bottom row
- Weighted calculation displayed
- Large badge with color coding
```

#### Priority Matrix (Impact x Effort)
```
2D Grid: 3x3 (High/Med/Low for each axis)

Layout:
- X-axis (bottom): Effort (Low → High)
- Y-axis (left): Impact (High → Low)

Cells:
- Background: Color-coded by priority
  - High priority (top-left): Error-100
  - Medium priority (diagonal): Warning-100
  - Low priority (bottom-right): Neutral-100
- Padding: 16px
- Border: 1px solid Neutral-200
- Min-height: 120px

Recommendation cards inside:
- Compact: 200x80px
- Title only, truncate
- Draggable to reposition
- Count badge if >3 items
```

#### Screenshot Gallery
```
Grid: 3 columns (desktop), 2 (tablet), 1 (mobile)
Gap: 16px

Thumbnail:
- Aspect ratio: 16:9 or auto
- Max height: 200px
- Border: 1px solid Neutral-200
- Border-radius: md (8px)
- Hover: Shadow-md, scale(1.02)
- Cursor: pointer

Evidence badge:
- Top-right corner
- Count of annotations
- Primary-600 bg, White text
- 24px circle

Lightbox:
- Full overlay, black background (90% opacity)
- Image: Max 90vw x 90vh
- Navigation arrows: Left/right
- Close: Top-right X button
- Annotation overlay visible
- Download button
```

#### Annotation Editor
```
Canvas overlay on image

Toolbar (top):
- Background: White
- Shadow: md
- Border-radius: base (6px)
- Padding: 8px
- Gap: 4px

Tools:
- Select/Move (default)
- Rectangle
- Highlight (semi-transparent)
- Arrow
- Text callout
- Blur/Redact

Tool button:
- 36x36px icon button
- Active: Primary-600 bg, White icon

Properties panel:
- Color picker: 8 preset colors
- Stroke width: 1-5px slider
- Text size: sm/base/lg

Actions:
- Undo/Redo
- Clear all (with confirmation)
- Save
- Cancel

Canvas:
- Cursor changes per tool
- Snap to pixel for crisp lines
- Real-time preview while dragging
```

---

## Key Screen Layouts

### 1. Dashboard (Project List)

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Dashboard                            [+ New]   │
│            │  ────────────────────────────────────           │
│            │                                                  │
│  Projects  │  ┌─────────────┐  ┌─────────────┐             │
│  Settings  │  │ Project A   │  │ Project B   │             │
│            │  │ Client XYZ  │  │ Client ABC  │             │
│            │  │ ──────────  │  │ ──────────  │             │
│            │  │ Score: 3.4  │  │ Score: 4.1  │             │
│            │  │ 12 Issues   │  │ 5 Issues    │             │
│            │  │ Due: Apr 15 │  │ Due: Apr 20 │             │
│            │  └─────────────┘  └─────────────┘             │
│            │                                                  │
│            │  ┌─────────────┐                               │
│            │  │ Project C   │                               │
│            │  │ Client DEF  │                               │
│            │  │ ──────────  │                               │
│            │  │ Not rated   │                               │
│            │  │ 0 Issues    │                               │
│            │  │ Due: Apr 25 │                               │
│            │  └─────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Header: "Dashboard" + New Project button (primary, top-right)
- Project cards: Grid (3 cols desktop, 2 tablet, 1 mobile)
- Empty state: Centered, illustration + "Create your first project" CTA
- Filters: Quick filter tabs (All, Active, Completed, Overdue)

---

### 2. Project Overview

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Home > Project Name              [•••]         │
│            │  ─────────────────────────────────             │
│            │                                                  │
│            │  ┌──────────────┐ ┌──────────────┐             │
│            │  │ Overall Score│ │ Top Issues   │             │
│            │  │              │ │              │             │
│            │  │    3.4 ⭐    │ │ 1. Login...  │             │
│            │  │    Fair      │ │ 2. Cart...   │             │
│            │  └──────────────┘ │ 3. Search... │             │
│            │                   └──────────────┘             │
│            │  ┌─────────────────────────────────────────┐   │
│            │  │ Flows                                    │   │
│            │  │ ───────────────────────────────────────  │   │
│            │  │ 📱 Homepage → Product  [3.2 Fair    ]   │   │
│            │  │ 🛒 Cart → Checkout     [2.8 Poor    ]   │   │
│            │  │ 👤 Account Creation    [4.1 Good    ]   │   │
│            │  └─────────────────────────────────────────┘   │
│            │                                                  │
│            │  ┌─────────────────────────────────────────┐   │
│            │  │ Recommendations              [View All→]│   │
│            │  │ ───────────────────────────────────────  │   │
│            │  │ • Fix cart button label (High priority) │   │
│            │  │ • Add search filters (Med priority)     │   │
│            │  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Breadcrumbs: Home > Project Name
- Actions menu (•••): Share, Export, Settings, Delete
- Stats cards: 2-3 cols, score + counts
- Flow list: Sortable, clickable rows
- Quick actions: "Add Flow", "View All Issues", "Share Dashboard"

---

### 3. Flow Detail

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Home > Project > Flow Name      [Rate Flow]   │
│            │  ─────────────────────────────────             │
│            │                                                  │
│            │  [Steps] [Issues (5)] [Ratings]                │
│            │  ━━━━━━                                        │
│            │                                                  │
│            │  Steps                            [+ Add Step]  │
│            │  ──────────────────────────────────            │
│            │  1. ≡ View product page                        │
│            │     🔗 /products/item-123                       │
│            │     💬 2 issues                                 │
│            │                                                  │
│            │  2. ≡ Add to cart                              │
│            │     🔗 /cart/add                                │
│            │     💬 1 issue                                  │
│            │                                                  │
│            │  3. ≡ Review cart                              │
│            │     🔗 /cart                                    │
│            │     💬 0 issues                                 │
│            │                                                  │
│            │  [Inline: Click step to expand and add issue]  │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Tab navigation: Steps / Issues / Ratings
- Steps list: Drag handle (≡), expandable, inline issue count
- Expanded step: Shows linked issues + "Add Issue" button
- Rate Flow button: Opens modal with heuristic grid

---

### 4. Issue Form (Right Panel)

```
┌─────────────────────────────────────────────────────────────┐
│                                       │  Add Issue      [X]  │
│                                       │  ──────────────      │
│                                       │                      │
│                                       │  Title *             │
│                                       │  [________________]  │
│                                       │                      │
│                                       │  Description *       │
│                                       │  [________________]  │
│                                       │  [________________]  │
│                                       │  [________________]  │
│                                       │                      │
│                                       │  Severity *          │
│                                       │  ( ) Critical        │
│                                       │  ( ) High            │
│                                       │  (•) Medium          │
│                                       │  ( ) Low             │
│                                       │                      │
│                                       │  Heuristic           │
│                                       │  [Select...      ▾]  │
│                                       │                      │
│                                       │  Link to Step        │
│                                       │  [Step 1: View... ▾] │
│                                       │                      │
│                                       │  Screenshots         │
│                                       │  [+ Upload or Drag]  │
│                                       │                      │
│                                       │  ──────────────      │
│                                       │  [Cancel] [Save]     │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Slide-in panel: 480px wide, right side, full height
- Sticky footer: Actions always visible
- Upload zone: Drag-and-drop with preview thumbnails
- Validation: Inline errors on blur, highlight required fields

---

### 5. Rating Modal

```
┌─────────────────────────────────────────────────────────────┐
│                 Rate Flow: Homepage → Product               │
│                 ─────────────────────────────────            │
│                                                              │
│  Rate each heuristic from 1 (Critical) to 5 (Excellent)     │
│                                                              │
│  Heuristic                      1    2    3    4    5       │
│  ─────────────────────────────────────────────────────────  │
│  Visibility of system status  [ ]  [ ]  [•]  [ ]  [ ]  ℹ️   │
│  Match system & real world    [ ]  [•]  [ ]  [ ]  [ ]  ℹ️   │
│  User control & freedom       [ ]  [ ]  [ ]  [•]  [ ]  ℹ️   │
│  Consistency & standards      [ ]  [ ]  [•]  [ ]  [ ]  ℹ️   │
│  Error prevention             [•]  [ ]  [ ]  [ ]  [ ]  ℹ️   │
│  ...                          [ ]  [ ]  [ ]  [ ]  [ ]  ℹ️   │
│                                                              │
│  ──────────────────────────────────────────────────────     │
│  Overall Score (weighted):  3.2 Fair                        │
│  ──────────────────────────────────────────────────────     │
│                                                              │
│                                      [Cancel] [Save Rating] │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Modal: 800px wide, centered
- Grid layout: Fixed column widths for alignment
- Info icon: Tooltip with heuristic definition on hover
- Live score: Updates as you select ratings
- Save disabled: Until all heuristics rated

---

### 6. Recommendations Page

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Home > Project > Recommendations  [+ New]     │
│            │  ─────────────────────────────────             │
│            │                                                  │
│            │  [List View] [Priority Matrix]                 │
│            │  ━━━━━━━━━━                                    │
│            │                                                  │
│            │  Filters: [All Statuses ▾] [All Impacts ▾]     │
│            │  ──────────────────────────────────            │
│            │                                                  │
│            │  ┌─────────────────────────────────────────┐   │
│            │  │ 🔴 Fix cart button label                │   │
│            │  │ Impact: High • Effort: Low • Status: ... │   │
│            │  │ Linked to 2 issues                      │   │
│            │  │ "Update 'Submit' to 'Add to Cart' for..." │   │
│            │  └─────────────────────────────────────────┘   │
│            │                                                  │
│            │  ┌─────────────────────────────────────────┐   │
│            │  │ 🟡 Add search result filters            │   │
│            │  │ Impact: Med • Effort: Med • Status: ... │   │
│            │  │ Linked to 1 issue                       │   │
│            │  │ "Provide category and price filters..." │   │
│            │  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- View toggle: List (default) vs Matrix
- Filters: Multi-select dropdowns
- Recommendation cards: Expandable for full description
- Priority indicator: Color-coded dot + badge
- Bulk actions: Select multiple → "Mark as Accepted"

---

### 7. Shared Dashboard (Client View)

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 Project Name - UX Audit Report                          │
│  Shared by Auditor Name • Last updated 2 hours ago          │
│  ──────────────────────────────────────────────────────     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Score    │  │ Issues   │  │ Flows    │                  │
│  │  3.4     │  │    12    │  │    3     │                  │
│  │  Fair    │  │  5 High  │  │  Audited │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│  Top Recommendations                        [Download PDF]  │
│  ──────────────────────────────────────────────────────     │
│  1. 🔴 Fix cart button label (High priority)                │
│  2. 🟡 Add search filters (Medium priority)                 │
│  3. 🟢 Improve footer links (Low priority)                  │
│                                                              │
│  Flow Scores                                 [Filter by...] │
│  ──────────────────────────────────────────────────────     │
│  📱 Homepage → Product     3.2 Fair     [View Issues]       │
│  🛒 Cart → Checkout        2.8 Poor     [View Issues]       │
│  👤 Account Creation       4.1 Good     [View Issues]       │
│                                                              │
│  Evidence Gallery                              [View All→]  │
│  ──────────────────────────────────────────────────────     │
│  [Screenshot] [Screenshot] [Screenshot] [Screenshot]        │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Read-only: No edit actions
- Branding: Optional client logo space (top-left)
- Export: Download PDF button (prominent)
- Filters: By flow, severity, status
- Clean layout: Focus on findings, minimal chrome

---

## User Flows

### Flow 1: Create Project & First Flow

```
1. Dashboard → Click "+ New Project"
   ↓
2. Project Setup Modal
   - Enter project name (required)
   - Enter client name (required)
   - Enter audit goal (optional)
   - Select due date (optional)
   - Click "Create Project"
   ↓
3. Project Overview (Empty State)
   - See "No flows yet" message
   - Click "Add First Flow" button
   ↓
4. Add Flow Modal
   - Enter flow name (e.g., "Homepage to Product")
   - Select platform (Web/iOS/Android)
   - Select device (Desktop/Mobile/Tablet)
   - Add URL(s) (optional, can add multiple)
   - Click "Create Flow"
   ↓
5. Flow Detail Page (Empty State)
   - See "No steps yet" message
   - Click "Add First Step"
   ↓
6. Add Step (Inline Form)
   - Enter step title
   - Enter URL (optional)
   - Click "Save"
   - Repeat for all steps
   ↓
7. See populated flow
   - Steps listed in order
   - Ready to add issues
```

**Success Criteria:**
- Project created in < 30 seconds
- Flow created in < 20 seconds
- Steps added in < 10 seconds each
- Clear progress through onboarding

---

### Flow 2: Capture Issue with Screenshot

```
1. Flow Detail Page → Expand Step 1
   ↓
2. Click "Add Issue" button
   ↓
3. Right Panel Opens
   - Enter title (e.g., "Unlabeled search button")
   - Enter description
   - Select severity (High)
   - Select heuristic (Recognition over Recall)
   - Step pre-selected (Step 1)
   ↓
4. Upload Screenshot
   - Click "+ Upload or Drag"
   - Select file from computer
   - See thumbnail preview
   - Click thumbnail to annotate
   ↓
5. Annotation Editor Opens
   - Select Rectangle tool
   - Draw rectangle around issue
   - Select Arrow tool
   - Draw arrow pointing to problem
   - Select Text tool
   - Add callout: "No label for icon"
   - Select color: Red
   - Click "Save Annotations"
   ↓
6. Back to Issue Form
   - See annotated screenshot thumbnail
   - Click "Save Issue"
   ↓
7. Issue Card Appears
   - Shows in step's issue list
   - Badge shows "1 screenshot"
   - Can click to view/edit
```

**Success Criteria:**
- Issue captured in < 2 minutes
- Screenshot uploaded and annotated in < 1 minute
- Annotations clearly highlight problem
- Evidence immediately visible in issue card

---

### Flow 3: Rate Flow

```
1. Flow Detail Page → Click "Rate Flow" button
   ↓
2. Rating Modal Opens
   - See 10 heuristics in grid
   - See rating scale 1-5 with labels
   - Hover info icon to see heuristic definition
   ↓
3. Rate Each Heuristic
   - Click rating for "Visibility of system status": 3
   - Click rating for "Match system & real world": 2
   - ... continue for all 10
   - See overall score calculate live
   ↓
4. Review Overall Score
   - See "3.2 Fair" badge
   - Verify calculations
   - Click "Save Rating"
   ↓
5. Return to Flow Detail
   - See flow score badge updated
   - See score in project overview
   - Toast: "Flow rated successfully"
```

**Success Criteria:**
- Rating completed in < 3 minutes
- All heuristics rated (validation)
- Score calculation visible and accurate
- Flow score reflected across app immediately

---

### Flow 4: Create Recommendation

```
1. Project Overview → Click "Recommendations" tab
   ↓
2. Recommendations Page → Click "+ New"
   ↓
3. Recommendation Form (Right Panel)
   - Enter title: "Fix cart button label"
   - Enter description: "Update 'Submit' to 'Add to Cart'..."
   - Select impact: High
   - Select effort: Low
   - See priority auto-calculate: High
   - Click "Link Issues"
   ↓
4. Issue Selection Modal
   - See list of all project issues
   - Select 2 related issues
   - Click "Link Selected"
   ↓
5. Back to Form
   - See "Linked to 2 issues"
   - Optionally add target owner
   - Click "Save Recommendation"
   ↓
6. Recommendation Card Appears
   - Shows in list with High priority badge
   - Shows in Priority Matrix (top-left quadrant)
   - Toast: "Recommendation created"
```

**Success Criteria:**
- Recommendation created in < 2 minutes
- Priority calculated correctly from impact x effort
- Linked issues visible
- Appears in correct matrix position

---

### Flow 5: Share Dashboard

```
1. Project Overview → Click "Share" button (••• menu)
   ↓
2. Share Settings Modal
   - Toggle "Enable sharing": ON
   - See generated share link
   - Optional: Add password protection
   - Optional: Set expiration date
   - Choose visible sections:
     [✓] Overview stats
     [✓] Top recommendations
     [✓] Flow scores
     [✓] Evidence gallery
     [ ] Raw issue list (hidden by default)
   - Click "Copy Link"
   ↓
3. Confirmation
   - Toast: "Link copied to clipboard"
   - See "Active share" badge on project
   - Activity log records share action
   ↓
4. Client Opens Link
   - No login required
   - Password prompt if protected
   - See read-only dashboard
   - Can filter and download PDF
```

**Success Criteria:**
- Link generated in < 10 seconds
- One-click copy to clipboard
- Client can access without account
- Sections configurable

---

### Flow 6: Export PDF

```
1. Project Overview → Click "Export" button
   ↓
2. Export Settings Modal
   - Select format: PDF (default) or CSV
   - Choose sections for PDF:
     [✓] Executive summary
     [✓] Flow scorecards
     [✓] Issues by flow
     [✓] Recommendations
     [✓] Evidence gallery
   - Choose severity filter: All or High/Critical only
   - Click "Generate PDF"
   ↓
3. Export Job Queued
   - Modal shows progress: "Generating PDF..."
   - Progress bar: 0% → 100%
   - Can navigate away, job continues
   ↓
4. Export Complete
   - Toast notification: "PDF ready"
   - Auto-download or "Download Now" button
   - Export stored for 24 hours
   ↓
5. PDF Opens
   - Professional formatting
   - Client branding (if configured)
   - All selected sections included
   - Screenshots embedded and annotated
```

**Success Criteria:**
- Export initiated in < 15 seconds
- PDF generates in < 30 seconds (typical project)
- Download automatic or one-click
- PDF professionally formatted and readable

---

## Interaction Patterns & Microinteractions

### Drag & Drop
- **Steps reordering**: Drag handle (≡), ghost preview while dragging, drop zone highlights
- **Recommendations in matrix**: Drag card between quadrants, snap to grid, update priority on drop
- **Screenshot upload**: Drag files over upload zone, zone highlights blue, instant upload on drop

### Hover States
- **Cards**: Subtle lift (2px translateY) + shadow increase
- **Buttons**: Background color shift + slight scale (1.02)
- **List items**: Background tint, show action icons
- **Info icons**: Show tooltip after 300ms delay

### Loading States
- **Buttons**: Spinner replaces icon, text changes to "Processing...", disabled
- **Page load**: Skeleton screens for content blocks (gray animated pulse)
- **Lazy images**: Blur-up placeholder → sharp image fade-in
- **Infinite scroll**: Spinner at bottom, auto-load on scroll proximity

### Success Feedback
- **Form save**: Green checkmark animation + toast notification
- **Item created**: Slide-in animation for new card
- **Upload complete**: Progress bar → checkmark transition
- **Score update**: Number count-up animation

### Error Handling
- **Form errors**: Shake animation on submit, highlight fields, scroll to first error
- **Network errors**: Toast with retry button, maintain form state
- **Upload errors**: Red border on thumbnail, error message below, retry button
- **Validation**: Inline message appears on blur, icon + text

### Empty States
- **No projects**: Centered illustration + "Create your first project" CTA
- **No flows**: Inline message in panel + "Add Flow" button
- **No issues**: Encouraging message + guidance on capturing findings
- **No screenshots**: Upload zone with icon and instructions

### Keyboard Shortcuts
- `Cmd/Ctrl + K`: Global command palette (search, quick actions)
- `Cmd/Ctrl + N`: New project/flow/issue (context-aware)
- `Cmd/Ctrl + S`: Save current form
- `Esc`: Close modal/panel
- `Tab`: Navigate form fields (proper order)
- `Enter`: Submit form (when appropriate)
- Arrow keys: Navigate lists, change ratings

### Focus Management
- **Modal opens**: Focus on first input or primary action
- **Modal closes**: Return focus to trigger element
- **Form submit**: Move to next logical step or close
- **Error state**: Focus first invalid field

---

## Accessibility Checklist

### Semantic HTML
- ✓ Proper heading hierarchy (h1 → h2 → h3, no skips)
- ✓ Lists for navigation and grouped items
- ✓ Buttons for actions, links for navigation
- ✓ Form labels associated with inputs
- ✓ Landmarks (header, nav, main, aside, footer)

### ARIA
- ✓ `aria-label` for icon-only buttons
- ✓ `aria-describedby` for form hints and errors
- ✓ `aria-live` regions for dynamic content (toasts, live scores)
- ✓ `aria-expanded` for collapsible sections
- ✓ `aria-selected` for tabs
- ✓ `aria-modal="true"` for dialogs
- ✓ `role="dialog"` for modals
- ✓ `role="alert"` for critical errors

### Keyboard Navigation
- ✓ All interactive elements focusable
- ✓ Logical tab order (matches visual order)
- ✓ Focus trap in modals (Tab cycles within modal)
- ✓ Escape closes modals/dropdowns
- ✓ Arrow keys for radio groups and dropdowns
- ✓ Enter/Space activate buttons

### Visual
- ✓ 4.5:1 contrast for normal text
- ✓ 3:1 contrast for large text (18px+ or 14px+ bold)
- ✓ 3:1 contrast for UI components (buttons, borders)
- ✓ Focus indicators 2px visible outline
- ✓ No color-only information (use icons + text)
- ✓ Text resizable to 200% without loss

### Screen Readers
- ✓ Alt text for all images (descriptive, not decorative)
- ✓ Skip to main content link
- ✓ Form errors announced
- ✓ Loading states announced
- ✓ Dynamic content updates announced (toasts)

---

## Responsive Breakpoints

```
Mobile:     320px - 639px   (1 column layouts)
Tablet:     640px - 1023px  (2 column layouts)
Desktop:    1024px - 1279px (3 column layouts, sidebar visible)
Large:      1280px+         (Max-width containers, more whitespace)
```

### Mobile Adaptations
- Sidebar: Overlay menu (hamburger trigger)
- Cards: Single column
- Tables: Horizontal scroll or card view
- Forms: Full-width inputs
- Modals: Full-screen on mobile
- Priority matrix: Vertical stack instead of 2D grid
- Navigation: Bottom tab bar for key sections

---

## Design Deliverables

### For Development
1. **Design Tokens**: JSON file with all variables
2. **Component Specs**: This document (detailed states)
3. **Figma File**: High-fidelity mockups (recommended)
4. **Icon Library**: Exported SVGs or icon component library
5. **Sample Content**: Realistic data for testing

### For Testing
1. **Accessibility Audit**: WCAG checklist per component
2. **Browser Matrix**: Chrome, Firefox, Safari, Edge (latest 2 versions)
3. **Device Testing**: iOS Safari, Android Chrome
4. **Screen Reader**: VoiceOver (Mac/iOS), NVDA (Windows)

---

This specification provides a complete foundation for implementing the UX Audit MVP's interface. All measurements, colors, and interactions are precisely defined to ensure consistency and quality.

**Next Steps:**
1. Review and approve color palette and typography
2. Build Radix UI + Tailwind component library
3. Create Figma prototypes for key flows
4. Implement and test with real users
