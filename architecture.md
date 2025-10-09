# UX Audit MVP - System Architecture

## Overview

This document outlines the complete system architecture for the UX Audit MVP, including database schema, API design, frontend structure, and data flow patterns.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React 18 + TypeScript + Vite + Zustand + Radix + Tailwind │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST API
┌────────────────────┴────────────────────────────────────────┐
│                        Backend Layer                         │
│              Node.js + TypeScript + Express/Fastify         │
│  ┌──────────────┬─────────────────┬────────────────────┐   │
│  │ Auth Service │ Project Service │ Export Service     │   │
│  │              │ Flow Service    │ (Bull Queue)       │   │
│  │              │ Issue Service   │                    │   │
│  └──────────────┴─────────────────┴────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ Prisma ORM
┌────────────────────┴────────────────────────────────────────┐
│                      Data Layer                              │
│  PostgreSQL + File Storage (S3/Local for screenshots)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Entities

#### 1. Users
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?   // null for SSO users
  name          String
  role          Role      @default(AUDITOR)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  projects      Project[]
  activityLogs  ActivityLog[]
}

enum Role {
  AUDITOR
  ADMIN
}
```

#### 2. Projects
```prisma
model Project {
  id              String    @id @default(uuid())
  name            String
  clientName      String
  auditGoal       String?   @db.Text
  dueDate         DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  ownerId         String

  owner           User      @relation(fields: [ownerId], references: [id])
  flows           Flow[]
  globalNotes     GlobalNote[]
  recommendations Recommendation[]
  shareSettings   ShareSetting?
  heuristicWeights HeuristicWeight[]
  activityLogs    ActivityLog[]

  @@index([ownerId])
}
```

#### 3. Flows
```prisma
model Flow {
  id          String    @id @default(uuid())
  projectId   String
  name        String
  platform    String    // "Web", "iOS", "Android", etc.
  device      String?   // "Desktop", "Mobile", "Tablet"
  urls        String[]  // Array of URLs
  order       Int       // Display order
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  steps       Step[]
  ratings     FlowRating[]
  issues      Issue[]

  @@index([projectId])
  @@index([projectId, order])
}
```

#### 4. Steps
```prisma
model Step {
  id          String    @id @default(uuid())
  flowId      String
  title       String
  url         String?
  notes       String?   @db.Text
  order       Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  flow        Flow      @relation(fields: [flowId], references: [id], onDelete: Cascade)
  issues      Issue[]

  @@index([flowId])
  @@index([flowId, order])
}
```

#### 5. Heuristics & Ratings
```prisma
model HeuristicWeight {
  id          String    @id @default(uuid())
  projectId   String
  heuristic   Heuristic
  weight      Float     @default(1.0)

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, heuristic])
}

model FlowRating {
  id          String    @id @default(uuid())
  flowId      String
  heuristic   Heuristic
  score       Int       // 1-5
  notes       String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  flow        Flow      @relation(fields: [flowId], references: [id], onDelete: Cascade)

  @@unique([flowId, heuristic])
  @@index([flowId])
}

enum Heuristic {
  VISIBILITY_OF_SYSTEM_STATUS
  MATCH_SYSTEM_REAL_WORLD
  USER_CONTROL_FREEDOM
  CONSISTENCY_STANDARDS
  ERROR_PREVENTION
  RECOGNITION_OVER_RECALL
  FLEXIBILITY_EFFICIENCY
  AESTHETIC_MINIMALIST_DESIGN
  ERROR_RECOVERY
  HELP_DOCUMENTATION
}
```

#### 6. Issues
```prisma
model Issue {
  id              String    @id @default(uuid())
  flowId          String
  stepId          String?   // Optional link to specific step
  title           String
  description     String    @db.Text
  severity        Severity
  heuristic       Heuristic
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  flow            Flow      @relation(fields: [flowId], references: [id], onDelete: Cascade)
  step            Step?     @relation(fields: [stepId], references: [id], onDelete: SetNull)
  screenshots     Screenshot[]
  recommendations Recommendation[] @relation("IssueRecommendations")

  @@index([flowId])
  @@index([stepId])
  @@index([severity])
}

