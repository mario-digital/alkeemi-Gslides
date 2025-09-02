'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { GlassPanel } from '@/components/ui/glass-panel'
import { OperationCard, type OperationData } from './OperationCard'
import { ScrollArea } from '@/components/ui/scroll-area'

interface OperationsListProps {
  operations: OperationData[]
  className?: string
  selectedOperationId?: string
  onOperationEdit?: (operation: OperationData) => void
  onOperationDelete?: (id: string) => void
  onOperationSelect?: (operation: OperationData) => void
  onReorder?: (operations: OperationData[]) => void
}

const OperationsList: React.FC<OperationsListProps> = ({
  operations,
  className,
  selectedOperationId,
  onOperationEdit,
  onOperationDelete,
  onOperationSelect,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isVirtualized, setIsVirtualized] = React.useState(false)
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 50 })

  React.useEffect(() => {
    setIsVirtualized(operations.length > 50)
  }, [operations.length])

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!isVirtualized) return

    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const itemHeight = 120
    const containerHeight = container.clientHeight
    const buffer = 5

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + buffer * 2
    const end = Math.min(operations.length, start + visibleCount)

    setVisibleRange({ start, end })
  }, [isVirtualized, operations.length])

  const visibleOperations = isVirtualized 
    ? operations.slice(visibleRange.start, visibleRange.end)
    : operations

  const virtualHeight = isVirtualized 
    ? operations.length * 120
    : undefined

  const virtualOffset = isVirtualized
    ? visibleRange.start * 120
    : 0

  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-neon/10">
        <h2 className="text-lg font-semibold text-text-primary">
          Operations
          <span className="ml-2 text-sm text-text-tertiary">
            ({operations.length})
          </span>
        </h2>
      </div>

      <ScrollArea 
        className="flex-1 p-4"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div 
          className="space-y-3"
          style={{
            height: virtualHeight,
            position: 'relative',
          }}
        >
          <div
            style={{
              transform: `translateY(${virtualOffset}px)`,
            }}
          >
            {visibleOperations.map((operation, index) => {
              const actualIndex = isVirtualized 
                ? visibleRange.start + index 
                : index

              return (
                <OperationCard
                  key={operation.id}
                  operation={operation}
                  index={actualIndex}
                  isSelected={selectedOperationId === operation.id}
                  onEdit={onOperationEdit}
                  onDelete={onOperationDelete}
                  onSelect={onOperationSelect}
                  className="mb-3"
                />
              )
            })}
          </div>
        </div>

        {operations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 rounded-lg bg-bg-tertiary/30">
              <p className="text-text-secondary">No operations yet</p>
              <p className="text-sm text-text-tertiary mt-2">
                Click the + button to add your first operation
              </p>
            </div>
          </div>
        )}
      </ScrollArea>

      {isVirtualized && (
        <div className="px-4 py-2 border-t border-primary-neon/10">
          <p className="text-xs text-text-tertiary text-center">
            Virtualized list - Showing {visibleRange.start + 1} to {visibleRange.end} of {operations.length}
          </p>
        </div>
      )}
    </div>
  )
}

export { OperationsList }