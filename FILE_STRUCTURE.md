# UX Audit MVP - Complete File Structure

```
/Users/rebecca.davila/Documents/UX Audit/
│
├── 📄 Configuration Files
│   ├── package.json                  # Dependencies & scripts
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config (app)
│   ├── tsconfig.node.json           # TypeScript config (build)
│   ├── tailwind.config.js           # Tailwind + design tokens
│   ├── postcss.config.js            # PostCSS configuration
│   └── .gitignore                   # Git ignore rules
│
├── 📄 Entry Points
│   ├── index.html                   # HTML entry point
│   └── src/
│       ├── main.tsx                 # React entry point
│       └── App.tsx                  # Router setup
│
├── 🎨 Source Code
│   └── src/
│       │
│       ├── 🧩 components/
│       │   │
│       │   ├── ui/                  # Base UI Components
│       │   │   ├── Button.tsx       # 4 variants + loading
│       │   │   ├── Input.tsx        # Text input with validation
│       │   │   ├── Textarea.tsx     # Multi-line input
│       │   │   ├── Modal.tsx        # Radix UI dialog
│       │   │   ├── Card.tsx         # Container component
│       │   │   └── EmptyState.tsx   # Empty state with CTA
│       │   │
│       │   ├── project/             # Project Components
│       │   │   └── ProjectSetupModal.tsx
│       │   │
│       │   ├── flow/                # Flow Components
│       │   │   └── AddFlowModal.tsx
│       │   │
│       │   └── step/                # Step Components
│       │       └── AddStepForm.tsx
│       │
│       ├── 📄 pages/
│       │   ├── DashboardPage.tsx          # Project list
│       │   ├── ProjectOverviewPage.tsx    # Flow list
│       │   └── FlowDetailPage.tsx         # Step management
│       │
│       ├── 🗄️ store/
│       │   └── useStore.ts                # Zustand state
│       │
│       ├── 📝 types/
│       │   └── index.ts                   # TypeScript types
│       │
│       └── 🎨 styles/
│           └── globals.css                # Global styles + Tailwind
│
├── 🎨 Design System
│   ├── design-tokens.ts             # Design tokens (TypeScript)
│   ├── tailwind.config.example.js   # Example Tailwind config
│   ├── ui-ux-spec.md               # Complete UI/UX specs
│   └── VISUAL_GUIDE.md             # Visual reference
│
├── 📐 Architecture
│   ├── architecture.md              # System architecture
│   ├── prd.md                      # Product requirements
│   └── claude.md                   # Development guidelines
│
└── 📚 Documentation
    ├── README.md                    # Project overview
    ├── QUICK_START.md              # Setup instructions
    ├── IMPLEMENTATION_SUMMARY.md    # What's built
    ├── PROJECT_STATUS.md           # Current status + roadmap
    └── FILE_STRUCTURE.md           # This file
```

---

## 📊 File Count by Category

### Configuration & Setup (7 files)
- Package & build configs
- TypeScript configs
- Styling configs
- Git ignore

### Source Code (21 files)
- **Entry**: 3 files (HTML, main.tsx, App.tsx)
- **Components**: 9 files (6 base UI + 3 feature)
- **Pages**: 3 files (Dashboard, Project, Flow)
- **State**: 1 file (Zustand store)
- **Types**: 1 file (TypeScript definitions)
- **Styles**: 1 file (Global CSS)

### Design System (4 files)
- Design tokens
- Tailwind config example
- UI/UX specifications
- Visual guide

### Documentation (8 files)
- README & quick start
- Implementation summary
- Project status & roadmap
- Architecture docs
- PRD & dev guidelines
- Visual guide
- File structure (this file)

**Total: 40 files**

---

## 🔑 Key Files to Know

### For Development
```
src/
├── components/ui/Button.tsx    ← Start here for UI components
├── pages/DashboardPage.tsx     ← Start here for pages
├── store/useStore.ts           ← All state management
├── types/index.ts              ← Type definitions
└── styles/globals.css          ← Global styles

design-tokens.ts                ← All colors, spacing, etc.
tailwind.config.js              ← Tailwind customization
```

### For Understanding
```
README.md                       ← Project overview
QUICK_START.md                  ← How to run
IMPLEMENTATION_SUMMARY.md       ← What's built
ui-ux-spec.md                  ← Design specs
architecture.md                 ← System design
```

