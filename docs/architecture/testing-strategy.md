# Testing Strategy

## Testing Pyramid

```
        E2E Tests (Playwright)
       /                    \
    Integration Tests (Bun Test)
   /                            \
Unit Tests (Bun Test)    Component Tests (RTL)
```

## Test Organization

**Frontend Tests:**
```
tests/
├── unit/                      # Unit tests for pure functions
│   ├── services/
│   ├── utils/
│   └── stores/
├── components/                # Component tests
│   ├── editor/
│   ├── preview/
│   └── file-operations/
├── integration/               # Integration tests
│   ├── workflows/
│   └── stores/
└── e2e/                      # End-to-end tests
    ├── specs/
    ├── fixtures/
    └── utils/
```
