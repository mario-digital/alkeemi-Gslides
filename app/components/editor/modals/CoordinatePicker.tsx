'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { GlassPanel } from '@/components/ui/glass-panel'
import { Input } from '@/components/ui/input'

interface CoordinatePickerProps {
  value?: { x: number; y: number }
  onChange: (coords: { x: number; y: number }) => void
  label?: string
  snapToGrid?: boolean
  gridSize?: number
  className?: string
}

const SLIDE_WIDTH_EMU = 10058400
const SLIDE_HEIGHT_EMU = 5669300
const DISPLAY_WIDTH = 400
const DISPLAY_HEIGHT = 225

export function CoordinatePicker({
  value = { x: 0, y: 0 },
  onChange,
  label = 'Position',
  snapToGrid = true,
  gridSize = 914400, // 1 inch in EMUs
  className = ''
}: CoordinatePickerProps) {
  const [coordinates, setCoordinates] = useState(value)
  const [isSelecting, setIsSelecting] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCoordinates(value)
  }, [value])

  const emuToPixel = (emu: number, isWidth: boolean) => {
    const slideSize = isWidth ? SLIDE_WIDTH_EMU : SLIDE_HEIGHT_EMU
    const displaySize = isWidth ? DISPLAY_WIDTH : DISPLAY_HEIGHT
    return Math.round((emu / slideSize) * displaySize)
  }

  const pixelToEmu = (pixel: number, isWidth: boolean) => {
    const slideSize = isWidth ? SLIDE_WIDTH_EMU : SLIDE_HEIGHT_EMU
    const displaySize = isWidth ? DISPLAY_WIDTH : DISPLAY_HEIGHT
    let emu = Math.round((pixel / displaySize) * slideSize)
    
    if (snapToGrid) {
      emu = Math.round(emu / gridSize) * gridSize
    }
    
    return Math.max(0, Math.min(emu, slideSize))
  }

  const handleGridClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return
    
    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newCoords = {
      x: pixelToEmu(x, true),
      y: pixelToEmu(y, false)
    }
    
    setCoordinates(newCoords)
    onChange(newCoords)
  }, [onChange, snapToGrid, gridSize])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !gridRef.current) return
    
    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, DISPLAY_WIDTH))
    const y = Math.max(0, Math.min(e.clientY - rect.top, DISPLAY_HEIGHT))
    
    const newCoords = {
      x: pixelToEmu(x, true),
      y: pixelToEmu(y, false)
    }
    
    setCoordinates(newCoords)
  }, [isSelecting, snapToGrid, gridSize])

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false)
      onChange(coordinates)
    }
  }, [isSelecting, coordinates, onChange])

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isSelecting, handleMouseMove, handleMouseUp])

  const handleInputChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseInt(value) || 0
    const newCoords = {
      ...coordinates,
      [axis]: Math.max(0, Math.min(numValue, axis === 'x' ? SLIDE_WIDTH_EMU : SLIDE_HEIGHT_EMU))
    }
    setCoordinates(newCoords)
    onChange(newCoords)
  }

  const gridLines = snapToGrid ? Math.floor(SLIDE_WIDTH_EMU / gridSize) : 0

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="text-sm font-medium text-gray-200">{label}</label>
      
      {/* Visual Grid */}
      <GlassPanel className="p-4">
        <div 
          ref={gridRef}
          className="relative cursor-crosshair border border-white/20 bg-black/20"
          style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}
          onClick={handleGridClick}
          onMouseDown={(e) => {
            setIsSelecting(true)
            handleGridClick(e)
          }}
        >
          {/* Grid Lines */}
          {snapToGrid && (
            <>
              {Array.from({ length: gridLines }).map((_, i) => {
                const x = ((i + 1) * gridSize / SLIDE_WIDTH_EMU) * DISPLAY_WIDTH
                return (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-white/10"
                    style={{ left: `${x}px` }}
                  />
                )
              })}
              {Array.from({ length: Math.floor(SLIDE_HEIGHT_EMU / gridSize) }).map((_, i) => {
                const y = ((i + 1) * gridSize / SLIDE_HEIGHT_EMU) * DISPLAY_HEIGHT
                return (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-white/10"
                    style={{ top: `${y}px` }}
                  />
                )
              })}
            </>
          )}
          
          {/* Position Marker */}
          <div
            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-cyan-500 border-2 border-white shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            style={{
              left: `${emuToPixel(coordinates.x, true)}px`,
              top: `${emuToPixel(coordinates.y, false)}px`,
              transition: isSelecting ? 'none' : 'all 150ms ease'
            }}
          />
          
          {/* Coordinate Display */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-cyan-400 font-mono">
            {coordinates.x}, {coordinates.y}
          </div>
        </div>
      </GlassPanel>
      
      {/* Manual Input Fields */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">X (EMU)</label>
          <Input
            type="number"
            value={coordinates.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            className="font-mono"
            min={0}
            max={SLIDE_WIDTH_EMU}
            step={snapToGrid ? gridSize : 1}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Y (EMU)</label>
          <Input
            type="number"
            value={coordinates.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            className="font-mono"
            min={0}
            max={SLIDE_HEIGHT_EMU}
            step={snapToGrid ? gridSize : 1}
          />
        </div>
      </div>
      
      {/* Helper Text */}
      <p className="text-xs text-gray-400">
        Slide dimensions: {SLIDE_WIDTH_EMU} × {SLIDE_HEIGHT_EMU} EMUs
        {snapToGrid && ` • Snap: ${gridSize} EMUs (${gridSize / 914400}" grid)`}
      </p>
    </div>
  )
}