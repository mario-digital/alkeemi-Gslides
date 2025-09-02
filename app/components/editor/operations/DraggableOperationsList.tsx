'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { GlassPanel } from '@/components/ui/glass-panel'
import { OperationCard, type OperationData } from './OperationCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableOperationCardProps {
  operation: OperationData
  index: number
  onEdit?: (operation: OperationData) => void
  onDelete?: (id: string) => void
}

const SortableOperationCard: React.FC<SortableOperationCardProps> = ({
  operation,
  index,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: operation.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <OperationCard
        operation={operation}
        index={index}
        isDragging={isDragging}
        isDragOver={isOver}
        onEdit={onEdit}
        onDelete={onDelete}
        className={cn(
          isDragging && 'opacity-50',
          isOver && 'ring-2 ring-[#06ffa5] ring-offset-2 ring-offset-bg-primary'
        )}
      />
    </div>
  )
}

interface DraggableOperationsListProps {
  operations: OperationData[]
  className?: string
  onOperationEdit?: (operation: OperationData) => void
  onOperationDelete?: (id: string) => void
  onReorder?: (operations: OperationData[]) => void
}

const DraggableOperationsList: React.FC<DraggableOperationsListProps> = ({
  operations,
  className,
  onOperationEdit,
  onOperationDelete,
  onReorder,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [overId, setOverId] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = operations.findIndex(op => op.id === active.id)
      const newIndex = operations.findIndex(op => op.id === over?.id)
      
      const newOperations = arrayMove(operations, oldIndex, newIndex)
      onReorder?.(newOperations)
    }

    setActiveId(null)
    setOverId(null)
  }

  const activeOperation = activeId 
    ? operations.find(op => op.id === activeId)
    : null

  return (
    <GlassPanel
      variant="primary"
      className={cn(
        'flex flex-col h-full overflow-hidden',
        'bg-bg-secondary/60',
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
        ref={containerRef}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={operations.map(op => op.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {operations.map((operation, index) => (
                <SortableOperationCard
                  key={operation.id}
                  operation={operation}
                  index={index}
                  onEdit={onOperationEdit}
                  onDelete={onOperationDelete}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeOperation ? (
              <div className="relative">
                <OperationCard
                  operation={activeOperation}
                  index={0}
                  className="shadow-2xl shadow-primary-neon/50"
                />
                <div 
                  className="absolute inset-0 -z-10 blur-xl"
                  style={{
                    background: `radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)`,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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

      {overId && (
        <div 
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#06ffa5] to-transparent opacity-50"
          style={{
            animation: 'glow 1s ease-in-out infinite alternate',
          }}
        />
      )}
    </GlassPanel>
  )
}

export { DraggableOperationsList }