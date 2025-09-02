'use client';

import React from 'react';
import { useAnimationPerformance } from '@/app/hooks/useAnimationPerformance';
import { cn } from '@/lib/utils';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function PerformanceMonitor({
  show = true,
  position = 'bottom-right',
  className
}: PerformanceMonitorProps) {
  const { metrics, startMonitoring, stopMonitoring, isMonitoring } = useAnimationPerformance({
    targetFPS: 60,
    warningThreshold: 50,
    onPerformanceWarning: (metrics) => {
      console.warn('Performance warning:', metrics);
    }
  });

  React.useEffect(() => {
    if (show) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    return () => stopMonitoring();
  }, [show, startMonitoring, stopMonitoring]);

  if (!show || !isMonitoring) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getFPSColor = () => {
    if (metrics.fps >= 55) return 'text-accent-electric';
    if (metrics.fps >= 45) return 'text-warning';
    return 'text-error';
  };

  return (
    <div
      className={cn(
        'fixed z-50 p-3 rounded-glass bg-bg-secondary/90 backdrop-blur-glass',
        'border border-primary-neon/20 shadow-glow-sm',
        'font-mono text-xs',
        getPositionClasses(),
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex justify-between items-center gap-4">
          <span className="text-text-muted">FPS:</span>
          <span className={cn('font-bold', getFPSColor())}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-text-muted">Frame Time:</span>
          <span className="text-text-primary">
            {metrics.frameTime.toFixed(2)}ms
          </span>
        </div>
        {metrics.droppedFrames > 0 && (
          <div className="flex justify-between items-center gap-4">
            <span className="text-text-muted">Dropped:</span>
            <span className="text-warning">
              {metrics.droppedFrames}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}