'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface ElementMaterializeProps {
  children: ReactNode;
  delay?: number;
  withGlow?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
  trigger?: boolean;
}

export function ElementMaterialize({
  children,
  delay = 0,
  withGlow = true,
  className,
  onAnimationComplete,
  trigger = true
}: ElementMaterializeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || hasAnimated) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimated(true);
      
      const animationTimer = setTimeout(() => {
        onAnimationComplete?.();
      }, 250);
      
      return () => clearTimeout(animationTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [trigger, delay, hasAnimated, onAnimationComplete]);

  if (prefersReducedMotion) {
    return (
      <div className={cn('opacity-100', className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        isVisible
          ? withGlow
            ? 'element-materialize-glow'
            : 'element-materialize'
          : 'opacity-0 scale-0',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StaggeredMaterializeProps {
  children: ReactNode[];
  staggerDelay?: number;
  withGlow?: boolean;
  className?: string;
  containerClassName?: string;
}

export function StaggeredMaterialize({
  children,
  staggerDelay = 50,
  withGlow = true,
  className,
  containerClassName
}: StaggeredMaterializeProps) {
  return (
    <div className={containerClassName}>
      {React.Children.map(children, (child, index) => (
        <ElementMaterialize
          key={index}
          delay={index * staggerDelay}
          withGlow={withGlow}
          className={className}
        >
          {child}
        </ElementMaterialize>
      ))}
    </div>
  );
}

interface PreviewElementProps {
  elementType: 'text' | 'shape' | 'image' | 'table';
  children: ReactNode;
  className?: string;
}

export function PreviewElement({
  elementType,
  children,
  className
}: PreviewElementProps) {
  const [isNew, setIsNew] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getElementIcon = () => {
    switch (elementType) {
      case 'text':
        return '📝';
      case 'shape':
        return '⬛';
      case 'image':
        return '🖼️';
      case 'table':
        return '📊';
      default:
        return '📦';
    }
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-glass border border-primary-neon/20',
        'transition-all duration-250',
        isNew && !prefersReducedMotion && 'element-materialize-glow',
        'hover-elevate',
        className
      )}
    >
      <div className="absolute top-2 right-2 text-xs text-text-muted">
        {getElementIcon()}
      </div>
      {children}
    </div>
  );
}