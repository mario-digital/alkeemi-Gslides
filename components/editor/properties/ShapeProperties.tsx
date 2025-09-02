'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBatchUpdateStore, SelectedElement } from '@/stores/batchUpdateStore';
import { cn } from '@/lib/utils';

interface ShapePropertiesProps {
  element: SelectedElement;
}

export function ShapeProperties({ element }: ShapePropertiesProps) {
  const { operations, updateOperation } = useBatchUpdateStore();
  
  const [fillColor, setFillColor] = useState('#a855f7');
  const [fillOpacity, setFillOpacity] = useState(80);
  const [borderColor, setBorderColor] = useState('#06ffa5');
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderOpacity, setBorderOpacity] = useState(100);

  useEffect(() => {
    const operation = operations.find((op: any) => 
      op.createShape?.objectId === element.objectId ||
      op.updateShapeProperties?.objectId === element.objectId
    );
    
    if (operation && 'createShape' in operation) {
      const shape = operation.createShape;
      if (shape.shapeProperties?.shapeBackgroundFill?.solidFill) {
        const fill = shape.shapeProperties.shapeBackgroundFill.solidFill;
        const color = fill.color?.rgbColor;
        if (color) {
          const hex = rgbToHex(color.red || 0, color.green || 0, color.blue || 0);
          setFillColor(hex);
          setFillOpacity(Math.round((fill.alpha || 1) * 100));
        }
      }
      
      if (shape.shapeProperties?.outline) {
        const outline = shape.shapeProperties.outline;
        setBorderWidth(outline.weight?.magnitude || 2);
        
        if (outline.outlineFill?.solidFill) {
          const fill = outline.outlineFill.solidFill;
          const color = fill.color?.rgbColor;
          if (color) {
            const hex = rgbToHex(color.red || 0, color.green || 0, color.blue || 0);
            setBorderColor(hex);
            setBorderOpacity(Math.round((fill.alpha || 1) * 100));
          }
        }
      }
    }
  }, [element, operations]);

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    updateShapeProperties();
  };

  const handleFillOpacityChange = (value: number[]) => {
    setFillOpacity(value[0]);
    updateShapeProperties();
  };

  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    updateShapeProperties();
  };

  const handleBorderWidthChange = (value: string) => {
    const width = parseInt(value) || 2;
    setBorderWidth(width);
    updateShapeProperties();
  };

  const handleBorderOpacityChange = (value: number[]) => {
    setBorderOpacity(value[0]);
    updateShapeProperties();
  };

  const updateShapeProperties = () => {
    const operationIndex = operations.findIndex((op: any) => 
      op.createShape?.objectId === element.objectId
    );
    
    if (operationIndex === -1) return;
    
    const operation = operations[operationIndex];
    if (!('createShape' in operation)) return;
    
    const updatedOperation = {
      ...operation,
      createShape: {
        ...operation.createShape,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: {
              color: {
                rgbColor: hexToRgb(fillColor)
              },
              alpha: fillOpacity / 100
            }
          },
          outline: {
            weight: { magnitude: borderWidth, unit: 'PT' as const },
            dashStyle: 'SOLID',
            outlineFill: {
              solidFill: {
                color: {
                  rgbColor: hexToRgb(borderColor)
                },
                alpha: borderOpacity / 100
              }
            }
          }
        }
      }
    };
    
    updateOperation(operationIndex, updatedOperation);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Fill Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={fillColor}
            onChange={(e) => handleFillColorChange(e.target.value)}
            className="w-12 h-9 p-1 bg-zinc-900/50 border-purple-500/30"
          />
          <Input
            type="text"
            value={fillColor}
            onChange={(e) => handleFillColorChange(e.target.value)}
            className="flex-1 h-9 bg-zinc-900/50 border-purple-500/30 text-xs"
            placeholder="#a855f7"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Fill Opacity</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[fillOpacity]}
            onValueChange={handleFillOpacityChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-zinc-300 w-10 text-right">{fillOpacity}%</span>
        </div>
      </div>

      <div className="h-px bg-purple-500/20" />

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Border Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={borderColor}
            onChange={(e) => handleBorderColorChange(e.target.value)}
            className="w-12 h-9 p-1 bg-zinc-900/50 border-purple-500/30"
          />
          <Input
            type="text"
            value={borderColor}
            onChange={(e) => handleBorderColorChange(e.target.value)}
            className="flex-1 h-9 bg-zinc-900/50 border-purple-500/30 text-xs"
            placeholder="#06ffa5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Border Width</Label>
        <Input
          type="number"
          value={borderWidth}
          onChange={(e) => handleBorderWidthChange(e.target.value)}
          min={0}
          max={20}
          className="h-9 bg-zinc-900/50 border-purple-500/30 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Border Opacity</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[borderOpacity]}
            onValueChange={handleBorderOpacityChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-zinc-300 w-10 text-right">{borderOpacity}%</span>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): { red: number; green: number; blue: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    red: parseInt(result[1], 16) / 255,
    green: parseInt(result[2], 16) / 255,
    blue: parseInt(result[3], 16) / 255
  } : { red: 0, green: 0, blue: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}