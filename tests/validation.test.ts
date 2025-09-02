import { describe, test, expect, beforeEach } from 'bun:test';
import { ValidationService } from '../lib/services/ValidationService';
import { 
  BatchUpdateRequestSchema,
  validateBatchUpdateRequest,
  validateBatchUpdateOperation
} from '../lib/validation/schemas/batch-update.schema';

describe('ValidationService', () => {
  let validationService: ValidationService;

  beforeEach(() => {
    validationService = ValidationService.getInstance();
  });

  describe('validateBatchUpdate', () => {
    test('validates valid batch update request', () => {
      const validRequest = {
        requests: [
          {
            createSlide: {
              insertionIndex: 0,
              objectId: 'slide_1'
            }
          }
        ]
      };

      const result = validationService.validateBatchUpdate(validRequest);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects invalid JSON syntax', () => {
      const invalidJson = '{ "requests": [}';
      const result = validationService.validateBatchUpdate(invalidJson);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('SYNTAX_ERROR');
    });

    test('detects missing required fields', () => {
      const invalidRequest = {
        requests: [
          {
            createShape: {
              // Missing required shapeType and elementProperties
              shapeType: '', // Empty string should fail
              elementProperties: {
                pageObjectId: '' // Empty pageObjectId should fail
              }
            }
          }
        ]
      };

      const result = validationService.validateBatchUpdate(invalidRequest);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('detects duplicate object IDs', () => {
      const requestWithDuplicates = {
        requests: [
          {
            createSlide: {
              objectId: 'duplicate_id'
            }
          },
          {
            createShape: {
              objectId: 'duplicate_id',
              shapeType: 'RECTANGLE',
              elementProperties: {
                pageObjectId: 'slide_1'
              }
            }
          }
        ]
      };

      const result = validationService.validateBatchUpdate(requestWithDuplicates);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_ID')).toBe(true);
    });

    test('validates color values', () => {
      const requestWithInvalidColor = {
        requests: [
          {
            updateTextStyle: {
              objectId: 'text_1',
              style: {
                foregroundColor: {
                  opaqueColor: {
                    rgbColor: {
                      red: 2.0, // Invalid: should be 0-1
                      green: 0.5,
                      blue: 0.5
                    }
                  }
                }
              },
              fields: 'foregroundColor'
            }
          }
        ]
      };

      const result = validationService.validateBatchUpdate(requestWithInvalidColor);
      expect(result.isValid).toBe(false);
      // The zod validation will catch this as a too_big error for RGB values > 1
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('warns about operations on non-existent objects', () => {
      const request = {
        requests: [
          {
            updatePageElementTransform: {
              objectId: 'non_existent',
              transform: {
                translateX: 100,
                translateY: 100,
                unit: 'PT'
              },
              applyMode: 'ABSOLUTE'
            }
          }
        ]
      };

      const result = validationService.validateBatchUpdate(request);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.code === 'UNKNOWN_REFERENCE')).toBe(true);
    });

    test('warns about elements outside slide bounds', () => {
      const request = {
        requests: [
          {
            createShape: {
              objectId: 'shape_1',
              shapeType: 'RECTANGLE',
              elementProperties: {
                pageObjectId: 'slide_1',
                transform: {
                  translateX: 1000, // Outside typical slide bounds
                  translateY: 1000,
                  unit: 'PT'
                }
              }
            }
          }
        ]
      };

      const result = validationService.validateBatchUpdate(request);
      expect(result.warnings.some(w => w.code === 'BOUNDS_WARNING')).toBe(true);
    });
  });

  describe('validateOperation', () => {
    test('validates single valid operation', () => {
      const operation = {
        createSlide: {
          insertionIndex: 0
        }
      };

      const result = validationService.validateOperation(operation);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validates operation with all required fields', () => {
      const operation = {
        createShape: {
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: 'slide_1',
            size: {
              width: { magnitude: 100, unit: 'PT' },
              height: { magnitude: 100, unit: 'PT' }
            }
          }
        }
      };

      const result = validationService.validateOperation(operation);
      expect(result.isValid).toBe(true);
    });

    test('warns about very small elements', () => {
      const operation = {
        createShape: {
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: 'slide_1',
            size: {
              width: { magnitude: 0.5, unit: 'PT' },
              height: { magnitude: 0.5, unit: 'PT' }
            }
          }
        }
      };

      const result = validationService.validateOperation(operation);
      expect(result.warnings.some(w => w.code === 'SIZE_WARNING')).toBe(true);
    });

    test('warns about very long text', () => {
      const longText = 'a'.repeat(31000);
      const operation = {
        insertText: {
          objectId: 'text_1',
          text: longText
        }
      };

      const result = validationService.validateOperation(operation);
      expect(result.warnings.some(w => w.code === 'TEXT_LENGTH_WARNING')).toBe(true);
    });
  });

  describe('suggestFixes', () => {
    test('provides helpful suggestions for errors', () => {
      const errors = [
        { path: 'test', message: 'Invalid type', code: 'invalid_type', suggestion: undefined },
        { path: 'test2', message: 'Duplicate ID', code: 'DUPLICATE_ID', suggestion: undefined }
      ];

      const suggestions = validationService.suggestFixes(errors);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('unique'))).toBe(true);
    });
  });
});

