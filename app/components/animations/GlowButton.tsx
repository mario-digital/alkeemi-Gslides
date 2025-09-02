'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  glowIntensity?: 'subtle' | 'normal' | 'strong';
  pulseAnimation?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    glowIntensity = 'normal',
    pulseAnimation = true,
    children,
    ...props 
  }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const getVariantClasses = () => {
      switch (variant) {
        case 'secondary':
          return 'bg-secondary-neon text-white hover:bg-secondary-neon/90';
        case 'success':
          return 'bg-accent-electric text-bg-primary hover:bg-accent-electric/90';
        case 'danger':
          return 'bg-error text-white hover:bg-error/90';
        default:
          return 'bg-primary-neon text-white hover:bg-primary-neon/90';
      }
    };

    const getGlowClasses = () => {
      if (prefersReducedMotion) {
        return 'border-2 border-primary-neon/50';
      }

      const baseGlow = pulseAnimation ? 'glow-pulse' : '';
      
      switch (glowIntensity) {
        case 'subtle':
          return cn(baseGlow, 'shadow-glow-xs hover:shadow-glow-sm');
        case 'strong':
          return cn(baseGlow, 'shadow-glow-md hover:shadow-glow-lg');
        default:
          return cn(baseGlow, 'shadow-glow hover:shadow-glow-md');
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-glass font-medium transition-all duration-200',
          'hover-elevate gpu-accelerated focus-glow',
          getVariantClasses(),
          getGlowClasses(),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlowButton.displayName = 'GlowButton';