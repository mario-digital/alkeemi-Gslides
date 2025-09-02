import { useEffect, useCallback } from 'react';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import { useRealtimeValidation } from './useRealtimeValidation';
import { ValidationService } from '../services/ValidationService';

/**
 * Hook that integrates validation with the batch update store
 */
export function useStoreValidation() {
  const { operations, importOperations } = useBatchUpdateStore();
  
  // Create batchUpdate request from operations
  const batchUpdateData = { requests: operations };
  
  // Use real-time validation
  const validationResult = useRealtimeValidation(batchUpdateData, {
    debounceMs: 300,
    validateOnMount: true,
    enableWarnings: true
  });

  // Import with validation
  const importWithValidation = useCallback(async (data: any) => {
    const validationService = ValidationService.getInstance();
    const result = validationService.validateBatchUpdate(data);
    
    if (result.isValid || (result.errors.length === 0 && result.warnings.length > 0)) {
      // Import if valid or only has warnings
      importOperations(data.requests || []);
      return { success: true, validation: result };
    }
    
    return { success: false, validation: result };
  }, [importOperations]);

  // Validate before export
  const canExport = useCallback(() => {
    return validationResult.validationResult.isValid || 
           (validationResult.errorCount === 0 && validationResult.warningCount > 0);
  }, [validationResult]);

  // Get export-ready data
  const getExportData = useCallback(() => {
    if (!canExport()) {
      throw new Error('Cannot export: validation errors present');
    }
    return batchUpdateData;
  }, [batchUpdateData, canExport]);

  return {
    ...validationResult,
    importWithValidation,
    canExport: canExport(),
    getExportData,
    operations,
    batchUpdateData
  };
}

/**
 * Hook for validating operations before adding to store
 */
export function useOperationValidator() {
  const { addOperation, updateOperation } = useBatchUpdateStore();
  const validationService = ValidationService.getInstance();

  const addValidatedOperation = useCallback((operation: any) => {
    const result = validationService.validateOperation(operation);
    
    if (result.isValid) {
      addOperation(operation);
      return { success: true, validation: result };
    }
    
    return { success: false, validation: result };
  }, [addOperation, validationService]);

  const updateValidatedOperation = useCallback((index: number, operation: any) => {
    const result = validationService.validateOperation(operation);
    
    if (result.isValid) {
      updateOperation(index, operation);
      return { success: true, validation: result };
    }
    
    return { success: false, validation: result };
  }, [updateOperation, validationService]);

  return {
    addValidatedOperation,
    updateValidatedOperation
  };
}