enum Severity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}
```

#### 7. Screenshots
```prisma
model Screenshot {
  id              String    @id @default(uuid())
  issueId         String?
  globalNoteId    String?
  fileName        String
  fileUrl         String    // S3 URL or local path
  fileSize        Int       // bytes
  mimeType        String
  annotationData  Json?     // Stores annotation tool data (shapes, text, etc.)
  version         Int       @default(1)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  issue           Issue?    @relation(fields: [issueId], references: [id], onDelete: Cascade)
  globalNote      GlobalNote? @relation(fields: [globalNoteId], references: [id], onDelete: Cascade)

  @@index([issueId])
  @@index([globalNoteId])
}
```

#### 8. Recommendations
```prisma
model Recommendation {
  id              String    @id @default(uuid())
  projectId       String
  title           String
  description     String    @db.Text
  impact          Impact
  effort          Effort
  priority        Priority  // Auto-calculated from impact x effort
  status          RecommendationStatus @default(PROPOSED)
  targetOwner     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  issues          Issue[]   @relation("IssueRecommendations")

  @@index([projectId])
  @@index([priority, status])
}

enum Impact {
  HIGH
  MEDIUM
  LOW
}

enum Effort {
  HIGH
  MEDIUM
  LOW
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

enum RecommendationStatus {
  PROPOSED
  ACCEPTED
  IN_PROGRESS
  DONE
}
```

#### 9. Global Notes
```prisma
model GlobalNote {
  id          String    @id @default(uuid())
  projectId   String
  content     String    @db.Text
  tags        String[]  // Heuristic tags
  isPinned    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  screenshots Screenshot[]

  @@index([projectId])
}
```

#### 10. Share Settings
```prisma
model ShareSetting {
  id              String    @id @default(uuid())
  projectId       String    @unique
  token           String    @unique @default(cuid())
  password        String?   // Optional password protection
  expiresAt       DateTime?
  isActive        Boolean   @default(true)
  allowedSections Json      // Which sections to show in dashboard
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  accessLogs      AccessLog[]
}
```

#### 11. Activity & Access Logs
```prisma
model ActivityLog {
  id          String    @id @default(uuid())
  projectId   String
  userId      String
  action      String    // "CREATED", "SHARED", "EXPORTED", "UPDATED"
  metadata    Json?
  createdAt   DateTime  @default(now())

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])

  @@index([projectId])
  @@index([userId])
}

