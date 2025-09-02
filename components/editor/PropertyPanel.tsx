'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShapeProperties } from './properties/ShapeProperties';
import { TextProperties } from './properties/TextProperties';
import { TransformProperties } from './properties/TransformProperties';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import { cn } from '@/lib/utils';
import { Palette, Type, Move3d, Settings } from 'lucide-react';

interface PropertyPanelProps {
  className?: string;
}

export function PropertyPanel({ className }: PropertyPanelProps) {
  const { selectedElement } = useBatchUpdateStore();
  const [activeTab, setActiveTab] = useState('shape');

  if (!selectedElement) {
    return (
      <div className={cn(
        "p-4 bg-zinc-950/90 border border-purple-500/20 rounded-lg backdrop-blur-xl",
        "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        className
      )}>
        <div className="text-center text-zinc-500 text-sm">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  const isTextElement = selectedElement.type === 'TEXT_BOX';

  return (
    <div className={cn(
      "bg-zinc-950/90 border border-purple-500/20 rounded-lg backdrop-blur-xl",
      "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
      className
    )}>
      <div className="p-3 border-b border-purple-500/20">
        <h3 className="text-sm font-semibold text-purple-300">
          Properties
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          {selectedElement.objectId}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-zinc-900/50 m-2 mb-0">
          <TabsTrigger 
            value="shape" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Palette className="w-3 h-3 mr-1.5" />
            Style
          </TabsTrigger>
          {isTextElement && (
            <TabsTrigger 
              value="text"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Type className="w-3 h-3 mr-1.5" />
              Text
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="transform"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Move3d className="w-3 h-3 mr-1.5" />
            Transform
          </TabsTrigger>
        </TabsList>

        <div className="p-3 pt-0">
          <TabsContent value="shape" className="mt-3 space-y-4">
            <ShapeProperties element={selectedElement} />
          </TabsContent>
          
          {isTextElement && (
            <TabsContent value="text" className="mt-3 space-y-4">
              <TextProperties element={selectedElement} />
            </TabsContent>
          )}
          
          <TabsContent value="transform" className="mt-3 space-y-4">
            <TransformProperties element={selectedElement} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}