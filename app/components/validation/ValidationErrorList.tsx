'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronRight, Copy, X } from 'lucide-react';
import { ValidationError } from '@/lib/services/ValidationService';
import { cn } from '@/lib/utils';

interface ValidationErrorListProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  className?: string;
  maxHeight?: string;
  showSuggestions?: boolean;
  onClose?: () => void;
}

export function ValidationErrorList({
  errors,
  warnings,
  className,
  maxHeight = '400px',
  showSuggestions = true,
  onClose
}: ValidationErrorListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const renderValidationItem = (item: ValidationError, type: 'error' | 'warning', index: number) => {
    const id = `${type}-${index}`;
    const isExpanded = expandedItems.has(id);
    const Icon = type === 'error' ? AlertCircle : AlertTriangle;
    const bgColor = type === 'error' ? 'bg-red-50 dark:bg-red-950/20' : 'bg-yellow-50 dark:bg-yellow-950/20';
    const borderColor = type === 'error' ? 'border-red-200 dark:border-red-800' : 'border-yellow-200 dark:border-yellow-800';
    const iconColor = type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
    const textColor = type === 'error' ? 'text-red-900 dark:text-red-100' : 'text-yellow-900 dark:text-yellow-100';

    return (
      <div
        key={id}
        className={cn(
          'rounded-lg border p-3 transition-all',
          bgColor,
          borderColor
        )}
      >
        <div className="flex items-start gap-2">
          <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColor)} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className={cn('font-medium text-sm', textColor)}>
                  {item.message}
                </p>
                
                {item.path && item.path !== 'root' && (
                  <button
                    onClick={() => copyPath(item.path)}
                    className={cn(
                      'mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded',
                      'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10',
                      'transition-colors group'
                    )}
                  >
                    <code className="font-mono">{item.path}</code>
                    <Copy className={cn(
                      'w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity',
                      copiedPath === item.path && 'opacity-100'
                    )} />
                    {copiedPath === item.path && (
                      <span className="text-green-600 dark:text-green-400 ml-1">Copied!</span>
                    )}
                  </button>
                )}
              </div>

              {item.suggestion && showSuggestions && (
                <button
                  onClick={() => toggleExpanded(id)}
                  className={cn(
                    'p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
                    'flex-shrink-0'
                  )}
                  aria-label={isExpanded ? 'Hide suggestion' : 'Show suggestion'}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {item.suggestion && showSuggestions && isExpanded && (
              <div className={cn(
                'mt-2 p-2 rounded text-xs',
                'bg-black/5 dark:bg-white/5',
                'border-l-2',
                type === 'error' ? 'border-red-400' : 'border-yellow-400'
              )}>
                <p className="font-medium mb-1">Suggestion:</p>
                <p className="opacity-90">{item.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const hasIssues = errors.length > 0 || warnings.length > 0;

  if (!hasIssues) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-lg border bg-card',
        className
      )}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm">Validation Issues</h3>
          <div className="flex items-center gap-2 text-xs">
            {errors.length > 0 && (
              <span className="text-red-600 dark:text-red-400">
                {errors.length} error{errors.length !== 1 ? 's' : ''}
              </span>
            )}
            {warnings.length > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close validation panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        className="p-3 space-y-2 overflow-y-auto"
        style={{ maxHeight }}
      >
        {errors.map((error, index) => renderValidationItem(error, 'error', index))}
        {warnings.map((warning, index) => renderValidationItem(warning, 'warning', index))}
      </div>
    </div>
  );
}

interface InlineValidationErrorProps {
  error?: ValidationError;
  warning?: ValidationError;
  className?: string;
}

export function InlineValidationError({
  error,
  warning,
  className
}: InlineValidationErrorProps) {
  const item = error || warning;
  if (!item) return null;

  const isError = Boolean(error);
  const Icon = isError ? AlertCircle : AlertTriangle;
  const color = isError ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';

  return (
    <div className={cn('flex items-start gap-2 mt-1', className)}>
      <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', color)} />
      <div className="flex-1">
        <p className={cn('text-sm', color)}>
          {item.message}
        </p>
        {item.suggestion && (
          <p className="text-xs opacity-75 mt-0.5">
            {item.suggestion}
          </p>
        )}
      </div>
    </div>
  );
}