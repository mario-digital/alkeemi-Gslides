import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon/50 focus-visible:shadow-glow disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-gradient border border-primary-neon shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 text-white",
        primary:
          "bg-primary-gradient border border-primary-neon shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 text-white",
        secondary:
          "bg-secondary-gradient border border-secondary-neon shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 text-white",
        danger:
          "bg-danger-gradient border border-error shadow-glow-error hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 text-white",
        success:
          "bg-gradient-to-br from-success to-emerald-600 border border-success shadow-glow-success hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 text-white",
        outline:
          "border border-primary-neon/30 bg-transparent hover:bg-primary-neon/10 hover:border-primary-neon/50 hover:shadow-glow text-text-primary",
        ghost:
          "hover:bg-primary-neon/10 hover:text-primary-neon",
        link:
          "text-primary-neon underline-offset-4 hover:underline hover:text-secondary-neon",
        glass:
          "bg-bg-secondary/80 backdrop-blur-glass border border-primary-neon/20 hover:bg-bg-secondary/90 hover:border-primary-neon/30 hover:shadow-glow text-text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }