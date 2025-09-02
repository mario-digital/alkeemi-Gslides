'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface ValidationFeedbackProps {
  status: 'idle' | 'success' | 'error' | 'warning';
  message?: string;
  className?: string;
  children?: React.ReactNode;
  duration?: number;
}

export function ValidationFeedback({
  status,
  message,
  className,
  children,
  duration = 150
}: ValidationFeedbackProps) {
  const prefersReducedMotion = useReducedMotion();
  const [animationClass, setAnimationClass] = useState('');
  const [previousStatus, setPreviousStatus] = useState(status);

  useEffect(() => {
    if (status !== previousStatus && status !== 'idle') {
      const flashClass = `validation-flash-${status}`;
      setAnimationClass(flashClass);
      
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, duration);

      setPreviousStatus(status);
      return () => clearTimeout(timer);
    }
  }, [status, previousStatus, duration]);

  const getStatusStyles = () => {
    if (prefersReducedMotion) {
      switch (status) {
        case 'success':
          return 'border-2 border-accent-electric bg-accent-electric/10';
        case 'error':
          return 'border-2 border-error bg-error/10';
        case 'warning':
          return 'border-2 border-warning bg-warning/10';
        default:
          return '';
      }
    }

    switch (status) {
      case 'success':
        return 'border-accent-electric/30';
      case 'error':
        return 'border-error/30';
      case 'warning':
        return 'border-warning/30';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-accent-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-glass border transition-all duration-200',
        getStatusStyles(),
        animationClass,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {(status !== 'idle' || message) && (
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            {children}
            {message && (
              <p className="text-sm text-text-secondary mt-1">{message}</p>
            )}
          </div>
        </div>
      )}
      {status === 'idle' && !message && children}
    </div>
  );
}