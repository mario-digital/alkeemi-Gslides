'use client'

import { useState, useCallback } from 'react'
import { Upload, FileJson, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { BatchUpdateOperation } from '@/types/batch-update'
import { validateBatchUpdate } from '@/lib/validation/batch-update-validator'
import { parseMarkdownToOperations } from '@/lib/converters/markdown-parser'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function ImportDropZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [importPreview, setImportPreview] = useState<BatchUpdateOperation[] | null>(null)
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const { importOperations, setValidationErrors, setGlobalValidationState } = useBatchUpdateStore()

  const processFile = useCallback(async (file: File) => {
    const text = await file.text()
    let operations: BatchUpdateOperation[] = []
    let errors: string[] = []

    try {
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        operations = Array.isArray(data) ? data : data.requests || [data]
      } else if (file.name.endsWith('.md')) {
        const result = parseMarkdownToOperations(text)
        operations = result.operations
        errors = result.errors
      } else {
        errors.push('Unsupported file format. Please use JSON or Markdown files.')
      }
    } catch (error) {
      errors.push(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    if (operations.length > 0) {
      const validation = validateBatchUpdate(operations)
      if (validation.errors.length > 0) {
        errors.push(...validation.errors)
      }
    }

    setImportPreview(operations)
    setImportErrors(errors)
    setShowPreview(true)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const confirmImport = useCallback(() => {
    if (importPreview && importErrors.length === 0) {
      importOperations(importPreview)
      setValidationErrors({})
      setGlobalValidationState('valid')
      setShowPreview(false)
      setImportPreview(null)
      setImportErrors([])
    }
  }, [importPreview, importErrors, importOperations, setValidationErrors, setGlobalValidationState])

  return (
    <>
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all duration-300",
          "bg-black/40 backdrop-blur-sm",
          isDragging 
            ? "border-cyan-500 bg-cyan-500/10 animate-border-dance" 
            : "border-gray-600 hover:border-gray-500"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
          <input
            type="file"
            accept=".json,.md"
            onChange={handleFileSelect}
            className="sr-only"
          />
          
          <Upload className={cn(
            "h-12 w-12 mb-4 transition-colors",
            isDragging ? "text-cyan-500" : "text-gray-400"
          )} />
          
          <p className="text-sm text-gray-300 mb-2">
            Drop JSON or Markdown files here
          </p>
          <p className="text-xs text-gray-500">
            or click to browse
          </p>

          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileJson className="h-4 w-4" />
              <span>.json</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileText className="h-4 w-4" />
              <span>.md</span>
            </div>
          </div>
        </label>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Import Preview</DialogTitle>
            <DialogDescription>
              Review the operations to be imported
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {importErrors.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                <p className="text-sm font-medium text-red-400 mb-2">
                  Import Errors:
                </p>
                <ul className="space-y-1">
                  {importErrors.map((error, index) => (
                    <li key={index} className="text-xs text-red-300">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {importPreview && (
              <div className="p-3 bg-gray-900 rounded-md">
                <p className="text-sm font-medium mb-2">
                  Operations to import: {importPreview.length}
                </p>
                <pre className="text-xs text-gray-400 overflow-x-auto">
                  {JSON.stringify(importPreview, null, 2).slice(0, 500)}...
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmImport}
              disabled={importErrors.length > 0}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes border-dance {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-border-dance {
          background: linear-gradient(
            90deg,
            rgba(6, 182, 212, 0.1),
            rgba(6, 182, 212, 0.3),
            rgba(6, 182, 212, 0.1)
          );
          background-size: 200% 200%;
          animation: border-dance 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-border-dance {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}