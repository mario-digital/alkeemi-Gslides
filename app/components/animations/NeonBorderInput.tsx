'use client';

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface NeonBorderInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const NeonBorderInput = forwardRef<HTMLInputElement, NeonBorderInputProps>(
  ({ className, error, success, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getBorderClass = () => {
      if (prefersReducedMotion) {
        if (isFocused) return 'outline outline-3 outline-primary-neon outline-offset-2';
        if (error) return 'border-2 border-error';
        if (success) return 'border-2 border-accent-electric';
        return 'border border-border-glow/30';
      }

      const baseClass = 'neon-border-animate';
      if (error) return cn(baseClass, 'border-error/50');
      if (success) return cn(baseClass, 'border-accent-electric/50');
      return baseClass;
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 bg-bg-tertiary/50 text-text-primary rounded-glass',
            'transition-all duration-400 ease-in-out',
            'placeholder:text-text-muted',
            'focus:outline-none',
            getBorderClass(),
            isFocused && !prefersReducedMotion && 'active',
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {isFocused && !prefersReducedMotion && (
          <div className="absolute inset-0 rounded-glass pointer-events-none neon-border-draw" />
        )}
      </div>
    );
  }
);

NeonBorderInput.displayName = 'NeonBorderInput';