---

## 🗂️ Component Hierarchy

```
App.tsx (Router)
│
├── DashboardPage
│   ├── Button (New Project)
│   ├── Card (Project list)
│   │   └── CardContent
│   ├── EmptyState (when no projects)
│   └── ProjectSetupModal
│       ├── Modal
│       ├── Input (x4)
│       ├── Textarea
│       └── Button (x2)
│
├── ProjectOverviewPage
│   ├── Card (Flow list)
│   │   └── CardContent
│   ├── EmptyState (when no flows)
│   └── AddFlowModal
│       ├── Modal
│       ├── Input (multiple)
│       └── Button (x2)
│
└── FlowDetailPage
    ├── Card (Step list)
    │   └── CardContent
    ├── EmptyState (when no steps)
    └── AddStepForm
        ├── Input (x2)
        └── Button (x2)
```

---

## 🎯 Import Patterns

### Component Imports
```typescript
// Base UI components
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';

// Feature components
import ProjectSetupModal from '@/components/project/ProjectSetupModal';
import AddFlowModal from '@/components/flow/AddFlowModal';
import AddStepForm from '@/components/step/AddStepForm';
```

### State & Types
```typescript
// Zustand store
import useStore from '@/store/useStore';

// Types
import { Project, Flow, Step } from '@/types';
```

### Design Tokens
```typescript
// Import tokens
import { colors, typography } from '@/design-tokens';

// Or use Tailwind classes
className="bg-sage-500 text-white"
```

---

## 🌳 Feature Branches (Suggested)

When building new features, organize by flow:

```
main
├── flow-1-create-project  ✅ COMPLETE
│
├── flow-2-capture-issue   🚧 NEXT
│   ├── components/issue/
│   ├── components/screenshot/
│   └── Update store + types
│
├── flow-3-rate-flow       🔜 PLANNED
│   ├── components/rating/
│   └── Score calculation
│
├── flow-4-recommendations 🔜 PLANNED
│   └── components/recommendation/
│
├── flow-5-share          🔜 PLANNED
│   └── components/share/
│
└── flow-6-export         🔜 PLANNED
    └── lib/export/
```

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `Button.tsx`, `AddFlowModal.tsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `DashboardPage.tsx`)
- **Utilities**: camelCase (e.g., `scoreCalculation.ts`)
- **Types**: index.ts in /types folder
- **Hooks**: camelCase with "use" prefix (e.g., `useStore.ts`)

### Folders
- **Lowercase with hyphens**: Not needed (using camelCase for simplicity)
- **Feature grouping**: `/components/feature-name/`
- **Shared utilities**: `/lib/` (to be created)

### Components
- **Functional components**: Arrow functions with types
- **Props interface**: Same name as component + "Props"
- **Exports**: Default export for components

Example:
```typescript
// Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  // ...
}

const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  // ...
};

export default Button;
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Action
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Updates
```

Example:
```
Click "Create Project" button
    ↓
handleSubmit in ProjectSetupModal
    ↓
addProject() from useStore
    ↓
projects array updated
    ↓
DashboardPage re-renders
    ↓
New project card appears
```

---

## 🎨 Styling Approach

### CSS Hierarchy
1. **Tailwind Utility Classes** (primary)
   ```tsx
   <div className="bg-white p-5 rounded-md shadow-sm">
   ```

2. **Custom Tailwind Classes** (design tokens)
   ```tsx
   <div className="bg-sage-500 text-espresso-600">
   ```

3. **Component Styles** (for complex states)
   ```tsx
   className={`
     transition-all duration-fast
     ${isActive ? 'bg-sage-600' : 'bg-sage-500'}
   `}
   ```

4. **Global Styles** (minimal, in globals.css)
   ```css
   @layer base {
     body {
       @apply bg-page-bg text-espresso-500;
     }
   }
   ```

---

## 🚀 Quick File Creation Commands

### Add a new component
```bash
touch src/components/ui/NewComponent.tsx
```

### Add a new page
```bash
touch src/pages/NewPage.tsx
```

### Add feature components
```bash
mkdir -p src/components/feature-name
touch src/components/feature-name/ComponentName.tsx
```

### Add utilities
```bash
mkdir -p src/lib/utils
touch src/lib/utils/helperFunction.ts
```

---

This structure provides a clean, scalable foundation for the UX Audit MVP! 🎉
