# Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Runtime & Package Manager** | **Bun** | **1.2.21** | **JS runtime and package manager** | **Ultra-fast installs, native TypeScript, built-in bundler** |
| Frontend Language | TypeScript | 5.9.2 | Type safety for complex JSON structures | Critical for batchUpdate JSON validation and IDE support |
| Frontend Framework | Next.js | 15.5 | React framework with SSG | Perfect for client-side apps with excellent DX |
| UI Component Library | shadcn/ui | CLI 3.0 | Modern, accessible components | Requested modern look with excellent customization |
| CSS Framework | Tailwind CSS | 4.1 | Utility-first styling | Specified in PRD, works perfectly with shadcn/ui |
| State Management | Zustand | 5.0.8 | Lightweight state for batchUpdate JSON | Simple, TypeScript-friendly state for complex JSON objects |
| JSON Schema Validation | Zod | 4.1.5 | Runtime validation of batchUpdate | Ensures exported JSON matches Google Slides API spec |
| File Operations | Browser File System API | Native | Import/export JSON and MD | Native browser APIs for client-side file operations |
| Frontend Testing | **Bun Test** | **Built-in** | **Fast native testing** | **Bun's built-in test runner - faster than Vitest** |
| E2E Testing | Playwright | Latest | End-to-end testing | Test complete import/export workflows |
| Build Tool | **Bun** | **Built-in** | **Fast development builds** | **Native bundling and dev server** |
| Bundler | **Bun Bundler** | **Built-in** | **Ultra-fast bundling** | **Faster than Webpack/Vite for development** |
| Deployment | Vercel | Latest | Static site hosting | Perfect for Next.js, global CDN |
| Code Quality | ESLint + Prettier | Latest | Code formatting and linting | Standard TypeScript development |
