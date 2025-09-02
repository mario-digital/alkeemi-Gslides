'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AutoCompleteField } from '../modals/AutoCompleteField'
import { BatchUpdateOperation } from '@/types/batch-update'

interface DeleteElementFormProps {
  operation?: BatchUpdateOperation
  onSave: (operation: BatchUpdateOperation) => void
  onCancel: () => void
}

export function DeleteElementForm({ operation, onSave, onCancel }: DeleteElementFormProps) {
  const existingDelete = operation ? 'deleteObject' in operation ? operation.deleteObject : undefined : undefined
  const [objectId, setObjectId] = useState(existingDelete?.objectId || '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = (): boolean => {
    const errors: string[] = []
    
    if (!objectId) {
      errors.push('Object ID is required')
    }
    
    if (!confirmDelete) {
      errors.push('You must confirm the deletion')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const newOperation: BatchUpdateOperation = {
      deleteObject: {
        objectId
      }
    }
    
    onSave(newOperation)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warning Message */}
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg 
            className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div>
            <h4 className="text-red-400 font-medium mb-1">Warning: Permanent Deletion</h4>
            <p className="text-red-300 text-sm">
              This action will permanently delete the selected element from the presentation. 
              This operation cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">Validation Errors</h4>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-300 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Object ID */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          Object ID to Delete <span className="text-red-400">*</span>
        </label>
        <AutoCompleteField
          value={objectId}
          onChange={setObjectId}
          placeholder="Enter the ID of the element to delete"
          suggestions={['shape-1', 'text-1', 'image-1', 'line-1', 'table-1']}
          recentItems={[]}
          fuzzySearch
          className="mb-2"
        />
        <p className="text-xs text-gray-400">
          Enter the exact object ID of the element you want to delete.
        </p>
      </div>

      {/* Object Preview (if available) */}
      {objectId && (
        <div className="bg-white/5 border border-white/20 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-200 mb-2">Object to Delete</h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Object ID:</span>
              <span className="font-mono text-cyan-400">{objectId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Type:</span>
              <span className="text-gray-200">Unknown (will be determined at runtime)</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Checkbox */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-red-500 border-red-500/50 rounded focus:ring-red-500 focus:ring-offset-0 bg-red-900/20"
            aria-describedby="confirm-delete-description"
          />
          <div>
            <span className="text-sm font-medium text-red-400">
              I understand this action is permanent
            </span>
            <p id="confirm-delete-description" className="text-xs text-red-300 mt-1">
              Check this box to confirm that you want to permanently delete the element 
              with ID &quot;{objectId || '...'}&quot; from the presentation.
            </p>
          </div>
        </label>
      </div>

      {/* Additional Warning */}
      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <svg 
          className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <div className="text-xs text-yellow-300">
          <strong>Note:</strong> If this element is referenced by other operations in your 
          batch update, those operations may fail. Make sure to update any dependent operations.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!confirmDelete || !objectId}
          className={`
            px-6 font-semibold transition-all
            ${confirmDelete && objectId
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <svg 
            className="w-4 h-4 mr-2 inline" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
          Delete Element
        </Button>
      </div>
    </form>
  )
}