model AccessLog {
  id              String    @id @default(uuid())
  shareSettingId  String
  ipAddress       String?
  userAgent       String?
  accessedAt      DateTime  @default(now())

  shareSetting    ShareSetting @relation(fields: [shareSettingId], references: [id], onDelete: Cascade)

  @@index([shareSettingId])
}
```

---

## API Structure

### Authentication Endpoints
```
POST   /api/auth/register        - Create new user account
POST   /api/auth/login           - Login with email/password
POST   /api/auth/logout          - Logout current session
POST   /api/auth/refresh         - Refresh JWT token
GET    /api/auth/me              - Get current user profile
```

### Project Endpoints
```
GET    /api/projects             - List all projects for user
POST   /api/projects             - Create new project
GET    /api/projects/:id         - Get project details
PATCH  /api/projects/:id         - Update project
DELETE /api/projects/:id         - Delete project
GET    /api/projects/:id/summary - Get project summary (scores, stats)
```

### Flow Endpoints
```
GET    /api/projects/:projectId/flows           - List flows
POST   /api/projects/:projectId/flows           - Create flow
GET    /api/flows/:id                           - Get flow details
PATCH  /api/flows/:id                           - Update flow
DELETE /api/flows/:id                           - Delete flow
PATCH  /api/flows/:id/reorder                   - Reorder flows
```

### Step Endpoints
```
GET    /api/flows/:flowId/steps                 - List steps
POST   /api/flows/:flowId/steps                 - Create step
PATCH  /api/steps/:id                           - Update step
DELETE /api/steps/:id                           - Delete step
PATCH  /api/steps/:id/reorder                   - Reorder steps
```

### Rating Endpoints
```
GET    /api/flows/:flowId/ratings               - Get all ratings for flow
POST   /api/flows/:flowId/ratings               - Create/update rating
GET    /api/projects/:projectId/heuristic-weights - Get weights
PATCH  /api/projects/:projectId/heuristic-weights - Update weights
```

### Issue Endpoints
```
GET    /api/projects/:projectId/issues          - List all issues
POST   /api/flows/:flowId/issues                - Create issue
GET    /api/issues/:id                          - Get issue details
PATCH  /api/issues/:id                          - Update issue
DELETE /api/issues/:id                          - Delete issue
POST   /api/issues/detect-duplicates            - Detect similar issues
```

### Screenshot Endpoints
```
POST   /api/screenshots/upload                  - Upload screenshot
GET    /api/screenshots/:id                     - Get screenshot
PATCH  /api/screenshots/:id/annotations         - Save annotations
DELETE /api/screenshots/:id                     - Delete screenshot
```

### Recommendation Endpoints
```
GET    /api/projects/:projectId/recommendations - List recommendations
POST   /api/projects/:projectId/recommendations - Create recommendation
PATCH  /api/recommendations/:id                 - Update recommendation
DELETE /api/recommendations/:id                 - Delete recommendation
POST   /api/recommendations/bulk-create         - Create multiple (quick wins)
```

### Global Notes Endpoints
```
GET    /api/projects/:projectId/global-notes    - List global notes
POST   /api/projects/:projectId/global-notes    - Create global note
PATCH  /api/global-notes/:id                    - Update global note
DELETE /api/global-notes/:id                    - Delete global note
```

### Share & Export Endpoints
```
POST   /api/projects/:projectId/share           - Generate share link
PATCH  /api/projects/:projectId/share           - Update share settings
DELETE /api/projects/:projectId/share           - Revoke share link
GET    /api/shared/:token                       - Access shared dashboard
POST   /api/projects/:projectId/export/pdf      - Export PDF (queued job)
POST   /api/projects/:projectId/export/csv      - Export CSV
GET    /api/exports/:jobId/status               - Check export job status
GET    /api/exports/:jobId/download             - Download export
```

---

## Frontend Architecture

### Folder Structure

```
src/
├── main.tsx                      # App entry point
├── App.tsx                       # Root component with routing
├── router.tsx                    # Route definitions
│
├── pages/                        # Route-level page components
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx     # Project list
│   ├── project/
│   │   ├── ProjectOverviewPage.tsx
│   │   ├── ProjectSetupPage.tsx
│   │   ├── FlowDetailPage.tsx
│   │   └── RecommendationsPage.tsx
│   ├── shared/
│   │   └── SharedDashboardPage.tsx
│   └── NotFoundPage.tsx
│
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (Radix + styled)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Dialog.tsx
│   │   ├── Toast.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Tooltip.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Breadcrumbs.tsx
│   │
│   ├── project/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ProjectSummary.tsx
│   │
│   ├── flow/
│   │   ├── FlowCard.tsx
│   │   ├── FlowForm.tsx
│   │   ├── FlowScoreCard.tsx
│   │   └── FlowRatingGrid.tsx
│   │
│   ├── step/
│   │   ├── StepList.tsx
│   │   ├── StepItem.tsx
│   │   └── StepForm.tsx
│   │
│   ├── issue/
│   │   ├── IssueCard.tsx
│   │   ├── IssueForm.tsx
│   │   ├── IssueList.tsx
│   │   └── IssueFilters.tsx
│   │
│   ├── screenshot/
│   │   ├── ScreenshotUpload.tsx
│   │   ├── ScreenshotGallery.tsx
│   │   ├── AnnotationEditor.tsx  # Canvas-based annotation
│   │   └── AnnotationToolbar.tsx
│   │
│   ├── recommendation/
│   │   ├── RecommendationCard.tsx
│   │   ├── RecommendationForm.tsx
│   │   ├── RecommendationList.tsx
│   │   └── PriorityMatrix.tsx
│   │
│   ├── rating/
│   │   ├── RatingGrid.tsx
│   │   ├── RatingInput.tsx
│   │   └── HeuristicTooltip.tsx
│   │
│   ├── global-notes/
│   │   ├── GlobalNoteCard.tsx
│   │   └── GlobalNoteForm.tsx
│   │
│   ├── dashboard/
│   │   ├── OverviewStats.tsx
│   │   ├── TopIssuesList.tsx
│   │   ├── TopRecommendationsList.tsx
│   │   └── FlowScoreCards.tsx
│   │
│   └── export/
│       ├── ExportDialog.tsx
│       ├── ShareDialog.tsx
│       └── ExportProgress.tsx
│
├── features/                     # Feature-specific logic
│   ├── auth/
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── api/
│   │       └── authApi.ts
│   │
│   ├── projects/
│   │   ├── hooks/
│   │   │   ├── useProjects.ts
│   │   │   └── useProjectSummary.ts
│   │   └── api/
│   │       └── projectsApi.ts
│   │
│   ├── flows/
│   │   ├── hooks/
│   │   │   ├── useFlows.ts
│   │   │   └── useFlowRatings.ts
│   │   ├── api/
│   │   │   └── flowsApi.ts
│   │   └── utils/
│   │       └── calculateFlowScore.ts
│   │
│   ├── issues/
│   │   ├── hooks/
│   │   │   └── useIssues.ts
│   │   └── api/
│   │       └── issuesApi.ts
│   │
│   ├── recommendations/
│   │   ├── hooks/
│   │   │   └── useRecommendations.ts
│   │   ├── api/
│   │   │   └── recommendationsApi.ts
│   │   └── utils/
│   │       └── calculatePriority.ts
│   │
│   └── screenshots/
│       ├── hooks/
│       │   └── useScreenshots.ts
│       ├── api/
│       │   └── screenshotsApi.ts
│       └── utils/
│           └── annotationUtils.ts
│
├── store/                        # Zustand stores
│   ├── authStore.ts
│   ├── projectStore.ts
│   ├── uiStore.ts                # Toast, modals, loading states
│   └── index.ts
│
├── lib/                          # Utilities and configurations
│   ├── api/
│   │   ├── client.ts             # Axios/fetch wrapper
│   │   └── types.ts              # API type definitions
│   ├── validation/
│   │   └── schemas.ts            # Zod schemas
│   ├── constants/
│   │   ├── heuristics.ts         # Heuristic definitions
│   │   ├── routes.ts             # Route constants
│   │   └── config.ts             # App config
│   └── utils/
│       ├── formatting.ts
│       ├── dateUtils.ts
│       └── fileUtils.ts
│
├── hooks/                        # Shared custom hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useKeyboardShortcut.ts
│
├── types/                        # TypeScript type definitions
│   ├── project.types.ts
│   ├── flow.types.ts
│   ├── issue.types.ts
│   ├── recommendation.types.ts
│   └── index.ts
│
└── styles/
    ├── globals.css               # Tailwind imports + global styles
    └── theme.ts                  # Design tokens
