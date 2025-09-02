'use client'

import React, { useState } from 'react'
import { GlassPanel } from './glass-panel'

interface NeonColorPickerProps {
  value?: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

const NEON_PALETTE = [
  { name: 'Cyan', value: '#00ffff', rgb: { r: 0, g: 255, b: 255 } },
  { name: 'Magenta', value: '#ff00ff', rgb: { r: 255, g: 0, b: 255 } },
  { name: 'Yellow', value: '#ffff00', rgb: { r: 255, g: 255, b: 0 } },
  { name: 'Electric Blue', value: '#0080ff', rgb: { r: 0, g: 128, b: 255 } },
  { name: 'Hot Pink', value: '#ff0080', rgb: { r: 255, g: 0, b: 128 } },
  { name: 'Lime', value: '#80ff00', rgb: { r: 128, g: 255, b: 0 } },
  { name: 'Orange', value: '#ff8000', rgb: { r: 255, g: 128, b: 0 } },
  { name: 'Purple', value: '#8000ff', rgb: { r: 128, g: 0, b: 255 } },
  { name: 'Red', value: '#ff0000', rgb: { r: 255, g: 0, b: 0 } },
  { name: 'Green', value: '#00ff00', rgb: { r: 0, g: 255, b: 0 } },
  { name: 'Blue', value: '#0000ff', rgb: { r: 0, g: 0, b: 255 } },
  { name: 'White', value: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
]

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export function NeonColorPicker({
  value = '#00ffff',
  onChange,
  label = 'Color',
  className = ''
}: NeonColorPickerProps) {
  const [customColor, setCustomColor] = useState(value)
  const [showCustom, setShowCustom] = useState(false)
  const currentRgb = hexToRgb(value)

  const handleColorSelect = (color: string, rgb: { r: number; g: number; b: number }) => {
    onChange(color)
    setCustomColor(color)
    
    // Return RGB values for Google Slides API
    if ((window as any).__colorPickerCallback) {
      (window as any).__colorPickerCallback({
        red: rgb.r / 255,
        green: rgb.g / 255,
        blue: rgb.b / 255
      })
    }
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCustomColor(newColor)
    const rgb = hexToRgb(newColor)
    handleColorSelect(newColor, rgb)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="text-sm font-medium text-gray-200 block">{label}</label>
      
      <GlassPanel className="p-4">
        {/* Current Color Display */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-lg border-2 border-white/20"
            style={{
              backgroundColor: value,
              boxShadow: `0 0 30px ${value}40, inset 0 0 20px ${value}60`
            }}
          />
          <div className="flex-1">
            <div className="font-mono text-sm text-gray-300">{value.toUpperCase()}</div>
            <div className="text-xs text-gray-400">
              RGB({currentRgb.r}, {currentRgb.g}, {currentRgb.b})
            </div>
          </div>
        </div>

        {/* Preset Palette */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {NEON_PALETTE.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value, color.rgb)}
              className={`
                relative w-full aspect-square rounded-lg border-2 transition-all
                ${value === color.value ? 
                  'border-white scale-110' : 
                  'border-white/20 hover:border-white/60 hover:scale-105'
                }
              `}
              style={{
                backgroundColor: color.value,
                boxShadow: value === color.value ? 
                  `0 0 20px ${color.value}80` : 
                  `0 0 10px ${color.value}40`
              }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            >
              {value === color.value && (
                <svg 
                  className="absolute inset-0 m-auto w-6 h-6 text-black mix-blend-difference"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Custom Color */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {showCustom ? 'Hide' : 'Show'} Custom Color
          </button>
          
          {showCustom && (
            <div className="mt-3 flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-12 rounded cursor-pointer bg-transparent"
                aria-label="Custom color picker"
              />
              <input
                type="text"
                value={customColor.toUpperCase()}
                onChange={(e) => {
                  const newValue = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                    setCustomColor(newValue)
                    if (newValue.length === 7) {
                      const rgb = hexToRgb(newValue)
                      handleColorSelect(newValue, rgb)
                    }
                  }
                }}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg font-mono text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}