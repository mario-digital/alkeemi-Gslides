'use client'

import React, { useEffect, useCallback } from 'react'
import { GlassPanel } from '@/components/ui/glass-panel'
import { BatchUpdateRequest } from '@/types/batch-update'
import { CreateElementForm } from '../forms/CreateElementForm'
import { UpdateElementForm } from '../forms/UpdateElementForm'
import { DeleteElementForm } from '../forms/DeleteElementForm'
import { TransformElementForm } from '../forms/TransformElementForm'

interface OperationEditorModalProps {
  isOpen: boolean
  onClose: () => void
  operation?: BatchUpdateRequest
  operationIndex?: number
  onSave: (operation: BatchUpdateRequest) => void
}

const getOperationType = (operation?: BatchUpdateRequest): string => {
  if (!operation) return 'create'
  const keys = Object.keys(operation)
  if (keys.length > 0) return keys[0]
  return 'create'
}

const getFormComponent = (type: string) => {
  const formMap: Record<string, React.ComponentType<any>> = {
    createShape: CreateElementForm,
    createTextBox: CreateElementForm,
    createImage: CreateElementForm,
    createLine: CreateElementForm,
    createTable: CreateElementForm,
    updatePageElementTransform: TransformElementForm,
    updateShapeProperties: UpdateElementForm,
    updateTextStyle: UpdateElementForm,
    updateImageProperties: UpdateElementForm,
    deleteObject: DeleteElementForm,
  }
  
  return formMap[type] || CreateElementForm
}

export function OperationEditorModal({
  isOpen,
  onClose,
  operation,
  operationIndex,
  onSave
}: OperationEditorModalProps) {
  const operationType = getOperationType(operation)
  const FormComponent = getFormComponent(operationType)

  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscKey])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[20px] animate-in fade-in duration-200"
        aria-hidden="true"
      />
      
      {/* Modal Panel */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-90 fade-in duration-250"
      >
        <GlassPanel className="p-8 overflow-y-auto max-h-[90vh]">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 id="modal-title" className="text-2xl font-bold text-white">
                {operation ? 
                  (operationType.includes('update') ? 'Update Element' : `Edit Operation #${(operationIndex || 0) + 1}`) 
                  : 'New Operation'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="mt-6">
              <FormComponent
                operation={operation}
                onSave={onSave}
                onCancel={onClose}
              />
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}