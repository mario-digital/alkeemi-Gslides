'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  FileText, 
  Edit2, 
  Trash2, 
  Move, 
  Type 
} from 'lucide-react'

export type OperationType = 'create' | 'update' | 'delete' | 'transform' | 'text'

interface FloatingAddButtonProps {
  className?: string
  onAddOperation?: (type: OperationType) => void
}

const operationTypes = [
  {
    type: 'create' as const,
    label: 'Create Element',
    icon: FileText,
    color: 'hover:text-[#06ffa5] hover:bg-[#06ffa5]/10',
  },
  {
    type: 'update' as const,
    label: 'Update Element',
    icon: Edit2,
    color: 'hover:text-[#22d3ee] hover:bg-[#22d3ee]/10',
  },
  {
    type: 'delete' as const,
    label: 'Delete Element',
    icon: Trash2,
    color: 'hover:text-[#ec4899] hover:bg-[#ec4899]/10',
  },
  {
    type: 'transform' as const,
    label: 'Transform Element',
    icon: Move,
    color: 'hover:text-[#a855f7] hover:bg-[#a855f7]/10',
  },
  {
    type: 'text' as const,
    label: 'Text Operation',
    icon: Type,
    color: 'hover:text-[#fbbf24] hover:bg-[#fbbf24]/10',
  },
]

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  className,
  onAddOperation,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'group relative p-4 rounded-full',
              'bg-gradient-to-r from-primary-neon to-accent-cyan',
              'shadow-lg shadow-primary-neon/30',
              'transition-all duration-300',
              'hover:scale-110 hover:shadow-xl hover:shadow-primary-neon/50',
              'active:scale-95',
              'before:absolute before:inset-0 before:rounded-full',
              'before:bg-gradient-to-r before:from-primary-neon before:to-accent-cyan',
              'before:blur-xl before:opacity-50',
              'before:animate-pulse',
            )}
          >
            <Plus 
              className={cn(
                'w-6 h-6 text-white relative z-10',
                'transition-transform duration-300',
                isOpen && 'rotate-45'
              )} 
            />
            <span className="sr-only">Add Operation</span>
            
            <div 
              className={cn(
                'absolute inset-0 rounded-full',
                'bg-gradient-to-r from-primary-neon to-accent-cyan',
                'animate-ping opacity-30'
              )}
            />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          sideOffset={8}
          className={cn(
            'w-56 p-2',
            'bg-bg-secondary/95 backdrop-blur-xl',
            'border border-primary-neon/20',
            'shadow-2xl shadow-primary-neon/20'
          )}
        >
          {operationTypes.map(({ type, label, icon: Icon, color }) => (
            <DropdownMenuItem
              key={type}
              onClick={() => onAddOperation?.(type)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                'transition-all duration-200',
                'cursor-pointer',
                color
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { FloatingAddButton }