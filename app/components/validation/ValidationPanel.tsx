'use client';

import React, { useMemo } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';
import { useRealtimeValidation } from '@/lib/hooks/useRealtimeValidation';
import { ValidationBadge } from './ValidationBadge';
import { ValidationErrorList } from './ValidationErrorList';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import { cn } from '@/lib/utils';

interface ValidationPanelProps {
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showSuggestions?: boolean;
}

export function ValidationPanel({
  className,
  collapsible = true,
  defaultCollapsed = false,
  showSuggestions = true
}: ValidationPanelProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { operations } = useBatchUpdateStore();

  // Create batchUpdate request from operations
  const batchUpdateData = useMemo(() => ({
    requests: operations
  }), [operations]);

  // Use real-time validation
  const {
    validationResult,
    isValidating,
    hasErrors,
    hasWarnings,
    errorCount,
    warningCount
  } = useRealtimeValidation(batchUpdateData, {
    debounceMs: 300,
    validateOnMount: true,
    enableWarnings: true
  });

  const getStatusIcon = () => {
    if (isValidating) {
      return <Shield className="w-5 h-5 animate-pulse text-blue-500" />;
    }
    if (hasErrors) {
      return <ShieldOff className="w-5 h-5 text-red-500" />;
    }
    if (hasWarnings) {
      return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
    }
    return <ShieldCheck className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (isValidating) return 'Validating...';
    if (hasErrors) return `${errorCount} Error${errorCount !== 1 ? 's' : ''}`;
    if (hasWarnings) return `${warningCount} Warning${warningCount !== 1 ? 's' : ''}`;
    return 'Valid';
  };

  const getStatusColor = () => {
    if (isValidating) return 'text-blue-600 dark:text-blue-400';
    if (hasErrors) return 'text-red-600 dark:text-red-400';
    if (hasWarnings) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header */}
      <div 
        className={cn(
          'flex items-center justify-between p-4 border-b',
          collapsible && 'cursor-pointer hover:bg-muted/50 transition-colors'
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-sm">Validation Status</h3>
            <p className={cn('text-xs', getStatusColor())}>
              {getStatusText()}
            </p>
          </div>
        </div>

        <ValidationBadge
          status={
            isValidating 
              ? 'validating'
              : hasErrors 
              ? 'error' 
              : hasWarnings 
              ? 'warning' 
              : 'valid'
          }
          errorCount={errorCount}
          warningCount={warningCount}
          size="sm"
          showCount={false}
        />
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          {operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No operations to validate</p>
              <p className="text-xs mt-1">Import or create operations to see validation status</p>
            </div>
          ) : (hasErrors || hasWarnings) ? (
            <ValidationErrorList
              errors={validationResult.errors}
              warnings={validationResult.warnings}
              showSuggestions={showSuggestions}
              maxHeight="300px"
            />
          ) : (
            <div className="flex items-center gap-3 py-4">
              <ShieldCheck className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  All validations passed
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {operations.length} operation{operations.length !== 1 ? 's' : ''} ready for export
                </p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {operations.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Total Operations</p>
                  <p className="font-medium">{operations.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Validation Status</p>
                  <p className={cn('font-medium', getStatusColor())}>
                    {validationResult.isValid ? 'Ready' : 'Issues Found'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface InlineValidationIndicatorProps {
  operationIndex: number;
  className?: string;
}

export function InlineValidationIndicator({
  operationIndex,
  className
}: InlineValidationIndicatorProps) {
  const { operations } = useBatchUpdateStore();
  const operation = operations[operationIndex];

  const {
    hasErrors,
    hasWarnings,
    isValidating
  } = useOperationValidation(operation, {
    debounceMs: 200,
    validateOnMount: false,
    enableWarnings: true
  });

  if (isValidating) {
    return (
      <div className={cn('w-2 h-2 rounded-full bg-blue-500 animate-pulse', className)} />
    );
  }

  if (hasErrors) {
    return (
      <div className={cn('w-2 h-2 rounded-full bg-red-500', className)} />
    );
  }

  if (hasWarnings) {
    return (
      <div className={cn('w-2 h-2 rounded-full bg-yellow-500', className)} />
    );
  }

  return (
    <div className={cn('w-2 h-2 rounded-full bg-green-500', className)} />
  );
}

// Hook import fix
import { useOperationValidation } from '@/lib/hooks/useRealtimeValidation';