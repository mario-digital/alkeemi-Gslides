# Source Tree Architecture

## Project: Alkeemi GSlides BatchUpdate Editor

**Version:** 0.1.0  
**Framework:** Next.js 15.5.0 with React 19  
**Language:** TypeScript 5.9.2  
**Package Manager:** Bun  
**Architecture Pattern:** Feature-First with Domain-Driven Design

---

## Directory Structure Overview

```
alkeemi-gslides/
├── app/                        # Next.js 15 App Router & Feature Modules
├── components/                 # Legacy/Shared UI Components (being migrated)
├── docs/                       # Project Documentation & Specifications
├── hooks/                      # Global React Hooks
├── lib/                        # Core Business Logic & Services
├── services/                   # Domain Services
├── stores/                     # Zustand State Management
├── styles/                     # Global Styles & Theme
├── tests/                      # Test Suites
├── types/                      # TypeScript Type Definitions
└── .bmad-core/                # BMAD Framework Configuration
```

---

## Core Directories

### `/app` - Application Layer (Next.js App Router)
Primary application directory following Next.js 15 conventions with colocated features.

```
app/
├── layout.tsx                  # Root layout with providers
├── page.tsx                    # Landing/dashboard page
├── globals.css                 # Global styles & CSS variables
├── animations.css              # Animation keyframes & utilities
│
├── components/                 # Feature-specific components
│   ├── accessibility/          # A11y providers & utilities
│   │   └── AccessibilityProvider.tsx
│   ├── animations/             # Animation components library
│   │   ├── AnimatedPanel.tsx
│   │   ├── ElementMaterialize.tsx
│   │   ├── GlowButton.tsx
│   │   ├── JsonSyntaxHighlight.tsx
│   │   ├── NeonBorderInput.tsx
│   │   ├── PerformanceMonitor.tsx
│   │   ├── ResizablePanel.tsx
│   │   └── ValidationFeedback.tsx
│   ├── editor/                 # Editor-specific components
│   │   └── operations/
│   │       ├── OperationCard.tsx
│   │       └── OperationsList.tsx
│   ├── import-export/          # File operations components
│   │   ├── ExportDialog.tsx
│   │   ├── FileOperationsManager.tsx
│   │   └── ImportDialog.tsx
│   ├── layout/                 # Layout components
│   │   └── ResponsiveLayout.tsx
│   ├── ui/                     # Base UI components
│   │   └── AccessibleButton.tsx
│   └── validation/             # Validation UI components
│       ├── ValidationBadge.tsx
│       ├── ValidationErrorList.tsx
│       └── ValidationPanel.tsx
│
├── hooks/                      # App-specific hooks
│   ├── useAnimationPerformance.ts
│   └── useKeyboardNavigation.ts
│
├── styles/                     # App-specific styles
│   └── accessibility.css
│
└── [routes]/                   # Feature routes
    ├── animations-demo/        # Animation showcase
    ├── design-system/          # Design system documentation
    └── editor/                 # Main editor routes
        ├── page.tsx
        └── visual-builder/
            └── page.tsx
```

### `/lib` - Core Business Logic
Shared utilities, hooks, services, and validation logic.

```
lib/
├── utils.ts                    # Common utility functions (cn, etc.)
├── hooks/                      # Business logic hooks
│   ├── useRealtimeValidation.ts
│   └── useStoreValidation.ts
├── services/                   # Core services
│   └── ValidationService.ts
├── utils/                      # Utility modules
│   └── debounce.ts
└── validation/                 # Validation schemas & rules
    └── schemas/
        └── batch-update.schema.ts
```

### `/stores` - State Management
Zustand stores for global application state.

```
stores/
└── batchUpdateStore.ts         # Main BatchUpdate operations store
```

### `/types` - TypeScript Definitions
Core type definitions and interfaces.

```
types/
└── batch-update.ts             # Google Slides API type definitions
```

### `/components` - Legacy Components (Being Migrated)
Shared components being migrated to `/app/components`.

```
components/
├── design-system/              # Design system components
├── editor/                     # Editor components
│   └── properties/
├── layout/                     # Layout components
├── preview/                    # Preview components
└── ui/                         # UI components
```

### `/docs` - Documentation
Comprehensive project documentation following BMAD methodology.

```
docs/
├── README.md                   # Project overview
├── prd.md                      # Product Requirements Document
├── architecture.md             # System architecture
├── front-end-spec.md          # Frontend specifications
│
├── architecture/               # Architecture shards
│   ├── coding-standards.md
│   ├── source-tree.md         # This document
│   └── tech-stack.md
│
├── prd/                        # PRD shards
├── qa/                         # QA documentation
│   └── gates/
├── stories/                    # User stories
│   ├── 01.01.project-setup-core-architecture.md
│   ├── 01.02.visual-element-builder-preview-system.md
│   ├── 01.03.import-export-validation-system.md
│   ├── 02.02.typography-system-component-library.md
│   ├── 02.03.animation-framework-micro-interactions.md
│   ├── 03.01.operations-list-card-components.md
│   └── 03.03.preview-integration-validation-import-export.md
│
└── epic-*/                     # Epic documentation
    ├── epic-01-foundation/
    ├── epic-02-design-system/
    └── epic-03-interactive-batchupdate-editor/
```

