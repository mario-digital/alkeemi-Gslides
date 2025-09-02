'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NeonColorPicker } from '@/components/ui/neon-color-picker'
import { AutoCompleteField } from '../modals/AutoCompleteField'
import { BatchUpdateRequest, BatchUpdateOperation } from '@/types/batch-update'

interface UpdateElementFormProps {
  operation?: BatchUpdateRequest
  onSave: (operation: BatchUpdateRequest) => void
  onCancel: () => void
}

export function UpdateElementForm({ operation, onSave, onCancel }: UpdateElementFormProps) {
  // Extract element data from the operation prop
  const getInitialData = () => {
    if (!operation) {
      return { objectId: '', shapeType: '', text: '' }
    }
    const opType = Object.keys(operation)[0]
    const opData = (operation as any)[opType]
    return {
      objectId: opData?.objectId || '',
      shapeType: opData?.shapeType || '',
      text: opData?.text || ''
    }
  }
  
  const initialData = getInitialData()
  const [objectId, setObjectId] = useState(initialData.objectId)
  const [updateType, setUpdateType] = useState('updateShapeProperties')
  const [fields, setFields] = useState<string[]>(['shapeBackgroundFill'])
  const [backgroundColor, setBackgroundColor] = useState('#00ffff')
  const [borderColor, setBorderColor] = useState('#ffffff')
  const [borderWeight, setBorderWeight] = useState(1)
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = (): boolean => {
    const errors: string[] = []
    
    if (!objectId) errors.push('Object ID is required')
    if (fields.length === 0) errors.push('At least one field must be selected for update')
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleFieldToggle = (field: string) => {
    setFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    let newOperation: BatchUpdateOperation = {} as BatchUpdateOperation
    
    if (updateType === 'updateShapeProperties') {
      const shapeProperties: Record<string, unknown> = {}
      
      if (fields.includes('shapeBackgroundFill')) {
        const rgb = hexToRgb(backgroundColor)
        shapeProperties.shapeBackgroundFill = {
          solidFill: {
            color: {
              rgbColor: {
                red: rgb.r / 255,
                green: rgb.g / 255,
                blue: rgb.b / 255
              }
            }
          }
        }
      }
      
      if (fields.includes('outline')) {
        const rgb = hexToRgb(borderColor)
        shapeProperties.outline = {
          outlineFill: {
            solidFill: {
              color: {
                rgbColor: {
                  red: rgb.r / 255,
                  green: rgb.g / 255,
                  blue: rgb.b / 255
                }
              }
            }
          },
          weight: {
            magnitude: borderWeight,
            unit: 'PT'
          }
        }
      }
      
      newOperation = {
        updateShapeProperties: {
          objectId,
          fields: fields.join(','),
          shapeProperties
        }
      }
    } else if (updateType === 'updateTextStyle') {
      const textStyle: Record<string, unknown> = {}
      
      if (fields.includes('fontSize')) {
        textStyle.fontSize = {
          magnitude: fontSize,
          unit: 'PT'
        }
      }
      
      if (fields.includes('fontFamily')) {
        textStyle.fontFamily = fontFamily
      }
      
      if (fields.includes('bold')) {
        textStyle.bold = bold
      }
      
      if (fields.includes('italic')) {
        textStyle.italic = italic
      }
      
      newOperation = {
        updateTextStyle: {
          objectId,
          fields: fields.join(','),
          style: textStyle
        }
      }
    }
    
    onSave(newOperation)
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
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

      {/* Show selected element info */}
      {initialData.objectId && (
        <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4">
          <h4 className="text-cyan-400 font-medium mb-2">Updating Element</h4>
          <p className="text-cyan-300 text-sm">Object ID: {initialData.objectId}</p>
          {initialData.shapeType && (
            <p className="text-cyan-300 text-sm">Type: {initialData.shapeType}</p>
          )}
          {initialData.text && (
            <p className="text-cyan-300 text-sm">Text: {initialData.text}</p>
          )}
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
          placeholder={initialData.objectId || "Select an element first"}
          suggestions={['shape-1', 'text-1', 'image-1', 'line-1', 'table-1']}
          fuzzySearch
          disabled={!!initialData.objectId}
        />
      </div>

      {/* Update Type */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          Update Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setUpdateType('updateShapeProperties')}
            className={`
              flex-1 py-2 px-4 rounded-lg border transition-all
              ${updateType === 'updateShapeProperties'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
              }
            `}
          >
            Shape Properties
          </button>
          <button
            type="button"
            onClick={() => setUpdateType('updateTextStyle')}
            className={`
              flex-1 py-2 px-4 rounded-lg border transition-all
              ${updateType === 'updateTextStyle'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
              }
            `}
          >
            Text Style
          </button>
        </div>
      </div>

      {/* Fields to Update */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          Fields to Update <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {updateType === 'updateShapeProperties' ? (
            <>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.includes('shapeBackgroundFill')}
                  onChange={() => handleFieldToggle('shapeBackgroundFill')}
                  className="w-4 h-4 text-cyan-500"
                />
                <span className="text-sm text-gray-200">Background Fill</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.includes('outline')}
                  onChange={() => handleFieldToggle('outline')}
                  className="w-4 h-4 text-cyan-500"
                />
                <span className="text-sm text-gray-200">Outline</span>
              </label>
            </>
          ) : (
            <>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.includes('fontSize')}
                  onChange={() => handleFieldToggle('fontSize')}
                  className="w-4 h-4 text-cyan-500"
                />
                <span className="text-sm text-gray-200">Font Size</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.includes('fontFamily')}
                  onChange={() => handleFieldToggle('fontFamily')}
                  className="w-4 h-4 text-cyan-500"
                />
                <span className="text-sm text-gray-200">Font Family</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.includes('bold')}
                  onChange={() => handleFieldToggle('bold')}
                  className="w-4 h-4 text-cyan-500"
                />
                <span className="text-sm text-gray-200">Bold</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.includes('italic')}
                  onChange={() => handleFieldToggle('italic')}
                  className="w-4 h-4 text-cyan-500"
                />
                <span className="text-sm text-gray-200">Italic</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Property Values */}
      {updateType === 'updateShapeProperties' && (
        <>
          {fields.includes('shapeBackgroundFill') && (
            <NeonColorPicker
              value={backgroundColor}
              onChange={setBackgroundColor}
              label="Background Color"
            />
          )}
          
          {fields.includes('outline') && (
            <>
              <NeonColorPicker
                value={borderColor}
                onChange={setBorderColor}
                label="Border Color"
              />
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Border Weight (pt)
                </label>
                <Input
                  type="number"
                  value={borderWeight}
                  onChange={(e) => setBorderWeight(parseFloat(e.target.value) || 1)}
                  min={0.5}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </>
          )}
        </>
      )}

      {updateType === 'updateTextStyle' && (
        <>
          {fields.includes('fontSize') && (
            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">
                Font Size (pt)
              </label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 14)}
                min={6}
                max={400}
                className="w-full"
              />
            </div>
          )}
          
          {fields.includes('fontFamily') && (
            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">
                Font Family
              </label>
              <Input
                type="text"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                placeholder="Arial, Helvetica, Times New Roman..."
                className="w-full"
              />
            </div>
          )}
          
          {fields.includes('bold') && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={bold}
                onChange={(e) => setBold(e.target.checked)}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-sm text-gray-200">Bold Text</span>
            </label>
          )}
          
          {fields.includes('italic') && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={italic}
                onChange={(e) => setItalic(e.target.checked)}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-sm text-gray-200">Italic Text</span>
            </label>
          )}
        </>
      )}

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
          Save Changes
        </Button>
      </div>
    </form>
  )
}