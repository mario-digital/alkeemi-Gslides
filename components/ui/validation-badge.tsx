'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X, Check, AlertCircle, Info } from 'lucide-react'

const validationBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-300',
  {
    variants: {
      variant: {
        success: 'bg-success/10 text-success border border-success/20 shadow-glow-success',
        warning: 'bg-warning/10 text-warning border border-warning/20 shadow-glow-warning',
        error: 'bg-error/10 text-error border border-error/20 shadow-glow-error',
        info: 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-glow-cyan',
      },
      state: {
        static: '',
        pulsing: 'animate-glow-pulse',
        dismissed: 'opacity-0 scale-95 pointer-events-none',
      },
      floating: {
        true: 'absolute z-10',
        false: 'relative',
      },
    },
    defaultVariants: {
      variant: 'info',
      state: 'static',
      floating: false,
    },
  }
)

const iconMap = {
  success: Check,
  warning: AlertCircle,
  error: X,
  info: Info,
}

export interface ValidationBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof validationBadgeVariants> {
  label: string
  dismissible?: boolean
  onDismiss?: () => void
  position?: { top?: string; right?: string; bottom?: string; left?: string }
}

const ValidationBadge = React.forwardRef<HTMLDivElement, ValidationBadgeProps>(
  ({ 
    className, 
    variant = 'info', 
    state, 
    floating,
    label,
    dismissible = false,
    onDismiss,
    position,
    ...props 
  }, ref) => {
    const [internalState, setInternalState] = React.useState(state)
    const Icon = iconMap[variant || 'info']
    
    React.useEffect(() => {
      setInternalState(state)
    }, [state])
    
    const handleDismiss = () => {
      setInternalState('dismissed')
      setTimeout(() => {
        onDismiss?.()
      }, 300)
    }
    
    return (
      <div
        ref={ref}
        style={floating && position ? position : undefined}
        className={cn(validationBadgeVariants({ variant, state: internalState, floating, className }))}
        {...props}
      >
        <Icon className="h-3 w-3" />
        <span>{label}</span>
        {dismissible && internalState !== 'dismissed' && (
          <button
            onClick={handleDismiss}
            className="ml-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }
)
ValidationBadge.displayName = 'ValidationBadge'

export { ValidationBadge, validationBadgeVariants }