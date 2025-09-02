'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AutoCompleteField } from '../modals/AutoCompleteField'
import { CoordinatePicker } from '../modals/CoordinatePicker'
import { BatchUpdateOperation } from '@/types/batch-update'

interface TransformElementFormProps {
  operation?: BatchUpdateOperation
  onSave: (operation: BatchUpdateOperation) => void
  onCancel: () => void
}

export function TransformElementForm({ operation, onSave, onCancel }: TransformElementFormProps) {
  const existingTransform = operation ? 'updatePageElementTransform' in operation ? (operation as {updatePageElementTransform: unknown}).updatePageElementTransform : undefined : undefined
  
  const [objectId, setObjectId] = useState(existingTransform?.objectId || '')
  const [applyMode, setApplyMode] = useState(existingTransform?.applyMode || 'RELATIVE')
  const [position, setPosition] = useState({ 
    x: existingTransform?.transform?.translateX || 0, 
    y: existingTransform?.transform?.translateY || 0 
  })
  const [rotation, setRotation] = useState(existingTransform?.transform?.rotation || 0)
  const [scaleX, setScaleX] = useState(existingTransform?.transform?.scaleX || 1)
  const [scaleY, setScaleY] = useState(existingTransform?.transform?.scaleY || 1)
  const [skewX, setSkewX] = useState(existingTransform?.transform?.skewX || 0)
  const [skewY, setSkewY] = useState(existingTransform?.transform?.skewY || 0)
  const [transformType, setTransformType] = useState('position')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = (): boolean => {
    const errors: string[] = []
    
    if (!objectId) {
      errors.push('Object ID is required')
    }
    
    if (scaleX <= 0 || scaleY <= 0) {
      errors.push('Scale values must be greater than 0')
    }
    
    if (rotation < -360 || rotation > 360) {
      errors.push('Rotation must be between -360 and 360 degrees')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const transform: Record<string, unknown> = {
      unit: 'EMU'
    }
    
    // Always include position
    transform.translateX = position.x
    transform.translateY = position.y
    
    // Include scale if changed
    if (scaleX !== 1 || scaleY !== 1) {
      transform.scaleX = scaleX
      transform.scaleY = scaleY
    }
    
    // Include rotation if set
    if (rotation !== 0) {
      // Convert degrees to radians for API
      transform.rotation = rotation * (Math.PI / 180)
    }
    
    // Include skew if set
    if (skewX !== 0) {
      transform.skewX = skewX
    }
    if (skewY !== 0) {
      transform.skewY = skewY
    }
    
    const newOperation: BatchUpdateOperation = {
      updatePageElementTransform: {
        objectId,
        applyMode,
        transform
      }
    }
    
    onSave(newOperation)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">Validation Errors</h4>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-300 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Object ID */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          Object ID <span className="text-red-400">*</span>
        </label>
        <AutoCompleteField
          value={objectId}
          onChange={setObjectId}
          placeholder="shape-1"
          suggestions={['shape-1', 'text-1', 'image-1', 'line-1', 'table-1']}
          fuzzySearch
        />
      </div>

      {/* Apply Mode */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          Apply Mode
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setApplyMode('RELATIVE')}
            className={`
              flex-1 py-2 px-4 rounded-lg border transition-all
              ${applyMode === 'RELATIVE'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
              }
            `}
          >
            Relative
          </button>
          <button
            type="button"
            onClick={() => setApplyMode('ABSOLUTE')}
            className={`
              flex-1 py-2 px-4 rounded-lg border transition-all
              ${applyMode === 'ABSOLUTE'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
              }
            `}
          >
            Absolute
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {applyMode === 'RELATIVE' 
            ? 'Transform will be applied relative to current position/size'
            : 'Transform will set absolute position/size values'
          }
        </p>
      </div>

      {/* Transform Type Tabs */}
      <div>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTransformType('position')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${transformType === 'position'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                : 'bg-white/5 text-gray-400 border border-white/20 hover:border-white/40'
              }
            `}
          >
            Position
          </button>
          <button
            type="button"
            onClick={() => setTransformType('scale')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${transformType === 'scale'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                : 'bg-white/5 text-gray-400 border border-white/20 hover:border-white/40'
              }
            `}
          >
            Scale
          </button>
          <button
            type="button"
            onClick={() => setTransformType('rotation')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${transformType === 'rotation'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                : 'bg-white/5 text-gray-400 border border-white/20 hover:border-white/40'
              }
            `}
          >
            Rotation
          </button>
          <button
            type="button"
            onClick={() => setTransformType('skew')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${transformType === 'skew'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                : 'bg-white/5 text-gray-400 border border-white/20 hover:border-white/40'
              }
            `}
          >
            Skew
          </button>
        </div>

        {/* Position Controls */}
        {transformType === 'position' && (
          <CoordinatePicker
            value={position}
            onChange={setPosition}
            label="Position"
            snapToGrid
          />
        )}

        {/* Scale Controls */}
        {transformType === 'scale' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Scale X
                </label>
                <Input
                  type="number"
                  value={scaleX}
                  onChange={(e) => setScaleX(parseFloat(e.target.value) || 1)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Scale Y
                </label>
                <Input
                  type="number"
                  value={scaleY}
                  onChange={(e) => setScaleY(parseFloat(e.target.value) || 1)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              1.0 = 100% (original size), 2.0 = 200% (double size), 0.5 = 50% (half size)
            </p>
          </div>
        )}

        {/* Rotation Controls */}
        {transformType === 'rotation' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">
                Rotation (degrees)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={rotation}
                  onChange={(e) => setRotation(parseFloat(e.target.value) || 0)}
                  min={-360}
                  max={360}
                  step={1}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation(r => Math.max(-360, r - 45))}
                    className="p-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
                    aria-label="Rotate 45° counter-clockwise"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4v5h5M6 17l3-3m0 0l3-3m-3 3H4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation(r => Math.min(360, r + 45))}
                    className="p-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
                    aria-label="Rotate 45° clockwise"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 4v5h-5M18 17l-3-3m0 0l-3-3m3 3h5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick rotation buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRotation(0)}
                className="px-3 py-1 text-xs rounded bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
              >
                0°
              </button>
              <button
                type="button"
                onClick={() => setRotation(45)}
                className="px-3 py-1 text-xs rounded bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
              >
                45°
              </button>
              <button
                type="button"
                onClick={() => setRotation(90)}
                className="px-3 py-1 text-xs rounded bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
              >
                90°
              </button>
              <button
                type="button"
                onClick={() => setRotation(180)}
                className="px-3 py-1 text-xs rounded bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
              >
                180°
              </button>
              <button
                type="button"
                onClick={() => setRotation(270)}
                className="px-3 py-1 text-xs rounded bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
              >
                270°
              </button>
            </div>
          </div>
        )}

        {/* Skew Controls */}
        {transformType === 'skew' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Skew X (degrees)
                </label>
                <Input
                  type="number"
                  value={skewX}
                  onChange={(e) => setSkewX(parseFloat(e.target.value) || 0)}
                  min={-45}
                  max={45}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Skew Y (degrees)
                </label>
                <Input
                  type="number"
                  value={skewY}
                  onChange={(e) => setSkewY(parseFloat(e.target.value) || 0)}
                  min={-45}
                  max={45}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Skew transforms slant the element. Positive X skews right, positive Y skews down.
            </p>
          </div>
        )}
      </div>

      {/* Transform Preview */}
      <div className="bg-white/5 border border-white/20 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-200 mb-3">Transform Summary</h5>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Position:</span>
            <span className="font-mono text-cyan-400">({position.x}, {position.y})</span>
          </div>
          {(scaleX !== 1 || scaleY !== 1) && (
            <div className="flex justify-between">
              <span className="text-gray-400">Scale:</span>
              <span className="font-mono text-cyan-400">{scaleX}x, {scaleY}y</span>
            </div>
          )}
          {rotation !== 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Rotation:</span>
              <span className="font-mono text-cyan-400">{rotation}°</span>
            </div>
          )}
          {(skewX !== 0 || skewY !== 0) && (
            <div className="flex justify-between">
              <span className="text-gray-400">Skew:</span>
              <span className="font-mono text-cyan-400">{skewX}°x, {skewY}°y</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
        >
          Apply Transform
        </Button>
      </div>
    </form>
  )
}