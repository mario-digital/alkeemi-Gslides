import { BatchUpdateOperation } from '@/types/batch-update';
import { ptToPixels, pixelsToPt } from '@/lib/utils';

interface ViewportConfig {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

interface RenderedElement {
  objectId: string;
  type: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  properties: any;
}

const SLIDE_WIDTH_PT = 720;
const SLIDE_HEIGHT_PT = 405;

export class RenderEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewport: ViewportConfig;
  private renderedElements: RenderedElement[] = [];
  private animationFrame: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
    
    this.viewport = {
      width: canvas.width,
      height: canvas.height,
      scale: 1,
      offsetX: 0,
      offsetY: 0
    };
  }

  setViewport(config: ViewportConfig) {
    this.viewport = config;
  }

  render(operations: BatchUpdateOperation[], selectedObjectId?: string) {
    console.log('RenderEngine.render called with:', {
      operationsCount: operations.length,
      operations,
      selectedObjectId
    });
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.clearCanvas();
      this.drawSlideBackground();
      this.renderedElements = [];

      operations.forEach(operation => {
        console.log('Processing operation:', operation);
        this.renderOperation(operation, selectedObjectId);
      });

      this.animationFrame = null;
    });
  }

  private clearCanvas() {
    const { width, height } = this.viewport;
    this.ctx.clearRect(0, 0, width, height);
  }

  private drawSlideBackground() {
    const { scale, offsetX, offsetY } = this.viewport;
    
    const slideWidthPx = ptToPixels(SLIDE_WIDTH_PT) * scale;
    const slideHeightPx = ptToPixels(SLIDE_HEIGHT_PT) * scale;
    
    const centerX = (this.viewport.width - slideWidthPx) / 2 + offsetX;
    const centerY = (this.viewport.height - slideHeightPx) / 2 + offsetY;

    this.ctx.save();
    
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(centerX, centerY, slideWidthPx, slideHeightPx);
    
    this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(centerX, centerY, slideWidthPx, slideHeightPx);
    
    this.ctx.restore();
  }

  private renderOperation(operation: BatchUpdateOperation, selectedObjectId?: string) {
    console.log('renderOperation called with:', operation);
    
    if ('createShape' in operation) {
      console.log('Rendering createShape');
      this.renderShape(operation.createShape, selectedObjectId === operation.createShape.objectId);
    } else if ('createTextBox' in operation) {
      console.log('Rendering createTextBox');
      // TextBox is rendered as a shape with TEXT_BOX type
      const textBox = {
        ...operation.createTextBox,
        shapeType: 'TEXT_BOX',
        text: operation.createTextBox.text || '' // Ensure text is included
      };
      console.log('TextBox object created:', textBox);
      this.renderShape(textBox, selectedObjectId === operation.createTextBox.objectId);
    } else if ('createImage' in operation) {
      console.log('Rendering createImage');
      this.renderImage(operation.createImage, selectedObjectId === operation.createImage.objectId);
    } else if ('insertText' in operation) {
      console.log('insertText operation (not rendered)');
      // Text rendering handled with shapes
    } else {
      console.log('Unknown operation type:', Object.keys(operation));
    }
  }

  private renderShape(shape: any, isSelected: boolean) {
    try {
      console.log('renderShape called with:', shape, 'isSelected:', isSelected);
      
      const { scale, offsetX, offsetY } = this.viewport;
      const slideWidthPx = ptToPixels(SLIDE_WIDTH_PT) * scale;
      const slideHeightPx = ptToPixels(SLIDE_HEIGHT_PT) * scale;
      const slideX = (this.viewport.width - slideWidthPx) / 2 + offsetX;
      const slideY = (this.viewport.height - slideHeightPx) / 2 + offsetY;

      const props = shape.elementProperties;
      const transform = props.transform || {};
      const size = props.size || { width: { magnitude: 100, unit: 'PT' }, height: { magnitude: 100, unit: 'PT' } };
      
      // Debug logging
      console.log('Rendering shape:', {
        shapeType: shape.shapeType,
        objectId: shape.objectId,
        transform,
        size,
        props
      });
    
    // Convert values based on units
    const getValueInPt = (value: number, unit: string = 'PT') => {
      if (unit === 'EMU') {
        return value / 12700; // 1 point = 12700 EMU
      }
      return value;
    };
    
    const translateX = getValueInPt(transform.translateX || 0, transform.unit || 'PT');
    const translateY = getValueInPt(transform.translateY || 0, transform.unit || 'PT');
    const widthPt = getValueInPt(size.width.magnitude, size.width.unit || 'PT');
    const heightPt = getValueInPt(size.height.magnitude, size.height.unit || 'PT');
    
    console.log('Converted values:', {
      translateX,
      translateY,
      widthPt,
      heightPt
    });
    
    const x = slideX + ptToPixels(translateX) * scale;
    const y = slideY + ptToPixels(translateY) * scale;
    const width = ptToPixels(widthPt) * scale * (transform.scaleX || 1);
    const height = ptToPixels(heightPt) * scale * (transform.scaleY || 1);
    
    console.log('Final render coordinates:', {
      x,
      y,
      width,
      height,
      slideX,
      slideY,
      slideWidthPx,
      slideHeightPx,
      viewport: this.viewport
    });

    this.renderedElements.push({
      objectId: shape.objectId,
      type: shape.shapeType,
      bounds: { x, y, width, height },
      properties: shape
    });

    this.ctx.save();

    if (shape.shapeProperties?.shapeBackgroundFill?.solidFill) {
      const fill = shape.shapeProperties.shapeBackgroundFill.solidFill;
      const color = fill.color?.rgbColor || { red: 0.5, green: 0.5, blue: 0.5 };
      const alpha = fill.alpha || 1;
      
      this.ctx.fillStyle = `rgba(${Math.round(color.red * 255)}, ${Math.round((color.green || 0) * 255)}, ${Math.round((color.blue || 0) * 255)}, ${alpha})`;
    } else {
      this.ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
    }

    switch (shape.shapeType) {
      case 'RECTANGLE':
      case 'TEXT_BOX':
        console.log('Drawing rectangle/text box at:', { x, y, width, height, fillStyle: this.ctx.fillStyle });
        this.ctx.fillRect(x, y, width, height);
        
        // If it's a text box and has text content, render the text
        if (shape.shapeType === 'TEXT_BOX' && shape.text) {
          this.ctx.save();
          
          // Set text properties
          this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Black text
          this.ctx.font = `${16 * scale}px sans-serif`;
          this.ctx.textAlign = 'left';
          this.ctx.textBaseline = 'top';
          
          // Add padding
          const padding = 10 * scale;
          const textX = x + padding;
          const textY = y + padding;
          const maxWidth = width - (padding * 2);
          
          // Simple text wrapping
          const words = shape.text.split(' ');
          let line = '';
          let lineY = textY;
          const lineHeight = 20 * scale;
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
              this.ctx.fillText(line, textX, lineY);
              line = words[i] + ' ';
              lineY += lineHeight;
            } else {
              line = testLine;
            }
          }
          this.ctx.fillText(line, textX, lineY);
          
          this.ctx.restore();
        }
        break;
      
      case 'ELLIPSE':
        this.ctx.beginPath();
        this.ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      
      case 'TRIANGLE':
        this.ctx.beginPath();
        this.ctx.moveTo(x + width/2, y);
        this.ctx.lineTo(x, y + height);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.closePath();
        this.ctx.fill();
        break;
      
      case 'LINE':
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.lineWidth = 2 * scale;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height/2);
        this.ctx.lineTo(x + width, y + height/2);
        this.ctx.stroke();
        break;
      
      case 'ARROW':
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.lineWidth = 2 * scale;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height/2);
        this.ctx.lineTo(x + width - 10, y + height/2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + width - 10, y + height/2 - 5);
        this.ctx.lineTo(x + width, y + height/2);
        this.ctx.lineTo(x + width - 10, y + height/2 + 5);
        this.ctx.stroke();
        break;
    }

    if (shape.shapeProperties?.outline) {
      const outline = shape.shapeProperties.outline;
      const outlineColor = outline.outlineFill?.solidFill?.color?.rgbColor || { red: 0, green: 1, blue: 0.65 };
      const outlineAlpha = outline.outlineFill?.solidFill?.alpha || 1;
      const outlineWeight = outline.weight?.magnitude || 2;
      
      this.ctx.strokeStyle = `rgba(${Math.round(outlineColor.red * 255)}, ${Math.round((outlineColor.green || 0) * 255)}, ${Math.round((outlineColor.blue || 0) * 255)}, ${outlineAlpha})`;
      this.ctx.lineWidth = outlineWeight * scale;
      
      if (shape.shapeType === 'RECTANGLE' || shape.shapeType === 'TEXT_BOX') {
        this.ctx.strokeRect(x, y, width, height);
      } else if (shape.shapeType === 'ELLIPSE') {
        this.ctx.beginPath();
        this.ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (shape.shapeType === 'TRIANGLE') {
        this.ctx.beginPath();
        this.ctx.moveTo(x + width/2, y);
        this.ctx.lineTo(x, y + height);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }

    if (isSelected) {
      this.drawSelectionOverlay(x, y, width, height);
    }

    this.ctx.restore();
    } catch (error) {
      console.error('Error in renderShape:', error);
      console.error('Shape data that caused error:', shape);
    }
  }

  private renderImage(image: any, isSelected: boolean) {
    const { scale, offsetX, offsetY } = this.viewport;
    const slideWidthPx = ptToPixels(SLIDE_WIDTH_PT) * scale;
    const slideHeightPx = ptToPixels(SLIDE_HEIGHT_PT) * scale;
    const slideX = (this.viewport.width - slideWidthPx) / 2 + offsetX;
    const slideY = (this.viewport.height - slideHeightPx) / 2 + offsetY;

    const props = image.elementProperties;
    const transform = props.transform || {};
    const size = props.size || { width: { magnitude: 300, unit: 'PT' }, height: { magnitude: 200, unit: 'PT' } };
    
    // Convert values based on units
    const getValueInPt = (value: number, unit: string = 'PT') => {
      if (unit === 'EMU') {
        return value / 12700; // 1 point = 12700 EMU
      }
      return value;
    };
    
    const translateX = getValueInPt(transform.translateX || 0, transform.unit || 'PT');
    const translateY = getValueInPt(transform.translateY || 0, transform.unit || 'PT');
    const widthPt = getValueInPt(size.width.magnitude, size.width.unit || 'PT');
    const heightPt = getValueInPt(size.height.magnitude, size.height.unit || 'PT');
    
    const x = slideX + ptToPixels(translateX) * scale;
    const y = slideY + ptToPixels(translateY) * scale;
    const width = ptToPixels(widthPt) * scale * (transform.scaleX || 1);
    const height = ptToPixels(heightPt) * scale * (transform.scaleY || 1);

    this.renderedElements.push({
      objectId: image.objectId,
      type: 'IMAGE',
      bounds: { x, y, width, height },
      properties: image
    });

    this.ctx.save();
    
    this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    this.ctx.fillRect(x, y, width, height);
    
    this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(x, y, width, height);
    
    this.ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
    this.ctx.font = `${12 * scale}px Inter, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Image Placeholder', x + width/2, y + height/2);
    
    if (isSelected) {
      this.drawSelectionOverlay(x, y, width, height);
    }

    this.ctx.restore();
  }

  private drawSelectionOverlay(x: number, y: number, width: number, height: number) {
    const { scale } = this.viewport;
    
    this.ctx.strokeStyle = 'rgba(6, 255, 165, 0.8)';
    this.ctx.lineWidth = 2 * scale;
    this.ctx.setLineDash([]);
    this.ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    
    const handleSize = 8 * scale;
    const handles = [
      { x: x - handleSize/2, y: y - handleSize/2 },
      { x: x + width/2 - handleSize/2, y: y - handleSize/2 },
      { x: x + width - handleSize/2, y: y - handleSize/2 },
      { x: x - handleSize/2, y: y + height/2 - handleSize/2 },
      { x: x + width - handleSize/2, y: y + height/2 - handleSize/2 },
      { x: x - handleSize/2, y: y + height - handleSize/2 },
      { x: x + width/2 - handleSize/2, y: y + height - handleSize/2 },
      { x: x + width - handleSize/2, y: y + height - handleSize/2 },
    ];
    
    this.ctx.fillStyle = '#06ffa5';
    handles.forEach(handle => {
      this.ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
    });
  }

  getElementAtPoint(x: number, y: number): RenderedElement | null {
    for (let i = this.renderedElements.length - 1; i >= 0; i--) {
      const element = this.renderedElements[i];
      const { bounds } = element;
      
      if (x >= bounds.x && x <= bounds.x + bounds.width &&
          y >= bounds.y && y <= bounds.y + bounds.height) {
        return element;
      }
    }
    return null;
  }

  convertScreenToSlide(x: number, y: number): { x: number; y: number } {
    const { scale, offsetX, offsetY } = this.viewport;
    const slideWidthPx = ptToPixels(SLIDE_WIDTH_PT) * scale;
    const slideHeightPx = ptToPixels(SLIDE_HEIGHT_PT) * scale;
    const slideX = (this.viewport.width - slideWidthPx) / 2 + offsetX;
    const slideY = (this.viewport.height - slideHeightPx) / 2 + offsetY;
    
    return {
      x: pixelsToPt((x - slideX) / scale),
      y: pixelsToPt((y - slideY) / scale)
    };
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}