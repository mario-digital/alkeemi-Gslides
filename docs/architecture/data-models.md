# Data Models

## Core Data Model: Google Slides batchUpdate Array

**Purpose:** The singular source of truth for all slide configuration data. Every UI interaction maps directly to valid batchUpdate request objects.

**Key Architecture Principles:**
- **batchUpdate Array:** `Array<BatchUpdateRequest>` - The complete state of the application
- **No Internal Models:** UI components read/write directly to valid Google Slides API structures  
- **Immutable Updates:** State changes produce new valid batchUpdate arrays
- **Validation-First:** All changes validated against Google Slides API schema before commit

```typescript
// Primary Application State
interface AppState {
  batchUpdateRequests: BatchUpdateRequest[];
  currentSlideId?: string;
  validationErrors: ValidationError[];
  isExportBlocked: boolean;
}

// Google Slides API Request Types (exact API compliance)
type BatchUpdateRequest = 
  | CreateSlideRequest
  | CreateShapeRequest
  | CreateTextBoxRequest
  | CreateImageRequest
  | UpdateShapePropertiesRequest
  | UpdateTextStyleRequest
  | UpdateImagePropertiesRequest
  | DeleteObjectRequest;

interface CreateShapeRequest {
  createShape: {
    objectId: string;
    shapeType: 'RECTANGLE' | 'ELLIPSE' | 'ROUND_RECTANGLE' | 'TEXT_BOX' | 'CLOUD' | 'CUSTOM';
    elementProperties: {
      pageObjectId: string;
      size: {
        width: { magnitude: number; unit: 'EMU' | 'PT' };
        height: { magnitude: number; unit: 'EMU' | 'PT' };
      };
      transform: {
        scaleX: number;
        scaleY: number;
        translateX: number;
        translateY: number;
        unit: 'EMU' | 'PT';
      };
    };
  };
}
```
