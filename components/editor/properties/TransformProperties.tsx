'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useBatchUpdateStore, SelectedElement } from '@/stores/batchUpdateStore';
import { RotateCw, Move, Maximize2, FlipHorizontal, FlipVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransformPropertiesProps {
  element: SelectedElement;
}

export function TransformProperties({ element }: TransformPropertiesProps) {
  const { operations, updateOperation } = useBatchUpdateStore();
  
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(100);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  useEffect(() => {
    const operation = operations.find((op: any) => 
      op.createShape?.objectId === element.objectId ||
      op.createImage?.objectId === element.objectId ||
      op.updatePageElementTransform?.objectId === element.objectId
    );
    
    if (operation) {
      let props;
      if ('createShape' in operation) {
        props = operation.createShape.elementProperties;
      } else if ('createImage' in operation) {
        props = operation.createImage.elementProperties;
      }
      
      if (props) {
        const transform = props.transform || {};
        const size = props.size || {};
        
        setPosX(transform.translateX || 100);
        setPosY(transform.translateY || 100);
        setWidth(size.width?.magnitude || 200);
        setHeight(size.height?.magnitude || 100);
        setScaleX(transform.scaleX || 1);
        setScaleY(transform.scaleY || 1);
      }
    }
  }, [element, operations]);

  const updateTransform = () => {
    const operationIndex = operations.findIndex((op: any) => 
      op.createShape?.objectId === element.objectId ||
      op.createImage?.objectId === element.objectId
    );
    
    if (operationIndex === -1) return;
    
    const operation = operations[operationIndex];
    let updatedOperation;
    
    if ('createShape' in operation) {
      updatedOperation = {
        ...operation,
        createShape: {
          ...operation.createShape,
          elementProperties: {
            ...operation.createShape.elementProperties,
            size: {
              width: { magnitude: width, unit: 'PT' as const },
              height: { magnitude: height, unit: 'PT' as const }
            },
            transform: {
              scaleX,
              scaleY,
              translateX: posX,
              translateY: posY,
              unit: 'PT' as const
            }
          }
        }
      };
    } else if ('createImage' in operation) {
      updatedOperation = {
        ...operation,
        createImage: {
          ...operation.createImage,
          elementProperties: {
            ...operation.createImage.elementProperties,
            size: {
              width: { magnitude: width, unit: 'PT' as const },
              height: { magnitude: height, unit: 'PT' as const }
            },
            transform: {
              scaleX,
              scaleY,
              translateX: posX,
              translateY: posY,
              unit: 'PT' as const
            }
          }
        }
      };
    }
    
    if (updatedOperation) {
      updateOperation(operationIndex, updatedOperation);
    }
  };

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (axis === 'x') {
      setPosX(numValue);
    } else {
      setPosY(numValue);
    }
    updateTransform();
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 1;
    if (dimension === 'width') {
      setWidth(numValue);
    } else {
      setHeight(numValue);
    }
    updateTransform();
  };

  const handleRotationChange = (value: number[]) => {
    setRotation(value[0]);
    // Note: Rotation would require additional transform matrix calculations
  };

  const handleFlip = (axis: 'horizontal' | 'vertical') => {
    if (axis === 'horizontal') {
      setScaleX(scaleX * -1);
    } else {
      setScaleY(scaleY * -1);
    }
    updateTransform();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400 flex items-center gap-1">
          <Move className="w-3 h-3" />
          Position
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500">X</Label>
            <Input
              type="number"
              value={posX}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="h-8 bg-zinc-900/50 border-purple-500/30 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500">Y</Label>
            <Input
              type="number"
              value={posY}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="h-8 bg-zinc-900/50 border-purple-500/30 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400 flex items-center gap-1">
          <Maximize2 className="w-3 h-3" />
          Size
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500">Width</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              min={1}
              className="h-8 bg-zinc-900/50 border-purple-500/30 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500">Height</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              min={1}
              className="h-8 bg-zinc-900/50 border-purple-500/30 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400 flex items-center gap-1">
          <RotateCw className="w-3 h-3" />
          Rotation
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[rotation]}
            onValueChange={handleRotationChange}
            min={-180}
            max={180}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-zinc-300 w-12 text-right">{rotation}°</span>
        </div>
      </div>

      <div className="h-px bg-purple-500/20" />

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Quick Actions</Label>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleFlip('horizontal')}
            className={cn(
              "flex-1 h-8 bg-zinc-900/50 border-purple-500/30",
              "hover:bg-purple-500/10 hover:border-purple-400/50",
              "transition-all duration-200"
            )}
          >
            <FlipHorizontal className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Flip H</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleFlip('vertical')}
            className={cn(
              "flex-1 h-8 bg-zinc-900/50 border-purple-500/30",
              "hover:bg-purple-500/10 hover:border-purple-400/50",
              "transition-all duration-200"
            )}
          >
            <FlipVertical className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Flip V</span>
          </Button>
        </div>
      </div>
    </div>
  );
}