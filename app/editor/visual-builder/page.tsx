'use client';

import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ElementToolbar } from '@/components/editor/ElementToolbar';
import { PropertyPanel } from '@/components/editor/PropertyPanel';
import { SlidePreviewRenderer } from '@/components/preview/SlidePreviewRenderer';
import { useBatchUpdateStore } from '@/stores/batchUpdateStore';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Download, Upload, Trash2 } from 'lucide-react';

export default function VisualBuilderPage() {
  const { 
    operations, 
    selectElement, 
    undo, 
    redo, 
    clearOperations,
    isDirty,
    getBatchUpdateRequest 
  } = useBatchUpdateStore();
  
  const [previewScale] = useState(1);

  const handleElementClick = (objectId: string) => {
    const element = operations.find((op: any) => {
      if ('createShape' in op) return op.createShape.objectId === objectId;
      if ('createImage' in op) return op.createImage.objectId === objectId;
      return false;
    });
    
    if (element) {
      let type = 'UNKNOWN';
      let properties = {};
      
      if ('createShape' in element) {
        type = element.createShape.shapeType;
        properties = element.createShape;
      } else if ('createImage' in element) {
        type = 'IMAGE';
        properties = element.createImage;
      }
      
      selectElement({
        objectId,
        type,
        properties
      });
    }
  };

  const handleExport = () => {
    const batchUpdate = getBatchUpdateRequest();
    const jsonStr = JSON.stringify(batchUpdate, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch-update.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        if (data.requests && Array.isArray(data.requests)) {
          clearOperations();
          data.requests.forEach((req: any) => {
            useBatchUpdateStore.getState().addOperation(req);
          });
        }
      } catch (error) {
        console.error('Failed to import file:', error);
      }
    };
    input.click();
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Header Toolbar */}
      <div className="h-14 border-b border-purple-500/20 bg-zinc-950/90 backdrop-blur-xl flex items-center px-4 gap-2">
        <h1 className="text-sm font-semibold text-purple-300 mr-4">
          Visual Element Builder
        </h1>
        
        <div className="flex items-center gap-1 border-r border-purple-500/20 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            className="h-8 w-8 p-0 hover:bg-purple-500/10"
            title="Undo"
          >
            <Undo2 className="h-4 w-4 text-zinc-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            className="h-8 w-8 p-0 hover:bg-purple-500/10"
            title="Redo"
          >
            <Redo2 className="h-4 w-4 text-zinc-400" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImport}
            className="h-8 px-3 hover:bg-purple-500/10"
          >
            <Upload className="h-4 w-4 mr-1.5 text-zinc-400" />
            <span className="text-xs text-zinc-300">Import</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-8 px-3 hover:bg-purple-500/10"
            disabled={operations.length === 0}
          >
            <Download className="h-4 w-4 mr-1.5 text-zinc-400" />
            <span className="text-xs text-zinc-300">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearOperations}
            className="h-8 px-3 hover:bg-red-500/10"
            disabled={operations.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1.5 text-red-400" />
            <span className="text-xs text-red-300">Clear</span>
          </Button>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-amber-400">Unsaved changes</span>
          )}
          <span className="text-xs text-zinc-500">
            {operations.length} operation{operations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Element Toolbar */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
            <div className="h-full p-3 overflow-y-auto">
              <ElementToolbar />
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="w-px bg-purple-500/20 hover:bg-purple-500/40 transition-colors" />
          
          {/* Center Panel - Canvas */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex items-center justify-center p-4">
              <SlidePreviewRenderer
                width={960}
                height={540}
                scale={previewScale}
                onElementClick={handleElementClick}
                className="w-full h-full max-w-[960px] max-h-[540px]"
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="w-px bg-purple-500/20 hover:bg-purple-500/40 transition-colors" />
          
          {/* Right Panel - Properties */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full p-3 overflow-y-auto">
              <PropertyPanel />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}