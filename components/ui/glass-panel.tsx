'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const glassPanelVariants = cva(
  'rounded-glass transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-bg-secondary/80 backdrop-blur-glass border border-primary-neon/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]',
        secondary: 'bg-bg-tertiary/80 backdrop-blur-glass border border-primary-neon/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]',
        floating: 'bg-bg-secondary/90 backdrop-blur-xl border border-primary-neon/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]',
        transparent: 'bg-transparent backdrop-blur-sm border border-primary-neon/10',
      },
      state: {
        default: '',
        focus: 'border-primary-neon/50 shadow-glow',
        error: 'border-error/50 shadow-glow-error',
        success: 'border-success/50 shadow-glow-success',
      },
      size: {
        default: 'p-4',
        sm: 'p-2',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      state: 'default',
      size: 'default',
    },
  }
)

export interface GlassPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {
  asChild?: boolean
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant, state, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassPanelVariants({ variant, state, size, className }))}
        {...props}
      />
    )
  }
)
GlassPanel.displayName = 'GlassPanel'

export { GlassPanel, glassPanelVariants }