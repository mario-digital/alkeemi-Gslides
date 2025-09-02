# Unified Project Structure

```plaintext
alkemy-gslide/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yml              # Build, test, lint on PR
│       └── deploy.yml          # Deploy to Vercel on main
├── public/                     # Static assets
│   ├── icons/                  # App icons and favicons
│   ├── images/                 # Static images
│   └── manifest.json           # PWA manifest
├── src/                        # Application source code
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global Tailwind styles
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Main editor page (/)
│   │   ├── import/
│   │   │   └── page.tsx        # Import workflow page
│   │   └── export/
│   │       └── page.tsx        # Export workflow page
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── editor/             # Left panel editor components
│   │   ├── preview/            # Right panel preview components
│   │   ├── file-operations/    # Import/Export components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utility libraries and configurations
│   │   ├── utils.ts            # General utility functions
│   │   ├── cn.ts               # Class name utility (clsx + tailwind-merge)
│   │   ├── constants.ts        # App constants
│   │   └── validations/        # Zod validation schemas
│   ├── services/               # Business logic and external API wrappers
│   │   ├── batchUpdateService.ts    # Core batchUpdate operations
│   │   ├── fileSystemService.ts     # File import/export operations
│   │   ├── validationService.ts     # Validation logic
│   │   └── renderingService.ts      # Preview rendering logic
│   ├── stores/                 # Zustand state management
│   │   ├── batchUpdateStore.ts # Main application state
│   │   ├── uiStore.ts          # UI preferences and state
│   │   └── index.ts            # Store exports
│   ├── types/                  # TypeScript type definitions
│   │   ├── googleSlides.ts     # Google Slides API types
│   │   ├── app.ts              # Application-specific types
│   │   └── index.ts            # Type exports
│   └── hooks/                  # Custom React hooks
│       ├── useBatchUpdate.ts   # batchUpdate management hook
│       ├── useFileOperations.ts # File operations hook
│       └── useValidation.ts    # Validation hook
├── tests/                      # Test files
├── docs/                       # Project documentation
│   ├── prd.md                  # Product Requirements Document
│   └── architecture.md         # This architecture document
├── bun.lockb                   # Bun lockfile
├── bunfig.toml                 # Bun configuration
├── components.json             # shadcn/ui configuration
├── next.config.js              # Next.js configuration
├── package.json                # Node.js dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```
