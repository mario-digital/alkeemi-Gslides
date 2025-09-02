'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SplitDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  showHandle?: boolean
  interactive?: boolean
  glowOnHover?: boolean
}

const SplitDivider = React.forwardRef<HTMLDivElement, SplitDividerProps>(
  ({ 
    className, 
    orientation = 'vertical', 
    showHandle = true,
    interactive = true,
    glowOnHover = true,
    ...props 
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    
    const isVertical = orientation === 'vertical'
    
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        data-orientation={orientation}
        className={cn(
          'relative flex items-center justify-center transition-all duration-300',
          isVertical ? 'w-px min-h-full' : 'h-px min-w-full',
          interactive && 'group',
          interactive && isVertical && 'cursor-col-resize',
          interactive && !isVertical && 'cursor-row-resize',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => interactive && setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        {...props}
      >
        {/* Divider Line */}
        <div
          className={cn(
            'absolute transition-all duration-300',
            isVertical ? 'w-px h-full' : 'h-px w-full',
            'bg-gradient-to-b from-transparent via-primary-neon to-transparent',
            isDragging && 'via-primary-neon',
            isHovered && glowOnHover && 'shadow-glow',
            !isDragging && !isHovered && 'opacity-50'
          )}
        />
        
        {/* Interactive Area */}
        {interactive && (
          <div
            className={cn(
              'absolute',
              isVertical ? 'w-5 h-full -left-2.5' : 'h-5 w-full -top-2.5',
              'hover:bg-primary-neon/5'
            )}
          />
        )}
        
        {/* Handle */}
        {showHandle && (
          <div
            className={cn(
              'absolute flex items-center justify-center transition-all duration-300',
              isVertical ? 'w-4 h-8' : 'w-8 h-4',
              'bg-bg-secondary/90 border border-primary-neon/30 rounded-md',
              'backdrop-blur-sm',
              isHovered && 'border-primary-neon/50 shadow-glow scale-110',
              isDragging && 'border-primary-neon shadow-glow-lg scale-125'
            )}
          >
            <div
              className={cn(
                'flex gap-0.5',
                isVertical ? 'flex-row' : 'flex-col'
              )}
            >
              <div className="w-0.5 h-0.5 bg-primary-neon rounded-full" />
              <div className="w-0.5 h-0.5 bg-primary-neon rounded-full" />
              <div className="w-0.5 h-0.5 bg-primary-neon rounded-full" />
            </div>
          </div>
        )}
      </div>
    )
  }
)
SplitDivider.displayName = 'SplitDivider'

export { SplitDivider }