'use client';

import { useEffect, useRef, useState } from 'react';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import { cn } from '@/lib/utils';

interface SelectionOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onElementMove?: (objectId: string, x: number, y: number) => void;
  onElementResize?: (objectId: string, width: number, height: number) => void;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

export function SelectionOverlay({ 
  containerRef, 
  onElementMove, 
  onElementResize 
}: SelectionOverlayProps) {
  const { selectedElement } = useBatchUpdateStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!selectedElement || !containerRef.current || !overlayRef.current) return;

    const bounds = getElementBounds(selectedElement.objectId);
    if (!bounds) return;

    const overlay = overlayRef.current;
    overlay.style.left = `${bounds.x}px`;
    overlay.style.top = `${bounds.y}px`;
    overlay.style.width = `${bounds.width}px`;
    overlay.style.height = `${bounds.height}px`;
  }, [selectedElement, containerRef]);

  const getElementBounds = (objectId: string) => {
    // This would normally get the actual element bounds from the canvas
    // For now, return mock data
    return {
      x: 100,
      y: 100,
      width: 200,
      height: 100
    };
  };

  const handleMouseDown = (e: React.MouseEvent, handle?: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedElement || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!overlayRef.current) return;

      if (isDragging && selectedElement) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const newX = elementStart.x + deltaX;
        const newY = elementStart.y + deltaY;
        
        overlayRef.current.style.left = `${newX}px`;
        overlayRef.current.style.top = `${newY}px`;
        
        if (onElementMove) {
          onElementMove(selectedElement.objectId, newX, newY);
        }
      } else if (isResizing && selectedElement && resizeHandle) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        let newX = elementStart.x;
        let newY = elementStart.y;
        let newWidth = elementStart.width;
        let newHeight = elementStart.height;
        
        switch (resizeHandle) {
          case 'e':
            newWidth = elementStart.width + deltaX;
            break;
          case 'w':
            newX = elementStart.x + deltaX;
            newWidth = elementStart.width - deltaX;
            break;
          case 's':
            newHeight = elementStart.height + deltaY;
            break;
          case 'n':
            newY = elementStart.y + deltaY;
            newHeight = elementStart.height - deltaY;
            break;
          case 'se':
            newWidth = elementStart.width + deltaX;
            newHeight = elementStart.height + deltaY;
            break;
          case 'sw':
            newX = elementStart.x + deltaX;
            newWidth = elementStart.width - deltaX;
            newHeight = elementStart.height + deltaY;
            break;
          case 'ne':
            newWidth = elementStart.width + deltaX;
            newY = elementStart.y + deltaY;
            newHeight = elementStart.height - deltaY;
            break;
          case 'nw':
            newX = elementStart.x + deltaX;
            newY = elementStart.y + deltaY;
            newWidth = elementStart.width - deltaX;
            newHeight = elementStart.height - deltaY;
            break;
        }
        
        if (newWidth > 20 && newHeight > 20) {
          overlayRef.current.style.left = `${newX}px`;
          overlayRef.current.style.top = `${newY}px`;
          overlayRef.current.style.width = `${newWidth}px`;
          overlayRef.current.style.height = `${newHeight}px`;
          
          if (onElementResize) {
            onElementResize(selectedElement.objectId, newWidth, newHeight);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, elementStart, resizeHandle, selectedElement, onElementMove, onElementResize]);

  if (!selectedElement) return null;

  return (
    <div
      ref={overlayRef}
      className={cn(
        "absolute pointer-events-auto",
        "border-2 border-emerald-400",
        "shadow-[0_0_10px_rgba(6,255,165,0.4)]",
        isDragging && "cursor-move",
        isResizing && "cursor-resize"
      )}
      style={{
        position: 'absolute',
        zIndex: 1000
      }}
      onMouseDown={(e) => handleMouseDown(e)}
    >
      {/* Resize handles */}
      <div
        className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-400 cursor-nw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
      />
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 cursor-n-resize"
        onMouseDown={(e) => handleMouseDown(e, 'n')}
      />
      <div
        className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 cursor-ne-resize"
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-emerald-400 cursor-w-resize"
        onMouseDown={(e) => handleMouseDown(e, 'w')}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-emerald-400 cursor-e-resize"
        onMouseDown={(e) => handleMouseDown(e, 'e')}
      />
      <div
        className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 cursor-sw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
      />
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 cursor-s-resize"
        onMouseDown={(e) => handleMouseDown(e, 's')}
      />
      <div
        className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-400 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />
    </div>
  );
}