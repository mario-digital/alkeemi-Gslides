# Information Architecture (IA)

## Site Map / Screen Inventory

```mermaid
graph TD
    A[Main App] --> B[Split Screen Layout]
    B --> C[Left Panel - Editor]
    B --> D[Right Panel - Preview]
    
    C --> C1[BatchUpdate Editor]
    C --> C2[Element Inspector]
    C --> C3[File Operations]
    C --> C4[Validation Panel]
    
    D --> D1[Slide Preview Canvas]
    D --> D2[Element Selection Overlay]
    D --> D3[Coordinate System Display]
    
    C3 --> E1[Import JSON Dialog]
    C3 --> E2[Export Options Dialog]
    C3 --> E3[Validation Error List]
    
    C1 --> F1[Shape Properties Panel]
    C1 --> F2[Text Properties Panel]
    C1 --> F3[Transform Properties Panel]
    
    style A fill:#a855f7,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style B fill:#1a1a2e,stroke:#6366f1,stroke-width:2px,color:#f8fafc
    style C fill:#16213e,stroke:#a855f7,stroke-width:1px,color:#f8fafc
    style D fill:#0a0a0f,stroke:#22d3ee,stroke-width:1px,color:#f8fafc
```

## Navigation Structure

**Primary Navigation:** Header toolbar with File Operations (Import/Export), Validation Status, and Help

**Secondary Navigation:** Left panel tabs for different editing modes (Elements, Properties, Raw JSON)

**Breadcrumb Strategy:** Real-time path showing current element selection in batchUpdate array
