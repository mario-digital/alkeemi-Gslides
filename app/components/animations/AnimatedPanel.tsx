'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface AnimatedPanelProps {
  children: ReactNode;
  isOpen: boolean;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  onAnimationComplete?: () => void;
}

export function AnimatedPanel({
  children,
  isOpen,
  direction = 'left',
  className,
  onAnimationComplete
}: AnimatedPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!panelRef.current) return;

    const handleAnimationEnd = () => {
      setIsAnimating(false);
      onAnimationComplete?.();
    };

    const panel = panelRef.current;
    panel.addEventListener('transitionend', handleAnimationEnd);

    if (isOpen) {
      setIsAnimating(true);
      requestAnimationFrame(() => {
        panel.classList.add('panel-slide-enter-active');
        panel.classList.remove('panel-slide-enter');
      });
    } else {
      setIsAnimating(true);
      requestAnimationFrame(() => {
        panel.classList.add('panel-slide-exit-active');
        panel.classList.remove('panel-slide-exit');
      });
    }

    return () => {
      panel.removeEventListener('transitionend', handleAnimationEnd);
    };
  }, [isOpen, onAnimationComplete]);

  const getDirectionClass = () => {
    if (prefersReducedMotion) return '';
    
    switch (direction) {
      case 'right':
        return isOpen ? 'panel-slide-right-enter-active' : 'panel-slide-right-enter';
      case 'top':
        return isOpen ? 'translate-y-0' : '-translate-y-full';
      case 'bottom':
        return isOpen ? 'translate-y-0' : 'translate-y-full';
      default:
        return isOpen ? 'panel-slide-enter-active' : 'panel-slide-enter';
    }
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        'glass-panel gpu-accelerated',
        getDirectionClass(),
        isAnimating && 'pointer-events-none',
        className
      )}
      aria-hidden={!isOpen}
    >
      {children}
    </div>
  );
}