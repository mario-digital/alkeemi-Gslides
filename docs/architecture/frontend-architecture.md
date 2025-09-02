# Frontend Architecture

## Component Architecture

**Component Organization:**
```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── resizable.tsx
│   ├── editor/                 # Left panel components
│   │   ├── BatchUpdateEditor.tsx
│   │   ├── ElementInspector.tsx
│   │   ├── ElementToolbar.tsx
│   │   └── PropertyPanels/
│   │       ├── ShapeProperties.tsx
│   │       ├── TextProperties.tsx
│   │       └── TransformProperties.tsx
│   ├── preview/                # Right panel components
│   │   ├── SlidePreviewRenderer.tsx
│   │   ├── ElementRenderer.tsx
│   │   ├── CoordinateSystem.tsx
│   │   └── SelectionOverlay.tsx
│   ├── file-operations/        # Import/Export components
│   │   ├── FileOperationsManager.tsx
│   │   ├── ImportDialog.tsx
│   │   ├── ExportDialog.tsx
│   │   └── ValidationErrorList.tsx
│   └── layout/                 # Layout components
│       ├── SplitScreenLayout.tsx
│       ├── Header.tsx
│       └── StatusBar.tsx
```

## State Management Architecture

**Zustand Store Schema:**
```typescript
interface AppState {
  // Core Data (canonical source of truth)
  batchUpdateRequests: BatchUpdateRequest[];
  
  // UI State
  selectedElementId?: string;
  activePanel: "editor" | "preview";
  isDirty: boolean; // Has unsaved changes
  
  // Validation State
  validationResult: ValidationResult;
  isExportBlocked: boolean;
  
  // History Management
  undoStack: BatchUpdateRequest[][];
  redoStack: BatchUpdateRequest[][];
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setBatchUpdateArray: (requests: BatchUpdateRequest[]) => Promise<void>;
  addBatchUpdateRequest: (request: BatchUpdateRequest) => Promise<void>;
  updateBatchUpdateRequest: (index: number, request: BatchUpdateRequest) => Promise<void>;
  removeBatchUpdateRequest: (index: number) => Promise<void>;
}
```
