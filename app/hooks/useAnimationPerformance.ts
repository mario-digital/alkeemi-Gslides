import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  timestamp: number;
}

interface AnimationPerformanceOptions {
  targetFPS?: number;
  warningThreshold?: number;
  sampleSize?: number;
  onPerformanceWarning?: (metrics: PerformanceMetrics) => void;
}

export function useAnimationPerformance(options: AnimationPerformanceOptions = {}) {
  const {
    targetFPS = 60,
    warningThreshold = 50,
    sampleSize = 60,
    onPerformanceWarning
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    droppedFrames: 0,
    timestamp: Date.now()
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameSamplesRef = useRef<number[]>([]);
  const animationIdRef = useRef<number>();
  const isMonitoringRef = useRef(false);

  const measureFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    frameCountRef.current++;

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCountRef.current;
      
      frameSamplesRef.current.push(fps);
      if (frameSamplesRef.current.length > sampleSize) {
        frameSamplesRef.current.shift();
      }

      const avgFPS = frameSamplesRef.current.reduce((a, b) => a + b, 0) / frameSamplesRef.current.length;
      const droppedFrames = frameSamplesRef.current.filter(f => f < targetFPS * 0.95).length;

      const newMetrics: PerformanceMetrics = {
        fps: Math.round(avgFPS),
        frameTime: Math.round(frameTime * 100) / 100,
        droppedFrames,
        timestamp: Date.now()
      };

      setMetrics(newMetrics);

      if (fps < warningThreshold && onPerformanceWarning) {
        onPerformanceWarning(newMetrics);
      }

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    if (isMonitoringRef.current) {
      animationIdRef.current = requestAnimationFrame(measureFPS);
    }
  }, [targetFPS, warningThreshold, sampleSize, onPerformanceWarning]);

  const startMonitoring = useCallback(() => {
    if (!isMonitoringRef.current) {
      isMonitoringRef.current = true;
      frameCountRef.current = 0;
      lastTimeRef.current = performance.now();
      frameSamplesRef.current = [];
      animationIdRef.current = requestAnimationFrame(measureFPS);
    }
  }, [measureFPS]);

  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false;
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    isMonitoring: isMonitoringRef.current
  };
}

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}