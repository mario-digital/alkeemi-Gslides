# Coding Standards

## Critical Frontend Rules

- **batchUpdate JSON Integrity:** All UI operations must produce valid Google Slides API requests - never compromise JSON structure for UI convenience
- **Validation-First Development:** Every state change must pass validation before committing - invalid states are not allowed to persist
- **Type Safety:** All batchUpdate operations must use strict TypeScript types - no `any` types in JSON manipulation code
- **Immutable State Updates:** Never mutate batchUpdate arrays directly - always create new arrays/objects for state changes
- **Export Contract:** Exported JSON must be copy-pasteable into Google Slides API calls without modification
- **Component Data Flow:** Components receive batchUpdate data as props, emit changes via callbacks - no direct store access in components
- **Error Boundary:** All validation errors must be caught and displayed to users with actionable feedback
- **File Operations Safety:** All file imports must be validated before applying to state - malformed files cannot corrupt application state

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `BatchUpdateEditor.tsx` |
| Hooks | camelCase with 'use' | `useBatchUpdate.ts` |
| Services | PascalCase + Service | `ValidationService.ts` |
| Types | PascalCase | `BatchUpdateRequest` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_OBJECT_ID_LENGTH` |
| Files | kebab-case or PascalCase | `batch-update-store.ts` or `ElementRenderer.tsx` |
