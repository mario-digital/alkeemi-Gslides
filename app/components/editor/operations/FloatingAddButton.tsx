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
    <div className={cn('fixed bottom-20 left-6 z-50', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'group relative p-3 rounded-xl',
              'bg-black/40 backdrop-blur-xl',
              'border border-cyan-500/30',
              'shadow-[0_0_30px_rgba(6,255,165,0.2)]',
              'transition-all duration-300',
              'hover:scale-110 hover:border-cyan-400/50',
              'hover:shadow-[0_0_40px_rgba(6,255,165,0.4)]',
              'active:scale-95',
              'overflow-hidden'
            )}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-purple-500/20 animate-gradient-xy" />
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/30 rounded-full blur-xl" />
            </div>
            
            <Plus 
              className={cn(
                'w-5 h-5 relative z-10',
                'text-cyan-400 group-hover:text-cyan-300',
                'transition-all duration-300',
                'drop-shadow-[0_0_8px_rgba(6,255,165,0.8)]',
                isOpen && 'rotate-45'
              )} 
            />
            <span className="sr-only">Add Operation</span>
            
            {/* Pulse ring */}
            <div 
              className={cn(
                'absolute inset-0 rounded-xl',
                'border border-cyan-500/50',
                'animate-ping opacity-30'
              )}
            />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          sideOffset={8}
          className={cn(
            'w-56 p-2',
            'bg-black/90 backdrop-blur-2xl',
            'border border-cyan-500/20',
            'shadow-[0_0_30px_rgba(6,255,165,0.2)]'
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