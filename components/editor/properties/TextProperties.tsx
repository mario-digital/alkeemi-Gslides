'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBatchUpdateStore, SelectedElement } from '@/stores/batchUpdateStore';
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextPropertiesProps {
  element: SelectedElement;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Comic Sans MS',
  'Impact',
  'Palatino'
];

export function TextProperties({ element }: TextPropertiesProps) {
  const { operations, updateOperation, addOperation } = useBatchUpdateStore();
  
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#ffffff');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  useEffect(() => {
    const textOperation = operations.find((op: any) => 
      op.insertText?.objectId === element.objectId
    );
    
    if (textOperation && 'insertText' in textOperation) {
      setText(textOperation.insertText.text || '');
    }

    const styleOperation = operations.find((op: any) => 
      op.updateTextStyle?.objectId === element.objectId
    );
    
    if (styleOperation && 'updateTextStyle' in styleOperation) {
      const style = styleOperation.updateTextStyle.style;
      setFontSize(style.fontSize?.magnitude || 14);
      setFontFamily(style.fontFamily || 'Arial');
      setIsBold(style.bold || false);
      setIsItalic(style.italic || false);
      setIsUnderline(style.underline || false);
      setIsStrikethrough(style.strikethrough || false);
      
      if (style.foregroundColor?.opaqueColor?.rgbColor) {
        const color = style.foregroundColor.opaqueColor.rgbColor;
        setTextColor(rgbToHex(color.red || 0, color.green || 0, color.blue || 0));
      }
    }
  }, [element, operations]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    updateTextContent(newText);
  };

  const updateTextContent = (newText: string) => {
    const textOpIndex = operations.findIndex((op: any) => 
      op.insertText?.objectId === element.objectId
    );
    
    if (textOpIndex !== -1) {
      const operation = operations[textOpIndex];
      if ('insertText' in operation) {
        updateOperation(textOpIndex, {
          insertText: {
            ...operation.insertText,
            text: newText
          }
        });
      }
    } else {
      addOperation({
        insertText: {
          objectId: element.objectId,
          text: newText,
          insertionIndex: 0
        }
      });
    }
  };

  const updateTextStyle = () => {
    const styleOpIndex = operations.findIndex((op: any) => 
      op.updateTextStyle?.objectId === element.objectId
    );
    
    const styleUpdate = {
      updateTextStyle: {
        objectId: element.objectId,
        style: {
          bold: isBold,
          italic: isItalic,
          underline: isUnderline,
          strikethrough: isStrikethrough,
          fontSize: { magnitude: fontSize, unit: 'PT' as const },
          fontFamily,
          foregroundColor: {
            opaqueColor: {
              rgbColor: hexToRgb(textColor)
            }
          }
        },
        fields: 'bold,italic,underline,strikethrough,fontSize,fontFamily,foregroundColor'
      }
    };
    
    if (styleOpIndex !== -1) {
      updateOperation(styleOpIndex, styleUpdate);
    } else {
      addOperation(styleUpdate);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Text Content</Label>
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="min-h-[80px] bg-zinc-900/50 border-purple-500/30 text-xs"
          placeholder="Enter text..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Font</Label>
        <div className="flex gap-2">
          <Select value={fontFamily} onValueChange={(value) => { setFontFamily(value); updateTextStyle(); }}>
            <SelectTrigger className="flex-1 h-9 bg-zinc-900/50 border-purple-500/30 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map(font => (
                <SelectItem key={font} value={font} className="text-xs">
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => { setFontSize(parseInt(e.target.value) || 14); updateTextStyle(); }}
            min={8}
            max={96}
            className="w-16 h-9 bg-zinc-900/50 border-purple-500/30 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={textColor}
            onChange={(e) => { setTextColor(e.target.value); updateTextStyle(); }}
            className="w-12 h-9 p-1 bg-zinc-900/50 border-purple-500/30"
          />
          <Input
            type="text"
            value={textColor}
            onChange={(e) => { setTextColor(e.target.value); updateTextStyle(); }}
            className="flex-1 h-9 bg-zinc-900/50 border-purple-500/30 text-xs"
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Style</Label>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={isBold ? "default" : "outline"}
            onClick={() => { setIsBold(!isBold); updateTextStyle(); }}
            className={cn(
              "h-8 w-8 p-0",
              isBold ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={isItalic ? "default" : "outline"}
            onClick={() => { setIsItalic(!isItalic); updateTextStyle(); }}
            className={cn(
              "h-8 w-8 p-0",
              isItalic ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={isUnderline ? "default" : "outline"}
            onClick={() => { setIsUnderline(!isUnderline); updateTextStyle(); }}
            className={cn(
              "h-8 w-8 p-0",
              isUnderline ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <Underline className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={isStrikethrough ? "default" : "outline"}
            onClick={() => { setIsStrikethrough(!isStrikethrough); updateTextStyle(); }}
            className={cn(
              "h-8 w-8 p-0",
              isStrikethrough ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-400">Alignment</Label>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={alignment === 'left' ? "default" : "outline"}
            onClick={() => setAlignment('left')}
            className={cn(
              "h-8 w-8 p-0",
              alignment === 'left' ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={alignment === 'center' ? "default" : "outline"}
            onClick={() => setAlignment('center')}
            className={cn(
              "h-8 w-8 p-0",
              alignment === 'center' ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={alignment === 'right' ? "default" : "outline"}
            onClick={() => setAlignment('right')}
            className={cn(
              "h-8 w-8 p-0",
              alignment === 'right' ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={alignment === 'justify' ? "default" : "outline"}
            onClick={() => setAlignment('justify')}
            className={cn(
              "h-8 w-8 p-0",
              alignment === 'justify' ? "bg-purple-500/20 border-purple-400" : "bg-zinc-900/50 border-purple-500/30"
            )}
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </Button>
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
  } : { red: 1, green: 1, blue: 1 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}