### `/tests` - Test Suites
Comprehensive test coverage using Bun test runner.

```
tests/
├── setup.ts                    # Test configuration
├── store.test.ts               # Store tests
├── validation.test.ts          # Validation tests
├── accessibility.test.ts       # A11y tests (runtime)
├── accessibility.test.tsx      # A11y tests (components)
├── color-contrast.test.ts      # Color contrast tests
├── components/                 # Component tests
│   └── ElementToolbar.test.tsx
├── services/                   # Service tests
│   └── createShape.test.ts
└── utils/                      # Utility tests
    └── coordinate-conversion.test.ts
```

### `/.bmad-core` - BMAD Framework
Business Modeling & Architecture Design framework configuration.

```
.bmad-core/
├── core-config.yaml            # Core BMAD configuration
├── agents/                     # AI agent definitions
├── agent-teams/                # Agent team configurations
├── checklists/                 # Development checklists
├── data/                       # Reference data
├── tasks/                      # Task templates
├── templates/                  # Document templates
├── utils/                      # BMAD utilities
└── workflows/                  # Workflow definitions
```

---

## Key Architectural Patterns

### 1. Feature-First Organization
- Components colocated with routes in `/app`
- Feature modules contain all related code
- Shared logic extracted to `/lib`

### 2. Type-Safe Architecture
- Comprehensive TypeScript definitions in `/types`
- Zod schemas for runtime validation
- Strict type checking with `tsc --noEmit`

### 3. State Management Strategy
- Zustand for global state (`/stores`)
- React hooks for local state
- Persistent storage with localStorage

### 4. Component Architecture
```
Feature Component
├── UI Layer (React Component)
├── Logic Layer (Custom Hooks)
├── Validation Layer (Zod Schemas)
└── State Layer (Zustand Store)
```

### 5. Testing Strategy
- Unit tests for utilities and services
- Component tests with Testing Library
- Accessibility tests with jest-axe
- Performance monitoring built-in

---

## Technology Stack

### Core Dependencies
- **Next.js 15.5.0**: React framework with App Router
- **React 19.0.0**: UI library
- **TypeScript 5.9.2**: Type safety
- **Zustand 5.0.8**: State management
- **Zod 4.1.5**: Schema validation

### UI Libraries
- **@radix-ui**: Accessible component primitives
- **@dnd-kit**: Drag and drop functionality
- **lucide-react**: Icon library
- **tailwindcss 3.4.0**: Utility-first CSS
- **class-variance-authority**: Component variants

### Development Tools
- **@monaco-editor/react**: Code editor integration
- **@testing-library**: Component testing
- **jest-axe**: Accessibility testing
- **happy-dom**: Test environment

---

## File Naming Conventions

### Components
- PascalCase: `ComponentName.tsx`
- Colocated styles: `ComponentName.module.css`
- Tests: `ComponentName.test.tsx`

### Utilities & Hooks
- camelCase: `useHookName.ts`, `utilityName.ts`
- Tests: `utilityName.test.ts`

### Documentation
- kebab-case: `document-name.md`
- Numbered stories: `01.01.story-name.md`

---

## Import Aliases

```typescript
@/              # Root src directory
@/types         # Type definitions
@/lib           # Library code
@/components    # Components
@/stores        # State stores
@/hooks         # React hooks
```

---

## Build & Development Scripts

```json
{
  "dev": "next dev",           # Development server
  "build": "next build",        # Production build
  "start": "next start",        # Production server
  "lint": "next lint",          # ESLint
  "type-check": "tsc --noEmit", # TypeScript validation
  "test": "bun test"            # Test runner
}
```

---

## Environment Structure

### Development
- Hot Module Replacement (HMR)
- Source maps enabled
- Development warnings
- Performance monitoring

### Production
- Optimized bundles
- Code splitting
- Image optimization
- Static generation where possible

---

## Module Boundaries

### Public API Exports
Each feature module exports through index files:
```typescript
// app/components/animations/index.ts
export { AnimatedPanel } from './AnimatedPanel'
export { GlowButton } from './GlowButton'
// etc...
```

### Private Implementation
Internal utilities and helpers remain unexported within feature directories.

---

## Future Migration Path

### Current State
- Mixed organization (app + components directories)
- Transitioning to App Router patterns
- Legacy components being refactored

### Target State
- Full App Router adoption
- Complete feature colocation
- Server Components where beneficial
- Optimized client bundles

---

## Notes for Developers

1. **New Features**: Create in `/app/[feature]` with colocated components
2. **Shared Logic**: Extract to `/lib` when used across features
3. **Type Definitions**: Add to `/types` for API contracts
4. **State Management**: Use Zustand stores in `/stores`
5. **Testing**: Mirror source structure in `/tests`
6. **Documentation**: Update relevant `/docs` files

---

*Last Updated: Current as of project analysis*
*Architecture Version: v1.0*
*BMAD Framework: Active*