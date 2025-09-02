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
  width,
  height,
  scale = 1,
  onElementClick
}: SlidePreviewRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderEngine, setRenderEngine] = useState<RenderEngine | null>(null);
  const { operations, selectedElement } = useBatchUpdateStore();
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [containerSize, setContainerSize] = useState({ width: 960, height: 540 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panMode, setPanMode] = useState(false); // Hold space to pan
  
  // Use container size if width/height not provided
  const canvasWidth = width || containerSize.width;
  const canvasHeight = height || containerSize.height;
  
  console.log('SlidePreviewRenderer operations:', operations);

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
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
      canvas.width = canvasWidth * pixelRatio;
      canvas.height = canvasHeight * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);

      renderEngine.setViewport({
        width: canvasWidth,
        height: canvasHeight,
        scale: scale * viewport.scale,
        offsetX: viewport.x,
        offsetY: viewport.y
      });

      // Force immediate render
      renderEngine.render(operations, selectedElement?.objectId);
    }
  }, [renderEngine, operations, selectedElement, canvasWidth, canvasHeight, scale, viewport, operations.length]); // Added operations.length as additional trigger

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!renderEngine || !canvasRef.current || isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const element = renderEngine.getElementAtPoint(x, y);
    if (element && onElementClick) {
      onElementClick(element.objectId);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Start dragging if space is held or middle mouse button
    if (panMode || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      e.preventDefault();
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setViewport({
        ...viewport,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      // Cmd/Ctrl + Shift + Scroll = Horizontal pan
      setViewport(prev => ({
        ...prev,
        x: prev.x - e.deltaY
      }));
    } else if (e.ctrlKey || e.metaKey) {
      // Cmd/Ctrl + Scroll = Zoom
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.1, viewport.scale + delta), 3);
      setViewport(prev => ({ ...prev, scale: newScale }));
    } else if (e.shiftKey) {
      // Shift + Scroll = Horizontal scroll
      setViewport(prev => ({
        ...prev,
        x: prev.x - e.deltaY * 0.5
      }));
    } else {
      // Normal scroll = Vertical pan (and horizontal if trackpad supports it)
      setViewport(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar for pan mode
      if (e.code === 'Space' && !panMode) {
        setPanMode(true);
        e.preventDefault();
      }
      
      // Arrow keys for panning
      const panSpeed = e.shiftKey ? 50 : 20;
      switch(e.key) {
        case 'ArrowLeft':
          setViewport(prev => ({ ...prev, x: prev.x + panSpeed }));
          e.preventDefault();
          break;
        case 'ArrowRight':
          setViewport(prev => ({ ...prev, x: prev.x - panSpeed }));
          e.preventDefault();
          break;
        case 'ArrowUp':
          setViewport(prev => ({ ...prev, y: prev.y + panSpeed }));
          e.preventDefault();
          break;
        case 'ArrowDown':
          setViewport(prev => ({ ...prev, y: prev.y - panSpeed }));
          e.preventDefault();
          break;
        case '0':
          // Reset view
          if (e.ctrlKey || e.metaKey) {
            setViewport({ x: 0, y: 0, scale: 1 });
            e.preventDefault();
          }
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setPanMode(false);
        setIsDragging(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [panMode]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-zinc-950 rounded-lg",
        "border border-purple-500/20",
        "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
        className
      )}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0",
          isDragging ? "cursor-grabbing" : 
          panMode ? "cursor-grab" : "cursor-crosshair"
        )}
        style={{ width: canvasWidth, height: canvasHeight }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />

      <div className="absolute top-2 right-2 flex gap-2">
        {panMode && (
          <div className="px-2 py-1 bg-cyan-500/20 backdrop-blur-sm rounded text-xs text-cyan-400 border border-cyan-500/30 animate-pulse">
            Pan Mode (Space)
          </div>
        )}
        <div className="px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-purple-300 border border-purple-500/30">
          {Math.round(viewport.scale * 100)}%
        </div>
        <div className="px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-zinc-400 border border-zinc-700">
          {canvasWidth} × {canvasHeight}
        </div>
      </div>
      
      {/* Controls Help */}
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-zinc-500 border border-zinc-700">
        <span className="opacity-60">
          Space+Drag: Pan | Cmd+Scroll: Zoom | Cmd+Shift+Scroll: H-Pan | Arrows: Move | Cmd+0: Reset
        </span>
      </div>

      {selectedElement && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded text-xs text-emerald-400 border border-emerald-500/30">
          Selected: {selectedElement.objectId}
        </div>
      )}
    </div>
  );
}