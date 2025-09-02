'use client'

import React, { useState } from 'react'
import { OperationEditorModal } from '@/app/components/editor/modals/OperationEditorModal'
import { OperationsList } from '@/app/components/editor/operations/OperationsList'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { BatchUpdateRequest } from '@/types/batch-update'
import { Button } from '@/components/ui/button'

export default function ModalTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOperation, setEditingOperation] = useState<BatchUpdateRequest | undefined>()
  const [editingIndex, setEditingIndex] = useState<number | undefined>()
  
  const { operations, addRequest, updateOperation } = useBatchUpdateStore()

  const handleNewOperation = () => {
    setEditingOperation(undefined)
    setEditingIndex(undefined)
    setIsModalOpen(true)
  }

  const handleEditOperation = (index: number) => {
    setEditingOperation(operations[index])
    setEditingIndex(index)
    setIsModalOpen(true)
  }

  const handleSaveOperation = (operation: BatchUpdateRequest) => {
    if (editingIndex !== undefined) {
      updateOperation(editingIndex, operation)
    } else {
      addRequest(operation)
    }
    setIsModalOpen(false)
    setEditingOperation(undefined)
    setEditingIndex(undefined)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOperation(undefined)
    setEditingIndex(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Operation Editor Modal Test
          </h1>
          <p className="text-gray-400">
            Test the modal forms for creating and editing batch update operations
          </p>
        </div>

        <div className="mb-6">
          <Button
            onClick={handleNewOperation}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
          >
            + Add New Operation
          </Button>
        </div>

        {operations.length > 0 ? (
          <OperationsList
            operations={operations}
            onEdit={handleEditOperation}
            onDelete={(index) => console.log('Delete', index)}
            onReorder={(from, to) => console.log('Reorder', from, to)}
          />
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-400">No operations yet. Click &quot;Add New Operation&quot; to start.</p>
          </div>
        )}

        <OperationEditorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          operation={editingOperation}
          operationIndex={editingIndex}
          onSave={handleSaveOperation}
        />
      </div>
    </div>
  )
}