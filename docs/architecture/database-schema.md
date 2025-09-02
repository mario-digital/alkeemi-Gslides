# Database Schema

Since this is a **client-side only application**, there is no traditional database. However, the application requires persistent storage schemas for local data management.

## Browser Storage Schema

**LocalStorage Schema for User Preferences:**
```typescript
// localStorage key: "alkemy-gslide-preferences"
interface UserPreferences {
  version: "1.0";
  lastModified: string; // ISO timestamp
  ui: {
    panelSplit: number; // 0.0 to 1.0, editor panel width ratio
    theme: "light" | "dark" | "system";
    gridSnap: boolean;
    showRuler: boolean;
    defaultUnits: "PT" | "EMU";
  };
  export: {
    defaultFilename: string;
    includeMetadata: boolean;
    prettyPrintJSON: boolean;
  };
}
```

**SessionStorage Schema for Working State:**
```typescript
// sessionStorage key: "alkemy-gslide-session" 
interface WorkingSession {
  version: "1.0";
  sessionId: string;
  lastSaved: string; // ISO timestamp
  autoSaveEnabled: boolean;
  
  // Current working state
  batchUpdateRequests: BatchUpdateRequest[]; // The canonical data
  selectedElementId?: string;
  undoStack: BatchUpdateRequest[][]; // Previous states for undo
  redoStack: BatchUpdateRequest[][]; // Future states for redo
  
  // Validation cache
  lastValidationResult: ValidationResult;
  validationTimestamp: string;
}
```
