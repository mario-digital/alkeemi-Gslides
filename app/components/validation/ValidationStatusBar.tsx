'use client'

import { useMemo } from 'react'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { AlertCircle, CheckCircle2, AlertTriangle, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ValidationStatusBar() {
  const { 
    operations, 
    validationErrors, 
    globalValidationState,
    clearOperations 
  } = useBatchUpdateStore()

  const errorCount = useMemo(() => {
    return Object.values(validationErrors).flat().length
  }, [validationErrors])

  const warningCount = useMemo(() => {
    return Object.values(validationErrors)
      .flat()
      .filter(error => error.includes('warning'))
      .length
  }, [validationErrors])

  const statusIcon = useMemo(() => {
    switch (globalValidationState) {
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }, [globalValidationState])

  const statusColor = useMemo(() => {
    switch (globalValidationState) {
      case 'invalid':
        return 'border-red-500/50 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10'
      case 'valid':
        return 'border-green-500/50 bg-green-500/10'
    }
  }, [globalValidationState])

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40",
      "backdrop-blur-xl bg-black/40 border-t",
      statusColor,
      "transition-all duration-300"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {statusIcon}
              <span className="text-sm font-medium">
                {globalValidationState === 'valid' ? 'Valid' : 
                 globalValidationState === 'warning' ? 'Warnings' : 'Invalid'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Operations: <span className="font-mono text-white">{operations.length}</span>
              </span>
              
              {errorCount > 0 && (
                <span className="text-red-400">
                  Errors: <span className="font-mono">{errorCount - warningCount}</span>
                </span>
              )}
              
              {warningCount > 0 && (
                <span className="text-yellow-400">
                  Warnings: <span className="font-mono">{warningCount}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Trigger validation for all operations
                window.dispatchEvent(new CustomEvent('validate-all'))
              }}
              className="gap-2"
            >
              <FileCheck className="h-4 w-4" />
              Validate All
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearOperations}
              className="text-red-400 hover:text-red-300"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}