'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationBadgeProps {
  status: 'valid' | 'warning' | 'error' | 'validating';
  errorCount?: number;
  warningCount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function ValidationBadge({
  status,
  errorCount = 0,
  warningCount = 0,
  className,
  size = 'md',
  showCount = true
}: ValidationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const statusConfig = {
    valid: {
      icon: CheckCircle,
      label: 'Valid',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      iconClassName: 'text-green-600 dark:text-green-400'
    },
    warning: {
      icon: AlertTriangle,
      label: showCount && warningCount > 0 ? `${warningCount} Warning${warningCount > 1 ? 's' : ''}` : 'Warning',
      className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      iconClassName: 'text-yellow-600 dark:text-yellow-400'
    },
    error: {
      icon: XCircle,
      label: showCount && errorCount > 0 ? `${errorCount} Error${errorCount > 1 ? 's' : ''}` : 'Error',
      className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      iconClassName: 'text-red-600 dark:text-red-400'
    },
    validating: {
      icon: Loader2,
      label: 'Validating',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      iconClassName: 'text-blue-600 dark:text-blue-400 animate-spin'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border font-medium transition-all',
        sizeClasses[size],
        config.className,
        className
      )}
      role="status"
      aria-label={`Validation status: ${config.label}`}
    >
      <Icon className={cn(iconSizes[size], config.iconClassName)} />
      <span>{config.label}</span>
    </div>
  );
}

interface ValidationIndicatorProps {
  isValid: boolean;
  hasWarnings: boolean;
  isValidating: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ValidationIndicator({
  isValid,
  hasWarnings,
  isValidating,
  className,
  size = 'sm'
}: ValidationIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  if (isValidating) {
    return (
      <div
        className={cn(
          'rounded-full bg-blue-500 animate-pulse',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Validating"
      />
    );
  }

  const colorClass = !isValid
    ? 'bg-red-500'
    : hasWarnings
    ? 'bg-yellow-500'
    : 'bg-green-500';

  return (
    <div
      className={cn(
        'rounded-full transition-colors',
        sizeClasses[size],
        colorClass,
        className
      )}
      role="status"
      aria-label={!isValid ? 'Invalid' : hasWarnings ? 'Valid with warnings' : 'Valid'}
    />
  );
}