describe('Zod Schemas', () => {
  test('validates complete batch update request', () => {
    const request = {
      requests: [
        {
          createSlide: {
            objectId: 'slide_1',
            insertionIndex: 0,
            slideLayoutReference: {
              predefinedLayout: 'TITLE_AND_BODY'
            }
          }
        },
        {
          createShape: {
            objectId: 'shape_1',
            shapeType: 'RECTANGLE',
            elementProperties: {
              pageObjectId: 'slide_1',
              size: {
                width: { magnitude: 100, unit: 'PT' },
                height: { magnitude: 50, unit: 'PT' }
              },
              transform: {
                translateX: 10,
                translateY: 10,
                unit: 'PT'
              }
            }
          }
        },
        {
          insertText: {
            objectId: 'shape_1',
            text: 'Hello World',
            insertionIndex: 0
          }
        }
      ]
    };

    const result = validateBatchUpdateRequest(request);
    expect(result.success).toBe(true);
  });

  test('rejects invalid enum values', () => {
    const request = {
      requests: [
        {
          updatePageElementTransform: {
            objectId: 'element_1',
            transform: {
              translateX: 100,
              translateY: 100,
              unit: 'INVALID_UNIT' // Should be EMU or PT
            },
            applyMode: 'ABSOLUTE'
          }
        }
      ]
    };

    const result = validateBatchUpdateRequest(request);
    expect(result.success).toBe(false);
  });

  test('validates complex nested structures', () => {
    const operation = {
      updateShapeProperties: {
        objectId: 'shape_1',
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: {
              color: {
                rgbColor: {
                  red: 0.5,
                  green: 0.5,
                  blue: 0.5
                }
              },
              alpha: 0.8
            },
            propertyState: 'RENDERED'
          },
          outline: {
            outlineFill: {
              solidFill: {
                color: {
                  rgbColor: {
                    red: 0,
                    green: 0,
                    blue: 0
                  }
                }
              }
            },
            weight: {
              magnitude: 2,
              unit: 'PT'
            },
            dashStyle: 'SOLID',
            propertyState: 'RENDERED'
          },
          shadow: {
            type: 'OUTER',
            alignment: 'BOTTOM_RIGHT',
            blurRadius: {
              magnitude: 5,
              unit: 'PT'
            },
            color: {
              rgbColor: {
                red: 0,
                green: 0,
                blue: 0
              }
            },
            alpha: 0.3,
            rotateWithShape: false,
            propertyState: 'RENDERED'
          }
        },
        fields: 'shapeBackgroundFill,outline,shadow'
      }
    };

    const result = validateBatchUpdateOperation(operation);
    expect(result.success).toBe(true);
  });
});