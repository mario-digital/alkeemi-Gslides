'use client';

import React, { useRef, useState, useCallback, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/app/hooks/useAnimationPerformance';

interface ResizablePanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  onResize?: (size: number) => void;
}

export function ResizablePanel({
  leftPanel,
  rightPanel,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  className,
  onResize
}: ResizablePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const startXRef = useRef(0);
  const startSizeRef = useRef(defaultSize);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startSizeRef.current = size;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - startXRef.current;
    const deltaPercent = (deltaX / containerWidth) * 100;
    const newSize = Math.min(maxSize, Math.max(minSize, startSizeRef.current + deltaPercent));
    
    setSize(newSize);
    setDragDistance(Math.abs(deltaX));
    onResize?.(newSize);
  }, [isDragging, minSize, maxSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragDistance(0);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getHandleGlowIntensity = () => {
    if (!isDragging) return 1;
    const intensity = Math.min(2, 1 + dragDistance / 200);
    return intensity;
  };

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full relative', className)}
    >
      <div 
        className="overflow-auto"
        style={{ width: `${size}%` }}
      >
        {leftPanel}
      </div>
      
      <div
        className={cn(
          'resize-handle w-1 bg-border-glow/30 hover:bg-primary-neon/50',
          'relative flex-shrink-0 group',
          isDragging && 'dragging',
          !prefersReducedMotion && 'transition-colors duration-200'
        )}
        onMouseDown={handleMouseDown}
        style={{
          boxShadow: isDragging && !prefersReducedMotion
            ? `0 0 ${20 * getHandleGlowIntensity()}px rgba(168, 85, 247, ${0.3 * getHandleGlowIntensity()})`
            : undefined
        }}
      >
        <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-1">
            <div className={cn(
              'w-1 h-6 rounded-full bg-primary-neon/50',
              'group-hover:bg-primary-neon transition-colors'
            )} />
          </div>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-auto"
        style={{ width: `${100 - size}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}