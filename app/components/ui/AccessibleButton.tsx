'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const { settings } = useAccessibility();

    const baseClasses = [
      'touch-target',
      'focus-indicator',
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-150',
      settings.reducedMotion ? 'transition-none' : '',
      fullWidth ? 'w-full' : '',
    ];

    const sizeClasses = {
      sm: 'min-h-[44px] px-3 py-2 text-sm',
      md: 'min-h-[44px] px-4 py-2.5 text-base',
      lg: 'min-h-[48px] px-6 py-3 text-lg',
    };

    const variantClasses = {
      primary: `
        bg-primary-neon text-bg-primary
        hover:bg-primary-neon/90 
        active:bg-primary-neon/80
        disabled:bg-primary-neon/30 disabled:cursor-not-allowed
      `,
      secondary: `
        bg-bg-secondary text-text-primary
        border border-primary-neon/30
        hover:bg-primary-neon/10 hover:border-primary-neon/50
        active:bg-primary-neon/20
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      ghost: `
        bg-transparent text-text-primary
        hover:bg-primary-neon/10
        active:bg-primary-neon/20
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        active:bg-red-800
        disabled:bg-red-400 disabled:cursor-not-allowed
      `,
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }

      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      if (!settings.reducedMotion) {
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple-effect';
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      }

      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseClasses.join(' ')}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span 
            className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg"
            aria-hidden="true"
          >
            <LoadingSpinner size={size} />
          </span>
        )}
        
        <span className={`flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
        </span>

        {settings.keyboardNavigationHints && props['aria-label'] && (
          <span className="sr-only">
            {props['aria-label']}
          </span>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

const LoadingSpinner: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};