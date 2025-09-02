'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { GlassPanel } from '@/components/ui/glass-panel'
import { 
  FileText, 
  Edit2, 
  Trash2, 
  Move, 
  Type, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react'

const operationTypeColors = {
  create: 'text-[#06ffa5] border-[#06ffa5]/30 shadow-[0_0_20px_rgba(6,255,165,0.2)]',
  update: 'text-[#22d3ee] border-[#22d3ee]/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]',
  delete: 'text-[#ec4899] border-[#ec4899]/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  transform: 'text-[#a855f7] border-[#a855f7]/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]',
  text: 'text-[#fbbf24] border-[#fbbf24]/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]',
} as const

const operationIcons = {
  create: FileText,
  update: Edit2,
  delete: Trash2,
  transform: Move,
  text: Type,
} as const

export type OperationType = keyof typeof operationTypeColors

interface OperationData {
  id: string
  type: OperationType
  title: string
  description?: string
  objectId?: string
  pageObjectId?: string
  isValid?: boolean
  error?: string
}

const operationCardVariants = cva(
  'relative group transition-all duration-200 cursor-move',
  {
    variants: {
      state: {
        default: '',
        dragging: 'opacity-50 scale-95',
        dragOver: 'scale-105',
      },
      validation: {
        valid: '',
        invalid: 'border-red-500/50',
        warning: 'border-yellow-500/50',
      }
    },
    defaultVariants: {
      state: 'default',
      validation: 'valid',
    },
  }
)

export interface OperationCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof operationCardVariants> {
  operation: OperationData
  index: number
  isDragging?: boolean
  isDragOver?: boolean
  onEdit?: (operation: OperationData) => void
  onDelete?: (id: string) => void
}

const OperationCard = React.forwardRef<HTMLDivElement, OperationCardProps>(
  ({ 
    className, 
    operation, 
    index,
    isDragging = false,
    isDragOver = false,
    state,
    ...props 
  }, ref) => {
    const Icon = operationIcons[operation.type]
    const typeColor = operationTypeColors[operation.type]
    
    const cardState = isDragging ? 'dragging' : isDragOver ? 'dragOver' : state
    const cardValidation = operation.isValid === false ? 'invalid' : 
                           operation.error ? 'warning' : 'valid'

    return (
      <div
        ref={ref}
        className={cn(
          operationCardVariants({ state: cardState, validation: cardValidation }),
          'animate-slide-in-left',
          className
        )}
        style={{
          animationDelay: `${index * 50}ms`,
        }}
        {...props}
      >
        <GlassPanel
          variant="secondary"
          className={cn(
            'relative overflow-hidden transition-all duration-200',
            'hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
            'will-change-transform',
            typeColor
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-lg bg-bg-tertiary/50',
              'transition-all duration-200',
              'group-hover:scale-110',
              typeColor
            )}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary truncate">
                {operation.title}
              </h3>
              {operation.description && (
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {operation.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                {operation.objectId && (
                  <span className="truncate">ID: {operation.objectId}</span>
                )}
                {operation.pageObjectId && (
                  <span className="truncate">Page: {operation.pageObjectId}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {operation.isValid === false && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              {operation.isValid === true && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>

          {operation.error && (
            <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{operation.error}</p>
            </div>
          )}

          <div className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-0',
            'group-hover:opacity-10 transition-opacity duration-200',
            'pointer-events-none',
            operation.type === 'create' && 'from-[#06ffa5] to-transparent',
            operation.type === 'update' && 'from-[#22d3ee] to-transparent',
            operation.type === 'delete' && 'from-[#ec4899] to-transparent',
            operation.type === 'transform' && 'from-[#a855f7] to-transparent',
            operation.type === 'text' && 'from-[#fbbf24] to-transparent'
          )} />
        </GlassPanel>
      </div>
    )
  }
)

OperationCard.displayName = 'OperationCard'

export { OperationCard, operationCardVariants, type OperationData }