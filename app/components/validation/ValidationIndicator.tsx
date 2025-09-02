'use client'

import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValidationIndicatorProps {
  errors: string[]
  className?: string
}

export function ValidationIndicator({ errors, className }: ValidationIndicatorProps) {
  if (!errors || errors.length === 0) return null

  return (
    <div className={cn(
      "flex items-start gap-2 p-2 rounded-md",
      "bg-red-500/10 border border-red-500/30",
      "animate-error-pulse",
      className
    )}>
      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex flex-col gap-1">
        {errors.map((error, index) => (
          <span key={index} className="text-xs text-red-400">
            {error}
          </span>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes error-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.8;
          }
        }
        
        .animate-error-pulse {
          animation: error-pulse 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-error-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}