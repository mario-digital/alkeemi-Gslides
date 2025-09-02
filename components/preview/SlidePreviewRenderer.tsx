'use client';

import { useEffect, useRef, useState } from 'react';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import { RenderEngine } from '@/services/RenderEngine';
import { cn } from '@/lib/utils';
import { ptToPixels } from '@/lib/utils';

interface SlidePreviewRendererProps {
  className?: string;
  width?: number;
  height?: number;
  scale?: number;
  onElementClick?: (objectId: string) => void;
}

const SLIDE_WIDTH_PT = 720;
const SLIDE_HEIGHT_PT = 405;

export function SlidePreviewRenderer({
  className,
  width = 960,
  height = 540,
  scale = 1,
  onElementClick
}: SlidePreviewRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderEngine, setRenderEngine] = useState<RenderEngine | null>(null);
  const { operations, selectedElement } = useBatchUpdateStore();
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new RenderEngine(canvasRef.current);
      setRenderEngine(engine);
      return () => {
        engine.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (renderEngine && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);

      renderEngine.setViewport({
        width,
        height,
        scale: scale * viewport.scale,
        offsetX: viewport.x,
        offsetY: viewport.y
      });

      renderEngine.render(operations, selectedElement?.objectId);
    }
  }, [renderEngine, operations, selectedElement, width, height, scale, viewport]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!renderEngine || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const element = renderEngine.getElementAtPoint(x, y);
    if (element && onElementClick) {
      onElementClick(element.objectId);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.1, viewport.scale + delta), 3);
      setViewport(prev => ({ ...prev, scale: newScale }));
    } else {
      setViewport(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-zinc-950 rounded-lg",
        "border border-purple-500/20",
        "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
        className
      )}
      style={{ width, height }}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ width, height }}
        onClick={handleCanvasClick}
      />

      <div className="absolute top-2 right-2 flex gap-2">
        <div className="px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-purple-300 border border-purple-500/30">
          {Math.round(viewport.scale * 100)}%
        </div>
        <div className="px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-zinc-400 border border-zinc-700">
          {width} × {height}
        </div>
      </div>

      {selectedElement && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-emerald-400 border border-emerald-500/30">
          Selected: {selectedElement.objectId}
        </div>
      )}
    </div>
  );
}