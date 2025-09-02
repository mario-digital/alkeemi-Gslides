'use client'

import { SelectionManager } from '@/app/components/editor/selection/SelectionManager'
import { ConnectionLines } from '@/app/components/editor/selection/ConnectionLines'
import { ValidationStatusBar } from '@/app/components/validation/ValidationStatusBar'
import { ImportDropZone } from '@/app/components/file-operations/ImportDropZone'
import { ExportPanel } from '@/app/components/file-operations/ExportPanel'
import { OperationsList } from '@/app/components/editor/operations/OperationsList'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { Button } from '@/components/ui/button'

export default function IntegrationTestPage() {
  const { 
    operations, 
    syncSelection,
    selectedOperationId,
    addOperation 
  } = useBatchUpdateStore()

  const addTestOperation = () => {
    addOperation({
      createShape: {
        objectId: `shape_${Date.now()}`,
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'p1',
          size: {
            width: { magnitude: 100, unit: 'PT' },
            height: { magnitude: 100, unit: 'PT' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 100,
            translateY: 100,
            unit: 'PT'
          }
        }
      }
    })
  }

  return (
    <SelectionManager>
      <div className="min-h-screen bg-black text-white p-8">
        <ConnectionLines />
        
        <div className="container mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Integration Test</h1>
            <p className="text-gray-400">Testing bi-directional selection, validation, and import/export</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Operations</h2>
                <Button onClick={addTestOperation}>
                  Add Test Operation
                </Button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                {operations.length > 0 ? (
                  <OperationsList />
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No operations yet. Add one or import a file.
                  </p>
                )}
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Import</h3>
                <ImportDropZone />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Export</h3>
                <ExportPanel />
              </div>

              {/* Preview Mock */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-900 rounded-lg p-4 h-64 relative">
                  {operations.map((op, index) => {
                    const operationType = Object.keys(op)[0]
                    const data = (op as Record<string, { objectId?: string }>)[operationType]
                    const elementId = data.objectId || `element_${index}`
                    
                    return (
                      <div
                        key={index}
                        data-element-id={elementId}
                        onClick={() => syncSelection('element', elementId)}
                        className={`
                          absolute w-20 h-20 bg-blue-500/20 border border-blue-500/50 
                          rounded cursor-pointer transition-all hover:bg-blue-500/30
                          ${selectedOperationId === elementId ? 'selected-cyan-glow' : ''}
                        `}
                        style={{
                          left: `${(index % 3) * 90}px`,
                          top: `${Math.floor(index / 3) * 90}px`
                        }}
                      >
                        <span className="text-xs p-1">{operationType}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ValidationStatusBar />
      </div>
    </SelectionManager>
  )
}