# Development Workflow

## Local Development Setup

**Prerequisites:**
```bash
# Install Bun (latest version)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

**Initial Setup:**
```bash
# Clone the repository
git clone https://github.com/your-org/alkemy-gslide.git
cd alkemy-gslide

# Install dependencies with Bun
bun install

# Copy environment template
cp .env.example .env.local

# Run initial build to verify setup
bun run build
```

**Development Commands:**
```bash
# Start development server with Turbo mode
bun dev

# Build for production
bun run build

# Type checking
bun run type-check

# Lint code
bun run lint

# Run unit tests
bun test

# Run E2E tests
bun test:e2e
```

## Environment Configuration

**Required Environment Variables:**

**Frontend (.env.local):**
```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="Alkemy GSlide"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Settings
NEXT_PUBLIC_DEBUG_MODE="true"
NEXT_PUBLIC_VALIDATION_STRICT="true"

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTOSAVE="true"
NEXT_PUBLIC_ENABLE_MARKDOWN_EXPORT="true"
NEXT_PUBLIC_ENABLE_KEYBOARD_SHORTCUTS="true"
```
