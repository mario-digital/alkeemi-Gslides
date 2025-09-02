'use client'

import { useState, useCallback } from 'react'
import { Download, FileJson, FileText, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { formatOperationsAsMarkdown } from '@/lib/converters/markdown-formatter'
import { Button } from '@/components/ui/button'
import { SuccessParticles } from '@/app/components/validation/SuccessParticles'

export function ExportPanel() {
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown'>('json')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successPosition, setSuccessPosition] = useState({ x: 0, y: 0 })
  const { operations, globalValidationState } = useBatchUpdateStore()

  const isExportDisabled = globalValidationState === 'invalid' || operations.length === 0

  const handleExport = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isExportDisabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    setSuccessPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    })

    let content: string
    let mimeType: string
    let fileName: string

    if (exportFormat === 'json') {
      content = JSON.stringify({ requests: operations }, null, 2)
      mimeType = 'application/json'
      fileName = `batchUpdate-${Date.now()}.json`
    } else {
      content = formatOperationsAsMarkdown(operations)
      mimeType = 'text/markdown'
      fileName = `batchUpdate-${Date.now()}.md`
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setShowSuccess(true)
  }, [operations, exportFormat, isExportDisabled])

  return (
    <>
      <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-gray-800">
        <h3 className="text-sm font-medium mb-3">Export Operations</h3>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setExportFormat('json')}
              className={cn(
                "flex-1 p-2 rounded-md border transition-all",
                "flex items-center justify-center gap-2",
                exportFormat === 'json'
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-gray-700 hover:border-gray-600 text-gray-400"
              )}
            >
              <FileJson className="h-4 w-4" />
              <span className="text-xs">JSON</span>
              {exportFormat === 'json' && <Check className="h-3 w-3" />}
            </button>
            
            <button
              onClick={() => setExportFormat('markdown')}
              className={cn(
                "flex-1 p-2 rounded-md border transition-all",
                "flex items-center justify-center gap-2",
                exportFormat === 'markdown'
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-gray-700 hover:border-gray-600 text-gray-400"
              )}
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Markdown</span>
              {exportFormat === 'markdown' && <Check className="h-3 w-3" />}
            </button>
          </div>

          {globalValidationState === 'invalid' && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md">
              <p className="text-xs text-red-400">
                Fix validation errors before exporting
              </p>
            </div>
          )}

          <Button
            onClick={handleExport}
            disabled={isExportDisabled}
            className={cn(
              "w-full gap-2",
              !isExportDisabled && "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            )}
          >
            <Download className="h-4 w-4" />
            Export as {exportFormat === 'json' ? 'JSON' : 'Markdown'}
          </Button>
        </div>
      </div>

      <SuccessParticles
        trigger={showSuccess}
        x={successPosition.x}
        y={successPosition.y}
        onComplete={() => setShowSuccess(false)}
      />
    </>
  )
}