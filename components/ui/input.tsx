'use client'

import * as React from "react"
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md px-3 py-2 text-sm transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'bg-bg-tertiary/60 border border-border-glow/30 text-text-primary hover:border-border-glow/50 focus:border-primary-neon focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]',
        code: 'bg-bg-tertiary/60 border border-border-glow/30 text-text-primary font-mono text-code hover:border-border-glow/50 focus:border-primary-neon focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]',
        number: 'bg-bg-tertiary/60 border border-border-glow/30 text-text-primary hover:border-border-glow/50 focus:border-primary-neon focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]',
        search: 'bg-bg-tertiary/60 border border-border-glow/30 text-text-primary pl-10 hover:border-border-glow/50 focus:border-primary-neon focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]',
        glass: 'bg-bg-secondary/40 backdrop-blur-sm border border-primary-neon/20 text-text-primary hover:bg-bg-secondary/60 focus:border-primary-neon/50 focus:shadow-glow',
      },
      state: {
        default: '',
        error: 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
        success: 'border-success focus:border-success focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]',
      },
      size: {
        default: 'h-10',
        sm: 'h-9 text-xs',
        lg: 'h-11 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, state, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: variant || (type === 'number' ? 'number' : variant), state, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }