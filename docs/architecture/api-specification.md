# API Specification

Since this is a **frontend-only application**, there are no traditional REST/GraphQL APIs. However, the application has critical **internal APIs** for managing the batchUpdate JSON data structure.

## Internal Data APIs

```typescript
// Core batchUpdate Management API
interface BatchUpdateAPI {
  // State Management
  getBatchUpdateArray(): BatchUpdateRequest[];
  setBatchUpdateArray(requests: BatchUpdateRequest[]): Promise<ValidationResult>;
  
  // Element Creation APIs
  createShape(params: CreateShapeParams): Promise<string>; // Returns objectId
  createTextBox(params: CreateTextBoxParams): Promise<string>;
  createImage(params: CreateImageParams): Promise<string>;
  
  // Element Update APIs  
  updateShapeProperties(objectId: string, properties: ShapeProperties): Promise<void>;
  updateTextStyle(objectId: string, style: TextStyle): Promise<void>;
  updateElementTransform(objectId: string, transform: AffineTransform): Promise<void>;
  
  // Element Deletion
  deleteElement(objectId: string): Promise<void>;
  
  // Validation
  validateBatchUpdate(): ValidationResult;
  
  // Import/Export
  importFromJSON(json: BatchUpdateRequest[]): Promise<ValidationResult>;
  exportToJSON(): BatchUpdateRequest[];
  exportToMarkdown(filename: string): string;
}
```

## Sample Markdown Export

When a user exports a configuration as a Markdown (.md) file, the exported file must include:

- A summary/header
- Optional slide title/description fields (user-editable)
- The full Google Slides batchUpdate JSON block in a fenced code block

This format ensures all exported Markdown files are consistent, easily auditable, and can be shared or versioned by other developers or stakeholders.

**Sample Markdown Export:**

```markdown
# Alkemy GSlide Export (2025-09-01)

# Slide Title: [User enters title here]
# Slide Description: [Optional user input]

# Google Slides batchUpdate JSON

```json
[
  {
    "createShape": {
      "objectId": "slide_18_journey_container",
      "shapeType": "RECTANGLE",
      "elementProperties": {
        "pageObjectId": "slide_18",
        "size": {
          "width": {"magnitude": 450, "unit": "PT"},
          "height": {"magnitude": 90, "unit": "PT"}
        },
        "transform": {
          "scaleX": 1,
          "scaleY": 1,
          "translateX": 37.5,
          "translateY": 90,
          "unit": "PT"
        }
      }
    }
  },
  {
    "updateShapeProperties": {
      "objectId": "slide_18_journey_container",
      "shapeProperties": {
        "shapeBackgroundFill": {
          "solidFill": {
            "color": {
              "rgbColor": {"red": 0.976, "green": 0.98, "blue": 0.984}
            }
          }
        },
        "outline": {
          "outlineFill": {
            "solidFill": {
              "color": {
                "rgbColor": {"red": 0.42, "green": 0.447, "blue": 0.502}
              }
            }
          },
          "weight": {"magnitude": 2, "unit": "PT"}
        }
      },
      "fields": "shapeBackgroundFill,outline"
    }
  }
  // ...additional requests as needed
]
```

---

**Summary:**  
*This section guarantees that everyone—dev, PM, or stakeholder—knows the exact, required Markdown export format for Alkemy GSlide, and how exported files should look every time.*
```
