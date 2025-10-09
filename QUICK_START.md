# Quick Start Guide 🚀

## Get Running in 3 Steps

### 1. Install Dependencies

```bash
cd "/Users/rebecca.davila/Documents/UX Audit"
pnpm install
```

**Don't have pnpm?** Install it first:
```bash
npm install -g pnpm
```

Or use npm instead:
```bash
npm install
```

---

### 2. Start Development Server

```bash
pnpm dev
```

The app will automatically open at: **http://localhost:5173**

---

### 3. Try the First Flow

Once the app is running, test the complete flow:

**Step 1: Create a Project**
1. Click "New Project" button (top right)
2. Fill in:
   - Project Name: "E-commerce Checkout Audit"
   - Client Name: "Acme Corporation"
   - Audit Goal: "Optimize checkout conversion"
   - Due Date: (pick any date)
3. Click "Create Project"

**Step 2: Add a Flow**
1. On the project page, click "Add First Flow"
2. Fill in:
   - Flow Name: "Homepage to Product"
   - Platform: Web
   - Device: Desktop
   - URLs: Add 1-2 example URLs
3. Click "Create Flow"

**Step 3: Add Steps**
1. On the flow page, click "Add First Step"
2. Fill in:
   - Step Title: "View product page"
   - URL: https://example.com/products/item-123
3. Click "Add Step"
4. Click "Add Another Step" to add more

**Done!** You've completed the first user flow ✅

---

## What You'll See

### Beautiful Design
- **Warm cream background** (#F5F1EA)
- **Garamond headings** for sophistication
- **Sage green buttons** with smooth hover effects
- **Teal focus rings** for accessibility
- **Smooth animations** throughout

### Key Features Working
- ✅ Create and manage projects
- ✅ Add flows with platform/device selection
- ✅ Build step-by-step user journeys
- ✅ Delete steps with confirmation
- ✅ Full keyboard navigation
- ✅ Empty states with clear guidance
- ✅ Breadcrumb navigation
- ✅ Responsive design

---

## Troubleshooting

### Port 5173 Already in Use?
Kill the process and restart:
```bash
lsof -ti:5173 | xargs kill -9
pnpm dev
```

Or change the port in `vite.config.ts`:
```typescript
server: {
  port: 3000, // Change to any port
}
```

### TypeScript Errors?
Run type checking:
```bash
pnpm type-check
```

### Components Not Styling?
Make sure Tailwind CSS is compiling. Check:
1. `tailwind.config.js` exists
2. `postcss.config.js` exists
3. `src/styles/globals.css` imports Tailwind

---

## Development Commands

```bash
# Start dev server (hot reload)
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Project Structure Quick Reference

```
src/
├── components/
│   ├── ui/              # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── project/         # ProjectSetupModal
│   ├── flow/            # AddFlowModal
│   └── step/            # AddStepForm
├── pages/
│   ├── DashboardPage.tsx
│   ├── ProjectOverviewPage.tsx
│   └── FlowDetailPage.tsx
├── store/
│   └── useStore.ts      # Zustand state
└── types/
    └── index.ts         # TypeScript types
```

---

## Design System Quick Reference

### Colors (Tailwind Classes)

```tsx
// Backgrounds
className="bg-page-bg"        // Warm cream page
className="bg-white"          // White cards

// Text
className="text-espresso-600" // Headings
className="text-neutral-600"  // Body text

// Buttons
className="bg-sage-500"       // Primary button
className="bg-teal-500"       // Secondary/accents

// Borders & Focus
className="border-neutral-200"
className="focus:border-teal-500"
```

### Typography

```tsx
// Headings (Garamond)
className="font-heading text-4xl"
className="font-heading text-2xl"

// Body (Inter)
className="font-body text-body-base"
className="font-body text-body-sm"

// Labels
className="text-label-base"
```

---

## Next Steps

Now that the first flow is working, you can:

1. **Explore the code** - Check out component implementations
2. **Customize styles** - Modify design tokens in `design-tokens.ts`
3. **Add features** - Build the next flow (Issue Tracking)
4. **Read docs** - Check `IMPLEMENTATION_SUMMARY.md` for details

---

## Need Help?

- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Visual Design**: See `VISUAL_GUIDE.md`
- **Architecture**: See `architecture.md`
- **UI/UX Specs**: See `ui-ux-spec.md`

Happy coding! 🎨✨
