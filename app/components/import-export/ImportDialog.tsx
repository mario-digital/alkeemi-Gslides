'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileJson, X, AlertCircle, CheckCircle } from 'lucide-react';
import { ValidationService } from '@/lib/services/ValidationService';
import { ValidationErrorList } from '../validation/ValidationErrorList';
import { ValidationBadge } from '../validation/ValidationBadge';
import { cn } from '@/lib/utils';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  maxFileSize?: number;
  className?: string;
}

export function ImportDialog({
  isOpen,
  onClose,
  onImport,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  className
}: ImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const validationService = useRef(ValidationService.getInstance());

  const resetState = useCallback(() => {
    setFile(null);
    setFileContent('');
    setParsedData(null);
    setValidationResult(null);
    setImportError(null);
    setIsValidating(false);
    setIsReading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const validateFile = useCallback(async (content: string) => {
    setIsValidating(true);
    setImportError(null);

    try {
      // First validate JSON syntax
      const jsonValidation = validationService.current.validateJsonString(content);
      
      if (!jsonValidation.isValid) {
        setValidationResult(jsonValidation);
        setIsValidating(false);
        return false;
      }

      // Parse JSON
      const parsed = JSON.parse(content);
      setParsedData(parsed);

      // Validate against schema
      const schemaValidation = validationService.current.validateBatchUpdate(parsed);
      setValidationResult(schemaValidation);
      setIsValidating(false);

      return schemaValidation.isValid;
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to validate file');
      setIsValidating(false);
      return false;
    }
  }, []);

  const processFile = useCallback(async (file: File) => {
    // Check file size
    if (file.size > maxFileSize) {
      setImportError(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
      return;
    }

    // Check file type
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      setImportError('Please select a JSON file');
      return;
    }

    setFile(file);
    setIsReading(true);
    setImportError(null);

    try {
      const content = await readFileContent(file);
      setFileContent(content);
      await validateFile(content);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to read file');
    } finally {
      setIsReading(false);
    }
  }, [maxFileSize, validateFile]);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleImport = useCallback(() => {
    if (parsedData && validationResult?.isValid) {
      onImport(parsedData);
      handleClose();
    }
  }, [parsedData, validationResult, onImport, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className={cn(
        'relative bg-card rounded-lg shadow-xl border w-full max-w-2xl max-h-[90vh] flex flex-col',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Import batchUpdate JSON</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a Google Slides batchUpdate JSON file
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!file ? (
            // File upload area
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Drop your JSON file here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Select File
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Max file size: {maxFileSize / 1024 / 1024}MB
              </p>
            </div>
          ) : (
            // File preview and validation
            <div className="space-y-4">
              {/* File info */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileJson className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetState}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change file
                </button>
              </div>

              {/* Validation status */}
              {isReading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Reading file...
                </div>
              )}

              {isValidating && (
                <ValidationBadge status="validating" size="md" />
              )}

              {!isReading && !isValidating && validationResult && (
                <>
                  <ValidationBadge
                    status={
                      validationResult.errors.length > 0 
                        ? 'error' 
                        : validationResult.warnings.length > 0 
                        ? 'warning' 
                        : 'valid'
                    }
                    errorCount={validationResult.errors.length}
                    warningCount={validationResult.warnings.length}
                    size="md"
                  />

                  {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                    <ValidationErrorList
                      errors={validationResult.errors}
                      warnings={validationResult.warnings}
                      maxHeight="300px"
                    />
                  )}

                  {validationResult.isValid && parsedData && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-100">
                            File validated successfully
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Found {parsedData.requests?.length || 0} batch update operations
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {importError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">
                        Import Error
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {importError}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!parsedData || !validationResult?.isValid || isReading || isValidating}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              parsedData && validationResult?.isValid
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}