import { useEffect, useState, useCallback, useRef } from 'react';
import { ValidationService, ValidationResult, ValidationError } from '../services/ValidationService';
import { debounce } from '../utils/debounce';

interface UseRealtimeValidationOptions {
  debounceMs?: number;
  validateOnMount?: boolean;
  enableWarnings?: boolean;
}

interface UseRealtimeValidationReturn {
  validationResult: ValidationResult;
  isValidating: boolean;
  validate: (data: unknown) => Promise<ValidationResult>;
  clearValidation: () => void;
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
}

export function useRealtimeValidation(
  data: unknown,
  options: UseRealtimeValidationOptions = {}
): UseRealtimeValidationReturn {
  const {
    debounceMs = 300,
    validateOnMount = true,
    enableWarnings = true
  } = options;

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [isValidating, setIsValidating] = useState(false);

  const validationService = useRef(ValidationService.getInstance());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Validation function
  const performValidation = useCallback(async (dataToValidate: unknown): Promise<ValidationResult> => {
    // Cancel any pending validation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this validation
    abortControllerRef.current = new AbortController();

    setIsValidating(true);

    try {
      // Perform validation in a non-blocking way
      const result = await new Promise<ValidationResult>((resolve) => {
        // Use setTimeout to make validation async
        setTimeout(() => {
          if (abortControllerRef.current?.signal.aborted) {
            resolve({ isValid: true, errors: [], warnings: [] });
            return;
          }

          const validationResult = validationService.current.validateBatchUpdate(dataToValidate);
          
          // Filter warnings if disabled
          if (!enableWarnings) {
            validationResult.warnings = [];
          }

          resolve(validationResult);
        }, 0);
      });

      if (!abortControllerRef.current?.signal.aborted) {
        setValidationResult(result);
        setIsValidating(false);
        return result;
      }

      return { isValid: true, errors: [], warnings: [] };
    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        errors: [{
          path: 'root',
          message: error instanceof Error ? error.message : 'Validation failed',
          code: 'VALIDATION_ERROR'
        }],
        warnings: []
      };
      
      setValidationResult(errorResult);
      setIsValidating(false);
      return errorResult;
    }
  }, [enableWarnings]);

  // Debounced validation
  const debouncedValidation = useCallback(
    debounce(performValidation, debounceMs),
    [performValidation, debounceMs]
  );

  // Clear validation results
  const clearValidation = useCallback(() => {
    setValidationResult({
      isValid: true,
      errors: [],
      warnings: []
    });
    setIsValidating(false);
  }, []);

  // Validate on data change
  useEffect(() => {
    if (data !== undefined && data !== null) {
      debouncedValidation(data);
    } else {
      clearValidation();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [data, debouncedValidation, clearValidation]);

  // Validate on mount if requested
  useEffect(() => {
    if (validateOnMount && data !== undefined && data !== null) {
      performValidation(data);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    validationResult,
    isValidating,
    validate: performValidation,
    clearValidation,
    hasErrors: validationResult.errors.length > 0,
    hasWarnings: validationResult.warnings.length > 0,
    errorCount: validationResult.errors.length,
    warningCount: validationResult.warnings.length
  };
}

/**
 * Hook for validating individual operations
 */
export function useOperationValidation(
  operation: unknown,
  options: UseRealtimeValidationOptions = {}
): UseRealtimeValidationReturn {
  const {
    debounceMs = 200,
    validateOnMount = false,
    enableWarnings = true
  } = options;

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [isValidating, setIsValidating] = useState(false);

  const validationService = useRef(ValidationService.getInstance());

  const performValidation = useCallback(async (op: unknown): Promise<ValidationResult> => {
    setIsValidating(true);

    try {
      const result = validationService.current.validateOperation(op);
      
      if (!enableWarnings) {
        result.warnings = [];
      }

      setValidationResult(result);
      setIsValidating(false);
      return result;
    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        errors: [{
          path: 'root',
          message: error instanceof Error ? error.message : 'Validation failed',
          code: 'VALIDATION_ERROR'
        }],
        warnings: []
      };
      
      setValidationResult(errorResult);
      setIsValidating(false);
      return errorResult;
    }
  }, [enableWarnings]);

  const debouncedValidation = useCallback(
    debounce(performValidation, debounceMs),
    [performValidation, debounceMs]
  );

  const clearValidation = useCallback(() => {
    setValidationResult({
      isValid: true,
      errors: [],
      warnings: []
    });
    setIsValidating(false);
  }, []);

  useEffect(() => {
    if (operation !== undefined && operation !== null) {
      debouncedValidation(operation);
    } else {
      clearValidation();
    }
  }, [operation, debouncedValidation, clearValidation]);

  useEffect(() => {
    if (validateOnMount && operation !== undefined && operation !== null) {
      performValidation(operation);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    validationResult,
    isValidating,
    validate: performValidation,
    clearValidation,
    hasErrors: validationResult.errors.length > 0,
    hasWarnings: validationResult.warnings.length > 0,
    errorCount: validationResult.errors.length,
    warningCount: validationResult.warnings.length
  };
}

/**
 * Hook for JSON string validation
 */
export function useJsonValidation(
  jsonString: string,
  options: UseRealtimeValidationOptions = {}
): UseRealtimeValidationReturn & { parsedData: unknown | null } {
  const [parsedData, setParsedData] = useState<unknown | null>(null);
  const validationService = useRef(ValidationService.getInstance());

  // First validate JSON syntax
  const jsonSyntaxValidation = useCallback((str: string) => {
    if (!str) {
      return { isValid: true, errors: [], warnings: [] };
    }
    return validationService.current.validateJsonString(str);
  }, []);

  // Then validate the parsed content
  const contentValidation = useRealtimeValidation(parsedData, options);

  // Combine both validations
  const [combinedResult, setCombinedResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });

  useEffect(() => {
    const syntaxResult = jsonSyntaxValidation(jsonString);
    
    if (syntaxResult.isValid) {
      try {
        const parsed = JSON.parse(jsonString);
        setParsedData(parsed);
      } catch {
        setParsedData(null);
      }
    } else {
      setParsedData(null);
      setCombinedResult(syntaxResult);
    }
  }, [jsonString, jsonSyntaxValidation]);

  useEffect(() => {
    if (parsedData !== null) {
      setCombinedResult(contentValidation.validationResult);
    }
  }, [parsedData, contentValidation.validationResult]);

  return {
    ...contentValidation,
    validationResult: combinedResult,
    parsedData
  };
}