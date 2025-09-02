'use client'

import { useState } from 'react'
import { SplitScreenLayout } from '@/components/layout/SplitScreenLayout'
import { Header } from '@/components/layout/Header'
import { ValidationStatusBar } from '@/app/components/validation/ValidationStatusBar'
import { AccessibilityProvider } from '@/app/components/accessibility/AccessibilityProvider'
import { OperationsList } from '@/app/components/editor/operations/OperationsList'
import { FloatingAddButton } from '@/app/components/editor/operations/FloatingAddButton'
import { OperationEditorModal } from '@/app/components/editor/modals/OperationEditorModal'
import { SelectionManager } from '@/app/components/editor/selection/SelectionManager'
import { ConnectionLines } from '@/app/components/editor/selection/ConnectionLines'
import { SlidePreviewRenderer } from '@/components/preview/SlidePreviewRenderer'
import { ElementToolbar } from '@/components/editor/ElementToolbar'
import { PropertyPanel } from '@/components/editor/PropertyPanel'
import { ImportDialog } from '@/app/components/import-export/ImportDialog'
import { ExportDialog } from '@/app/components/import-export/ExportDialog'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { BatchUpdateOperation } from '@/types/batch-update'
import type { OperationData } from '@/app/components/editor/operations/OperationCard'

export default function EditorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOperation, setEditingOperation] = useState<BatchUpdateOperation | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create')
  
  const {
    operations,
    selectedOperationIndex,
    selectedElement,
    addOperation,
    updateOperation,
    selectOperation,
    selectElement,
    syncSelection
  } = useBatchUpdateStore()

  const handleAddOperation = () => {
    setModalMode('create')
    setEditingOperation(null)
    setEditingIndex(null)
    setIsModalOpen(true)
  }
  
  const handleUpdateOperation = () => {
    if (!selectedOperationId) {
      alert('Please select an element to update by clicking the checkbox next to it')
      return
    }
    
    const index = parseInt(selectedOperationId.split('_')[1])
    if (!isNaN(index) && index >= 0 && index < operations.length) {
      setModalMode('update')
      setEditingOperation(operations[index])
      setEditingIndex(index)
      setIsModalOpen(true)
    }
  }

  const handleEditOperation = (index: number) => {
    setEditingOperation(operations[index])
    setEditingIndex(index)
    setIsModalOpen(true)
  }

  const handleSaveOperation = (operation: BatchUpdateOperation) => {
    if (editingIndex !== null) {
      updateOperation(editingIndex, operation)
    } else {
      addOperation(operation)
    }
    setIsModalOpen(false)
    setEditingOperation(null)
    setEditingIndex(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOperation(null)
    setEditingIndex(null)
  }

  const leftPanel = (
    <SelectionManager>
      <div className="flex h-full flex-col relative">
        {selectedElement && (
          <div className="border-b border-border">
            <ElementToolbar selectedElement={selectedElement} />
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <OperationsList 
            operations={operations.map((op, index) => {
              const opType = Object.keys(op)[0]
              const opData = Object.values(op)[0] as any
              return {
                id: `op_${index}`,
                type: opType.includes('create') ? 'create' : 
                      opType.includes('update') ? 'update' :
                      opType.includes('delete') ? 'delete' :
                      opType.includes('transform') ? 'transform' : 'text',
                title: opType.replace(/([A-Z])/g, ' $1').trim(),
                description: `Object ID: ${opData?.objectId || 'N/A'}`,
                objectId: opData?.objectId,
                pageObjectId: opData?.elementProperties?.pageObjectId || opData?.pageObjectId,
                isValid: true
              } as OperationData
            })}
            selectedOperationId={selectedOperationId}
            onOperationSelect={(opData) => {
              setSelectedOperationId(opData.id === selectedOperationId ? null : opData.id)
            }}
            onOperationHover={(objectId) => {
              useBatchUpdateStore.getState().setHoveredElement(objectId)
            }}
            onOperationEdit={(opData) => {
              const index = parseInt(opData.id.split('_')[1])
              handleEditOperation(index)
            }}
            onOperationDelete={(id) => {
              const index = parseInt(id.split('_')[1])
              if (!isNaN(index) && index >= 0 && index < operations.length) {
                useBatchUpdateStore.getState().deleteOperation(index)
              }
            }}
            onReorder={(newOperations) => {
              // Map the reordered OperationData back to indices
              const newIndices = newOperations.map(op => 
                parseInt(op.id.split('_')[1])
              )
              // Reorder the actual operations based on new indices
              const reorderedOps = newIndices.map(i => operations[i])
              useBatchUpdateStore.getState().clearOperations()
              reorderedOps.forEach(op => {
                useBatchUpdateStore.getState().addOperation(op)
              })
            }}
          />
        </div>
        {selectedElement && (
          <div className="border-t border-border">
            <PropertyPanel selectedElement={selectedElement} />
          </div>
        )}
        <FloatingAddButton onAddOperation={(type) => {
          console.log('Add operation type:', type)
          if (type === 'update' || type === 'transform' || type === 'delete') {
            handleUpdateOperation()
          } else {
            handleAddOperation()
          }
        }} />
        <ConnectionLines />
      </div>
    </SelectionManager>
  )

  const rightPanel = (
    <div className="h-full">
      <SlidePreviewRenderer className="h-full" />
    </div>
  )

  return (
    <AccessibilityProvider>
      <div className="flex h-screen flex-col">
        <Header 
          onImport={() => setShowImport(true)}
          onExport={() => setShowExport(true)}
        />
        <div className="flex-1 relative">
          <SplitScreenLayout leftPanel={leftPanel} rightPanel={rightPanel} />
        </div>
        <ValidationStatusBar />
        
        {/* Modals and overlays */}
        <OperationEditorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveOperation}
          operation={editingOperation}
        />
        <ImportDialog 
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onImport={(data) => {
            // Handle imported data - add operations to store
            if (data && data.requests) {
              useBatchUpdateStore.getState().clearOperations()
              data.requests.forEach((op: BatchUpdateOperation) => {
                useBatchUpdateStore.getState().addOperation(op)
              })
            }
            setShowImport(false)
          }}
        />
        <ExportDialog 
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          data={{ requests: operations }}
        />
      </div>
    </AccessibilityProvider>
  )
}