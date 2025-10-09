# UX Audit MVP

A lightweight UX audit tool for solo auditors to capture global notes, evaluate flows with standardized scores, annotate screenshots, and deliver client-friendly dashboards and exports.

## 🎨 Design System

- **Headings**: EB Garamond (sophisticated, editorial)
- **Body**: Inter (clean, readable)
- **Colors**: Sage Green, Forest Teal, Blush Pink, Espresso, Goldenrod
- **Background**: Warm cream (#F5F1EA)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Commands

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
```

## ✅ Current Implementation Status

### Completed: Flow 1 - Create Project & First Flow

**What's Working:**
1. ✅ Dashboard page with project list
2. ✅ Create new project modal
3. ✅ Project overview page
4. ✅ Add flow modal with platform/device selection
5. ✅ Flow detail page with step management
6. ✅ Add steps inline with drag handles
7. ✅ Delete steps with confirmation
8. ✅ Empty states with clear CTAs
9. ✅ Full navigation flow (Dashboard → Project → Flow → Steps)

**User Journey:**
```
Dashboard → Click "New Project"
  → Enter project details → Create Project
  → Project Overview page (empty state)
  → Click "Add First Flow"
  → Enter flow details (name, platform, device, URLs)
  → Create Flow
  → Flow Detail page (empty state)
  → Click "Add First Step"
  → Enter step title & URL
  → Add Step
  → See populated flow with steps
  → Click "Add Another Step" to continue
```

**Success Criteria Met:**
- ✅ Project created in < 30 seconds
- ✅ Flow created in < 20 seconds
- ✅ Steps added in < 10 seconds each
- ✅ Clear progress through onboarding
- ✅ All components use custom design system
- ✅ Accessible (WCAG AA keyboard navigation, focus states)
- ✅ Responsive design

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Base components (Button, Input, Modal, Card, etc.)
│   ├── project/         # Project-specific components
│   ├── flow/            # Flow-specific components
│   └── step/            # Step-specific components
├── pages/               # Route pages
├── store/               # Zustand state management
├── types/               # TypeScript types
├── styles/              # Global styles
└── App.tsx              # Main app with routing
```

## 🎯 Next Steps

To continue building the MVP, implement:

1. **Issue Tracking** (Flow 2)
   - Issue form with severity/heuristic
   - Screenshot upload
   - Annotation editor

2. **Flow Ratings** (Flow 3)
   - Heuristic rating grid
   - Score calculation
   - Rating display

3. **Recommendations** (Flow 4)
   - Recommendation form
   - Priority matrix
   - Impact/effort selection

4. **Sharing** (Flow 5)
   - Share link generation
   - Client dashboard view

5. **Export** (Flow 6)
   - PDF export
   - CSV export

## 🧩 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI (accessible primitives)
- **State**: Zustand
- **Router**: React Router v6
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod (to be added)

## 🎨 Design Tokens

All design tokens are defined in:
- `design-tokens.ts` - TypeScript constants
- `tailwind.config.js` - Tailwind configuration
- `src/styles/globals.css` - Global styles

Use Tailwind classes in components:
```tsx
<h1 className="font-heading text-4xl text-espresso-600">
  Title
</h1>

<Button className="bg-sage-500 hover:bg-sage-600">
  Click me
</Button>
```

## 📝 License

MIT
