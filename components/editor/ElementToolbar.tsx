'use client';

import { Button } from '@/components/ui/button';
import { Square, Type, Image, Circle, Triangle, Minus, ArrowRight } from 'lucide-react';
import { useElementCreation } from '@/hooks/useElementCreation';
import { cn } from '@/lib/utils';

const ELEMENT_TYPES = [
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'textBox', icon: Type, label: 'Text Box' },
  { id: 'image', icon: Image, label: 'Image' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse' },
  { id: 'triangle', icon: Triangle, label: 'Triangle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
] as const;

export type ElementType = typeof ELEMENT_TYPES[number]['id'];

interface ElementToolbarProps {
  className?: string;
  onElementCreate?: (elementType: ElementType) => void;
}

export function ElementToolbar({ className, onElementCreate }: ElementToolbarProps) {
  const { createElement, isCreating } = useElementCreation();

  const handleElementCreate = async (elementType: ElementType) => {
    await createElement(elementType);
    onElementCreate?.(elementType);
  };

  return (
    <div className={cn(
      "flex flex-col gap-2 p-3 bg-zinc-950/90 border border-purple-500/20 rounded-lg backdrop-blur-xl",
      "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
      className
    )}>
      <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
        Elements
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {ELEMENT_TYPES.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="outline"
            size="sm"
            onClick={() => handleElementCreate(id)}
            disabled={isCreating}
            className={cn(
              "h-9 px-2 bg-zinc-900/50 border-purple-500/30",
              "hover:bg-purple-500/10 hover:border-purple-400/50",
              "hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]",
              "transition-all duration-200",
              "group"
            )}
            title={label}
          >
            <Icon className="h-4 w-4 mr-1.5 text-purple-400 group-hover:text-purple-300" />
            <span className="text-xs text-zinc-300 group-hover:text-zinc-100">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}