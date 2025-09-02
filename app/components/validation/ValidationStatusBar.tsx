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
        return <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      case 'valid':
        return <div className="w-2 h-2 rounded-full bg-emerald-500" />
    }
  }, [globalValidationState])

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-40",
      "backdrop-blur-2xl bg-black/80",
      "border-t border-white/5",
      "transition-all duration-300"
    )}>
      <div className="h-12 flex items-center px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-8">
            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              {statusIcon}
              <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                globalValidationState === 'valid' ? 'text-emerald-400' : 
                globalValidationState === 'warning' ? 'text-amber-400' : 'text-red-400'
              )}>
                {globalValidationState}
              </span>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10" />

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Operations:</span>
                <span className="font-mono text-zinc-300">{operations.length}</span>
              </div>
              
              {errorCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-red-400/70">Errors:</span>
                  <span className="font-mono text-red-400">{errorCount - warningCount}</span>
                </div>
              )}
              
              {warningCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400/70">Warnings:</span>
                  <span className="font-mono text-amber-400">{warningCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('validate-all'))
              }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium",
                "bg-white/5 hover:bg-white/10",
                "text-zinc-400 hover:text-zinc-200",
                "border border-white/10 hover:border-white/20",
                "transition-all duration-200"
              )}
            >
              <FileCheck className="h-3 w-3 inline-block mr-1.5" />
              Validate All
            </button>
            
            <button
              onClick={clearOperations}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium",
                "hover:bg-red-500/10",
                "text-zinc-500 hover:text-red-400",
                "transition-all duration-200"
              )}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}