# User Flows

## Create New Shape Element

**User Goal:** Add a new shape to the slide and configure its properties

**Entry Points:** Element toolbar, keyboard shortcut, right-click menu

**Success Criteria:** Valid createShape request added to batchUpdate array with immediate visual preview

### Flow Diagram

```mermaid
graph TD
    A[User clicks Add Shape] --> B[Shape type selector appears]
    B --> C[User selects Rectangle]
    C --> D[System generates objectId]
    D --> E[Default shape properties applied]
    E --> F[Shape appears in preview panel]
    F --> G[Properties panel updates]
    G --> H[User adjusts size/position]
    H --> I[Real-time preview updates]
    I --> J[Validation passes]
    J --> K[Success: Shape configured]
    
    F --> L[Validation Error]
    L --> M[Error highlights in JSON]
    M --> N[User fixes error]
    N --> I
    
    style A fill:#a855f7,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style K fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style L fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
```

### Edge Cases & Error Handling
- Invalid objectId generation → Auto-retry with new ID
- Coordinates outside slide bounds → Snap to valid area with visual indicator
- Duplicate objectId → Show error with suggestion to regenerate
- Invalid shape type → Revert to default rectangle

## Import Existing batchUpdate JSON

**User Goal:** Load an existing batchUpdate configuration for editing

**Entry Points:** File menu, drag-drop area, keyboard shortcut

**Success Criteria:** Valid JSON loaded, parsed, and displayed in both editor and preview

### Flow Diagram

```mermaid
graph TD
    A[User clicks Import] --> B[File dialog opens]
    B --> C[User selects JSON file]
    C --> D[File validation starts]
    D --> E{Valid JSON?}
    
    E -->|Yes| F[Parse batchUpdate array]
    F --> G[Validate Google Slides API compliance]
    G --> H{API Valid?}
    
    H -->|Yes| I[Load into editor]
    I --> J[Render in preview]
    J --> K[Success: File loaded]
    
    H -->|No| L[Show API validation errors]
    L --> M[Offer to fix common issues]
    M --> N[User accepts fixes]
    N --> I
    
    E -->|No| O[Show JSON syntax errors]
    O --> P[Highlight error location]
    P --> Q[User fixes or cancels]
    
    style A fill:#a855f7,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style K fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style L fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style O fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
```

### Edge Cases & Error Handling
- Large files (>1MB) → Progress indicator with streaming parse
- Corrupted JSON → Show specific syntax error location
- Partial API compliance → Offer assisted fixes
- Empty file → Load with default template structure

## Real-time Validation & Export

**User Goal:** Ensure configuration is valid and export for Google Slides API use

**Entry Points:** Continuous background validation, export button

**Success Criteria:** Clean JSON exported that works directly with Google Slides API

### Flow Diagram

```mermaid
graph TD
    A[User makes any edit] --> B[Real-time validation triggers]
    B --> C{All requests valid?}
    
    C -->|Yes| D[Green validation indicators]
    D --> E[Export button enabled]
    E --> F[User clicks Export]
    F --> G[Export dialog with options]
    G --> H[Generate clean JSON]
    H --> I[Success: File exported]
    
    C -->|No| J[Red validation indicators]
    J --> K[Show specific errors]
    K --> L[Export button disabled]
    L --> M[User fixes errors]
    M --> B
    
    style A fill:#a855f7,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style I fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style J fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
```

### Edge Cases & Error Handling
- Network timeout during validation → Retry with exponential backoff
- Complex validation taking >2s → Show progress indicator
- Export size >10MB → Warn user and offer compression
- Browser storage limits → Offer cloud export options