```

### Route Structure

```typescript
/                              → Landing page (if public) or redirect to /dashboard
/login                         → Login page
/register                      → Register page

/dashboard                     → Project list
/projects/new                  → Create new project
/projects/:id                  → Project overview (scores, top issues, recommendations)
/projects/:id/setup            → Edit project settings and scope
/projects/:id/flows/:flowId    → Flow detail (steps, ratings, issues)
/projects/:id/recommendations  → Recommendations list and priority matrix
/projects/:id/global-notes     → Global notes management

/shared/:token                 → Public shared dashboard (read-only)
```

---

## State Management Architecture

### Zustand Stores

#### 1. Auth Store
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
}
```

#### 2. Project Store
```typescript
interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  clearCurrentProject: () => void;
}
```

#### 3. UI Store
```typescript
interface UIState {
  toasts: Toast[];
  modals: Record<string, boolean>;

  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}
```

### Data Fetching with TanStack Query

- Use query keys with hierarchical structure: `['projects']`, `['projects', projectId]`, `['flows', flowId]`
- Implement optimistic updates for mutations
- Cache invalidation strategies for related data
- Prefetch related data on navigation

---

## Design System & Theming

### Design Tokens Structure

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      // ... through 900
    },
    success: { /* ... */ },
    warning: { /* ... */ },
    error: { /* ... */ },
    neutral: { /* ... */ },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    // ... through 96
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};
```

### Tailwind Configuration

Extend Tailwind with design tokens and use CSS variables for runtime theming support.

---

## Key Technical Decisions

### 1. Screenshot Storage
- **Development**: Local filesystem with public URL serving
- **Production**: AWS S3 or similar object storage
- Max file size: 10 MB
- Supported formats: JPG, PNG
- Auto-resize large images for performance

### 2. Annotation Data Format
Store annotation data as JSON in database:
```typescript
interface AnnotationData {
  version: number;
  shapes: Array<{
    id: string;
    type: 'rectangle' | 'highlight' | 'arrow' | 'text' | 'blur';
    position: { x: number; y: number };
    size?: { width: number; height: number };
    points?: Array<{ x: number; y: number }>;
    text?: string;
    color: string;
    strokeWidth?: number;
  }>;
}
```

### 3. PDF Export Strategy
- Use job queue (Bull/BullMQ) for async processing
- Libraries: Puppeteer or PDFKit
- Return job ID immediately, poll for completion
- Store generated files temporarily (24h expiration)

### 4. Score Calculation
- Flow score: Weighted average of heuristic ratings
- Project score: Weighted average of flow scores
- Store calculated values or compute on-demand (decision needed)

### 5. Real-time Updates
- **MVP**: Polling for shared dashboard updates (every 30s)
- **Future**: WebSockets for live collaboration

---

## Security Considerations

### Authentication
- JWT tokens with refresh token rotation
- HTTPOnly cookies for refresh tokens
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days

### Authorization
- Projects owned by users
- Share links use secure random tokens (cuid)
- Optional password protection for shared dashboards
- Row-level security enforced in API layer

### File Upload Security
- Validate file types by magic numbers, not just extension
- Virus scanning (ClamAV) for uploaded files
- Signed URLs for S3 downloads
- Rate limiting on upload endpoints

### API Security
- Rate limiting: 100 requests/minute per IP
- CORS configuration for known origins
- CSRF tokens for state-changing operations
- SQL injection prevention via Prisma
- XSS prevention via React's default escaping

---

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy load annotation editor (heavy canvas library)
- Image lazy loading in galleries
- Virtual scrolling for long lists
- Debounced search/filter inputs
- Optimistic UI updates

### Backend
- Database indexes on foreign keys and query filters
- Pagination for list endpoints (default: 50 items)
- Eager loading for related entities to avoid N+1 queries
- Redis caching for computed scores (optional)
- CDN for static assets and screenshots

### Database
- Connection pooling (Prisma default)
- Batch operations for bulk creates
- Composite indexes for common query patterns

---

## Testing Strategy

### Unit Tests
- Business logic utilities (score calculation, priority matrix)
- Validation schemas
- API route handlers (mocked database)

### Integration Tests
- API endpoints with test database
- Database queries and transactions
- File upload flow

### E2E Tests (Critical Paths)
1. User registration and login
2. Create project → Add flow → Add issue → Rate flow
3. Upload and annotate screenshot
4. Create recommendation and view priority matrix
5. Generate share link and access dashboard
6. Export PDF

---

## Deployment Architecture

### Development
```
Local:
- Frontend: Vite dev server (http://localhost:5173)
- Backend: Express server (http://localhost:3000)
- Database: PostgreSQL (Docker or local)
```

### Production (Suggested)
```
- Frontend: Vercel or Netlify (static hosting + CDN)
- Backend: Railway, Render, or AWS ECS
- Database: Neon, Supabase, or AWS RDS (PostgreSQL)
- File Storage: AWS S3 or Cloudflare R2
- Job Queue: Redis Cloud
```

---

## Migration & Rollout Plan

### Phase 1: Foundation (Week 1)
- Database schema setup
- Authentication system
- Basic project CRUD
- Basic UI components

### Phase 2: Core Features (Week 2)
- Flow and step management
- Issue tracking
- Screenshot upload
- Rating system

### Phase 3: Advanced Features (Week 3)
- Annotation editor
- Recommendations
- Dashboard views
- Scoring calculations

### Phase 4: Sharing & Export (Week 4)
- Share link generation
- PDF export
- CSV export
- Final polish and testing

---

## Open Questions & Decisions Needed

1. **Screenshot storage**: S3 or local filesystem for MVP?
2. **Score caching**: Compute on-demand or store calculated scores?
3. **SSO provider**: Auth0, Clerk, or custom JWT implementation?
4. **PDF generation**: Puppeteer (headless browser) or PDFKit (programmatic)?
5. **Annotation library**: Fabric.js, Konva, or custom Canvas implementation?
6. **Deployment platform**: Self-hosted or PaaS (Railway/Render)?

---

This architecture provides a solid foundation for building a scalable, maintainable UX Audit MVP while adhering to the development principles outlined in the Claude Development Guide.
