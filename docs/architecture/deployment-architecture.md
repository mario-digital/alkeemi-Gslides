# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel (optimized for Next.js static export)
- **Build Command:** `bun run build`
- **Output Directory:** `out/` (Next.js static export)
- **CDN/Edge:** Vercel Edge Network with global distribution

## CI/CD Pipeline

**GitHub Actions Configuration (.github/workflows/ci.yml):**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: bun run type-check

      - name: Lint
        run: bun run lint

      - name: Unit tests
        run: bun test --coverage

      - name: Build application
        run: bun run build

      - name: E2E tests
        run: bun test:e2e
```

## Environments

| Environment | Frontend URL | Purpose | Auto-Deploy |
|-------------|-------------|---------|-------------|
| Development | http://localhost:3000 | Local development | No |
| Preview | https://alkemy-gslide-git-[branch].vercel.app | Feature branch testing | Yes (on PR) |
| Staging | https://staging.alkemy-gslide.com | Pre-production testing | Yes (on develop) |
| Production | https://alkemy-gslide.com | Live environment | Yes (on main) |
