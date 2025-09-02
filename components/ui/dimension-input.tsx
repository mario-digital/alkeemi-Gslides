'use client'

import React, { useState } from 'react'
import { Input } from './input'

interface DimensionInputProps {
  value: { width: number; height: number }
  onChange: (dimensions: { width: number; height: number }) => void
  label?: string
  linked?: boolean
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
}

export function DimensionInput({
  value,
  onChange,
  label = 'Dimensions',
  linked: initialLinked = false,
  min = 0,
  max = 10058400, // Max slide width in EMUs
  step = 12700, // 1 point in EMUs
  unit = 'EMU',
  className = ''
}: DimensionInputProps) {
  const [linked, setLinked] = useState(initialLinked)
  const [aspectRatio, setAspectRatio] = useState(
    value.height > 0 ? value.width / value.height : 1
  )

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0
    const clampedWidth = Math.max(min, Math.min(max, newWidth))
    
    if (linked && value.height > 0) {
      const newHeight = Math.round(clampedWidth / aspectRatio)
      onChange({ width: clampedWidth, height: newHeight })
    } else {
      onChange({ width: clampedWidth, height: value.height })
      if (value.height > 0) {
        setAspectRatio(clampedWidth / value.height)
      }
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0
    const clampedHeight = Math.max(min, Math.min(max, newHeight))
    
    if (linked && clampedHeight > 0) {
      const newWidth = Math.round(clampedHeight * aspectRatio)
      onChange({ width: newWidth, height: clampedHeight })
    } else {
      onChange({ width: value.width, height: clampedHeight })
      if (clampedHeight > 0) {
        setAspectRatio(value.width / clampedHeight)
      }
    }
  }

  const handleIncrement = (dimension: 'width' | 'height', direction: 1 | -1) => {
    const currentValue = value[dimension]
    const newValue = Math.max(min, Math.min(max, currentValue + (step * direction)))
    
    if (dimension === 'width') {
      handleWidthChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>)
    } else {
      handleHeightChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const toggleLinked = () => {
    const newLinked = !linked
    setLinked(newLinked)
    
    if (newLinked && value.width > 0 && value.height > 0) {
      setAspectRatio(value.width / value.height)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-200 block">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        {/* Width Input */}
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Width</label>
          <div className="relative flex items-center">
            <button
              onClick={() => handleIncrement('width', -1)}
              className="absolute left-2 p-1 hover:bg-white/10 rounded transition-colors z-10"
              aria-label="Decrease width"
            >
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <Input
              type="number"
              value={value.width}
              onChange={handleWidthChange}
              className="px-8 text-center font-mono"
              min={min}
              max={max}
              step={step}
            />
            
            <button
              onClick={() => handleIncrement('width', 1)}
              className="absolute right-2 p-1 hover:bg-white/10 rounded transition-colors z-10"
              aria-label="Increase width"
            >
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Link Button */}
        <button
          onClick={toggleLinked}
          className={`
            mt-6 p-2 rounded-lg border transition-all
            ${linked ? 
              'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 
              'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
            }
          `}
          aria-label={linked ? 'Unlink dimensions' : 'Link dimensions'}
          title={linked ? 'Dimensions are linked' : 'Click to link dimensions'}
        >
          {linked ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
              />
            </svg>
          )}
        </button>

        {/* Height Input */}
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Height</label>
          <div className="relative flex items-center">
            <button
              onClick={() => handleIncrement('height', -1)}
              className="absolute left-2 p-1 hover:bg-white/10 rounded transition-colors z-10"
              aria-label="Decrease height"
            >
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <Input
              type="number"
              value={value.height}
              onChange={handleHeightChange}
              className="px-8 text-center font-mono"
              min={min}
              max={max}
              step={step}
            />
            
            <button
              onClick={() => handleIncrement('height', 1)}
              className="absolute right-2 p-1 hover:bg-white/10 rounded transition-colors z-10"
              aria-label="Increase height"
            >
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Helper Text */}
      <p className="text-xs text-gray-400">
        {unit} • Step: {step} {unit === 'EMU' && `(${(step / 12700).toFixed(1)} pt)`}
        {linked && ' • Aspect ratio locked'}
      </p>
    </div>
  )
}