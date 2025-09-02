import { z } from 'zod';
import {
  BatchUpdateRequestSchema,
  BatchUpdateOperationSchema,
  validateBatchUpdateRequest,
  validateBatchUpdateOperation
} from '../validation/schemas/batch-update.schema';

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  /**
   * Validates a complete batchUpdate request
   */
  public validateBatchUpdate(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    try {
      // Parse the data as JSON if it's a string
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Validate against schema
      const validationResult = validateBatchUpdateRequest(parsedData);
      
      if (!validationResult.success && validationResult.errors) {
        errors.push(...this.formatZodErrors(validationResult.errors));
      }

      // Additional custom validations
      if (validationResult.success && validationResult.data) {
        this.performCustomValidations(validationResult.data, errors, warnings);
      }

    } catch (error) {
      if (error instanceof SyntaxError) {
        errors.push({
          path: 'root',
          message: 'Invalid JSON format',
          code: 'SYNTAX_ERROR',
          suggestion: 'Ensure the JSON is properly formatted with matching brackets and quotes'
        });
      } else {
        errors.push({
          path: 'root',
          message: error instanceof Error ? error.message : 'Unknown validation error',
          code: 'UNKNOWN_ERROR'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates a single batch update operation
   */
  public validateOperation(operation: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    const validationResult = validateBatchUpdateOperation(operation);
    
    if (!validationResult.success && validationResult.errors) {
      errors.push(...this.formatZodErrors(validationResult.errors));
    }

    if (validationResult.success && validationResult.data) {
      this.validateOperationConstraints(validationResult.data, errors, warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Formats Zod errors into our ValidationError format
   */
  private formatZodErrors(zodError: z.ZodError): ValidationError[] {
    if (!zodError || !zodError.errors) {
      return [];
    }
    return zodError.errors.map(error => {
      const path = error.path.join('.');
      const suggestion = this.getSuggestionForError(error);
      
      return {
        path: path || 'root',
        message: error.message,
        code: error.code,
        suggestion
      };
    });
  }

  /**
   * Provides helpful suggestions based on the error type
   */
  private getSuggestionForError(error: z.ZodIssue): string | undefined {
    switch (error.code) {
      case 'invalid_type':
        return `Expected ${error.expected}, but received ${error.received}`;
      
      case 'invalid_enum_value':
        return `Valid values are: ${(error as any).options?.join(', ')}`;
      
      case 'too_small':
        return `Value must be at least ${(error as any).minimum}`;
      
      case 'too_big':
        return `Value must be at most ${(error as any).maximum}`;
      
      case 'invalid_string':
        return 'Check the format of the string value';
      
      case 'unrecognized_keys':
        return `Remove unrecognized keys: ${(error as any).keys?.join(', ')}`;
      
      default:
        return undefined;
    }
  }

  /**
   * Performs custom validations beyond schema validation
   */
  private performCustomValidations(
    data: z.infer<typeof BatchUpdateRequestSchema>,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    // Validate colors in all operations
    this.validateColors(data, errors);
    // Check for duplicate object IDs
    const objectIds = new Set<string>();
    const duplicateIds = new Set<string>();

    data.requests.forEach((request, index) => {
      let objectId: string | undefined;

      // Extract objectId based on request type
      if ('createSlide' in request) {
        objectId = request.createSlide.objectId;
      } else if ('createShape' in request) {
        objectId = request.createShape.objectId;
      } else if ('createTable' in request) {
        objectId = request.createTable.objectId;
      }

      if (objectId) {
        if (objectIds.has(objectId)) {
          duplicateIds.add(objectId);
          errors.push({
            path: `requests[${index}].objectId`,
            message: `Duplicate objectId: ${objectId}`,
            code: 'DUPLICATE_ID',
            suggestion: 'Each objectId must be unique within the presentation'
          });
        }
        objectIds.add(objectId);
      }
    });

    // Check for operations on non-existent objects
    const createdObjects = new Set<string>();
    
    data.requests.forEach((request, index) => {
      // Track created objects
      if ('createSlide' in request && request.createSlide.objectId) {
        createdObjects.add(request.createSlide.objectId);
      } else if ('createShape' in request && request.createShape.objectId) {
        createdObjects.add(request.createShape.objectId);
      } else if ('createTable' in request && request.createTable.objectId) {
        createdObjects.add(request.createTable.objectId);
      }

      // Check if operations reference existing objects
      let referencedId: string | undefined;
      
      if ('updatePageElementTransform' in request) {
        referencedId = request.updatePageElementTransform.objectId;
      } else if ('deleteObject' in request) {
        referencedId = request.deleteObject.objectId;
      } else if ('insertText' in request) {
        referencedId = request.insertText.objectId;
      } else if ('deleteText' in request) {
        referencedId = request.deleteText.objectId;
      } else if ('updateTextStyle' in request) {
        referencedId = request.updateTextStyle.objectId;
      } else if ('updateShapeProperties' in request) {
        referencedId = request.updateShapeProperties.objectId;
      } else if ('updatePageProperties' in request) {
        referencedId = request.updatePageProperties.objectId;
      }

      if (referencedId && !createdObjects.has(referencedId)) {
        warnings.push({
          path: `requests[${index}].objectId`,
          message: `Operation references objectId '${referencedId}' which may not exist`,
          code: 'UNKNOWN_REFERENCE',
          suggestion: 'Ensure this object exists or is created before this operation'
        });
      }
    });

    // Validate coordinate bounds
    this.validateCoordinateBounds(data, warnings);
  }

  /**
   * Validates operation-specific constraints
   */
  private validateOperationConstraints(
    operation: any,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    // Validate element bounds
    if ('createShape' in operation || 'createTable' in operation) {
      const elementProps = operation.createShape?.elementProperties || operation.createTable?.elementProperties;
      
      if (elementProps?.size) {
        const width = elementProps.size.width.magnitude;
        const height = elementProps.size.height.magnitude;
        const unit = elementProps.size.width.unit;

        // Check for reasonable size bounds (in PT)
        const maxSize = unit === 'PT' ? 720 : 9144000; // 10 inches in PT or EMU
        const minSize = unit === 'PT' ? 1 : 12700; // Minimum visible size

        if (width > maxSize || height > maxSize) {
          warnings.push({
            path: 'elementProperties.size',
            message: 'Element size may be too large for the slide',
            code: 'SIZE_WARNING',
            suggestion: `Consider keeping dimensions under ${unit === 'PT' ? '720' : '9144000'} ${unit}`
          });
        }

        if (width < minSize || height < minSize) {
          warnings.push({
            path: 'elementProperties.size',
            message: 'Element size may be too small to be visible',
            code: 'SIZE_WARNING',
            suggestion: `Consider making dimensions at least ${unit === 'PT' ? '1' : '12700'} ${unit}`
          });
        }
      }
    }

    // Validate text operations
    if ('insertText' in operation) {
      const text = operation.insertText.text;
      if (text.length > 30000) {
        warnings.push({
          path: 'insertText.text',
          message: 'Text content is very long',
          code: 'TEXT_LENGTH_WARNING',
          suggestion: 'Consider breaking up text into multiple text boxes for better performance'
        });
      }
    }

    // Validate color values
    this.validateColors(operation, errors);
  }

  /**
   * Validates RGB color values are within bounds
   */
  private validateColors(data: any, errors: ValidationError[]): void {
    const validateRgbColor = (color: any, path: string) => {
      if (color?.rgbColor) {
        const { red, green, blue } = color.rgbColor;
        
        [
          { value: red, name: 'red' },
          { value: green, name: 'green' },
          { value: blue, name: 'blue' }
        ].forEach(({ value, name }) => {
          if (value !== undefined && (value < 0 || value > 1)) {
            errors.push({
              path: `${path}.rgbColor.${name}`,
              message: `RGB ${name} value must be between 0 and 1`,
              code: 'INVALID_COLOR',
              suggestion: 'RGB values should be decimals between 0 and 1'
            });
          }
        });
      }
    };

    // Recursively check for color properties
    const checkColors = (obj: any, path: string = '') => {
      if (!obj || typeof obj !== 'object') return;

      Object.keys(obj).forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        
        if (key === 'foregroundColor' || key === 'backgroundColor' || key === 'color') {
          validateRgbColor(obj[key]?.opaqueColor || obj[key], newPath);
        } else if (typeof obj[key] === 'object') {
          checkColors(obj[key], newPath);
        }
      });
    };

    checkColors(data);
  }

  /**
   * Validates that coordinates are within reasonable slide bounds
   */
  private validateCoordinateBounds(
    data: z.infer<typeof BatchUpdateRequestSchema>,
    warnings: ValidationError[]
  ): void {
    // Standard slide dimensions in EMU
    const SLIDE_WIDTH_EMU = 9144000; // 10 inches
    const SLIDE_HEIGHT_EMU = 6858000; // 7.5 inches
    
    // Standard slide dimensions in PT
    const SLIDE_WIDTH_PT = 720;
    const SLIDE_HEIGHT_PT = 540;

    data.requests.forEach((request, index) => {
      if ('createShape' in request || 'createTable' in request) {
        const elementProps = 'createShape' in request 
          ? request.createShape.elementProperties 
          : request.createTable.elementProperties;

        if (elementProps.transform) {
          const { translateX, translateY, unit } = elementProps.transform;
          const maxWidth = unit === 'PT' ? SLIDE_WIDTH_PT : SLIDE_WIDTH_EMU;
          const maxHeight = unit === 'PT' ? SLIDE_HEIGHT_PT : SLIDE_HEIGHT_EMU;

          if (translateX && translateX > maxWidth) {
            warnings.push({
              path: `requests[${index}].elementProperties.transform.translateX`,
              message: 'Element may be positioned outside slide bounds',
              code: 'BOUNDS_WARNING',
              suggestion: `X position should be less than ${maxWidth} ${unit || 'EMU'}`
            });
          }

          if (translateY && translateY > maxHeight) {
            warnings.push({
              path: `requests[${index}].elementProperties.transform.translateY`,
              message: 'Element may be positioned outside slide bounds',
              code: 'BOUNDS_WARNING',
              suggestion: `Y position should be less than ${maxHeight} ${unit || 'EMU'}`
            });
          }

          if (translateX && translateX < 0) {
            warnings.push({
              path: `requests[${index}].elementProperties.transform.translateX`,
              message: 'Element has negative X position',
              code: 'BOUNDS_WARNING',
              suggestion: 'Consider using positive coordinates for better compatibility'
            });
          }

          if (translateY && translateY < 0) {
            warnings.push({
              path: `requests[${index}].elementProperties.transform.translateY`,
              message: 'Element has negative Y position',
              code: 'BOUNDS_WARNING',
              suggestion: 'Consider using positive coordinates for better compatibility'
            });
          }
        }
      }
    });
  }

  /**
   * Validates a JSON string for basic structure
   */
  public validateJsonString(jsonString: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    try {
      JSON.parse(jsonString);
    } catch (error) {
      if (error instanceof SyntaxError) {
        const match = error.message.match(/position (\d+)/);
        const position = match ? parseInt(match[1]) : undefined;
        
        errors.push({
          path: 'root',
          message: error.message,
          code: 'JSON_SYNTAX_ERROR',
          suggestion: position 
            ? `Check character at position ${position} for syntax errors`
            : 'Check for missing brackets, quotes, or commas'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Provides fix suggestions for common errors
   */
  public suggestFixes(errors: ValidationError[]): string[] {
    const suggestions: string[] = [];
    const errorTypes = new Set<string>();

    errors.forEach(error => {
      if (!errorTypes.has(error.code)) {
        errorTypes.add(error.code);

        switch (error.code) {
          case 'invalid_type':
            suggestions.push('Check data types - ensure numbers are not quoted as strings');
            break;
          case 'DUPLICATE_ID':
            suggestions.push('Ensure all objectId values are unique');
            break;
          case 'invalid_enum_value':
            suggestions.push('Check that enum values match exactly (case-sensitive)');
            break;
          case 'JSON_SYNTAX_ERROR':
            suggestions.push('Validate JSON syntax using a JSON formatter');
            break;
          case 'UNKNOWN_REFERENCE':
            suggestions.push('Ensure objects are created before being referenced in operations');
            break;
        }
      }
    });

    return suggestions;
  }
}

export default ValidationService;