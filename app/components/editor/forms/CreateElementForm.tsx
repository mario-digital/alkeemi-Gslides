'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { NeonColorPicker } from '@/components/ui/neon-color-picker'
import { DimensionInput } from '@/components/ui/dimension-input'
import { CoordinatePicker } from '../modals/CoordinatePicker'
import { AutoCompleteField } from '../modals/AutoCompleteField'
import { BatchUpdateRequest } from '@/types/batch-update'

interface CreateElementFormProps {
  operation?: BatchUpdateRequest
  onSave: (operation: BatchUpdateRequest) => void
  onCancel: () => void
}

const ELEMENT_TYPES = [
  { value: 'createShape', label: 'Shape' },
  { value: 'createTextBox', label: 'Text Box' },
  { value: 'createImage', label: 'Image' },
  { value: 'createLine', label: 'Line' },
  { value: 'createTable', label: 'Table' },
]

const SHAPE_TYPES = [
  'RECTANGLE', 'ROUND_RECTANGLE', 'ELLIPSE', 'TRIANGLE', 
  'RIGHT_TRIANGLE', 'PARALLELOGRAM', 'TRAPEZOID', 'DIAMOND',
  'PENTAGON', 'HEXAGON', 'OCTAGON', 'STAR', 'ARROW_RIGHT',
  'ARROW_LEFT', 'ARROW_UP', 'ARROW_DOWN'
]

export function CreateElementForm({ operation, onSave, onCancel }: CreateElementFormProps) {
  const [elementType, setElementType] = useState(
    operation ? Object.keys(operation)[0] : 'createShape'
  )
  const [objectId, setObjectId] = useState('')
  const [pageObjectId, setPageObjectId] = useState('')
  const [shapeType, setShapeType] = useState('RECTANGLE')
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 1828800, height: 1828800 }) // 2" x 2" default
  const [backgroundColor, setBackgroundColor] = useState('#00ffff')
  const [borderColor, setBorderColor] = useState('#ffffff')
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = (): boolean => {
    const errors: string[] = []
    
    if (!objectId) errors.push('Object ID is required')
    if (objectId && !/^[a-zA-Z0-9_-]+$/.test(objectId)) {
      errors.push('Object ID must contain only letters, numbers, hyphens, and underscores')
    }
    if (!pageObjectId) errors.push('Page Object ID is required')
    
    if (elementType === 'createTextBox' && !text) {
      errors.push('Text content is required for text boxes')
    }
    
    if (elementType === 'createImage' && !imageUrl) {
      errors.push('Image URL is required')
    }
    
    if (size.width <= 0 || size.height <= 0) {
      errors.push('Size must be greater than 0')
    }
    
    if (elementType === 'createTable') {
      if (tableRows < 1 || tableRows > 25) {
        errors.push('Table rows must be between 1 and 25')
      }
      if (tableColumns < 1 || tableColumns > 25) {
        errors.push('Table columns must be between 1 and 25')
      }
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    let newOperation: BatchUpdateRequest = {}
    
    switch (elementType) {
      case 'createShape':
        newOperation = {
          createShape: {
            objectId,
            shapeType,
            elementProperties: {
              pageObjectId,
              size: {
                width: { magnitude: size.width, unit: 'EMU' },
                height: { magnitude: size.height, unit: 'EMU' }
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: position.x,
                translateY: position.y,
                unit: 'EMU'
              }
            }
          }
        }
        break
        
      case 'createTextBox':
        newOperation = {
          createTextBox: {
            objectId,
            elementProperties: {
              pageObjectId,
              size: {
                width: { magnitude: size.width, unit: 'EMU' },
                height: { magnitude: size.height, unit: 'EMU' }
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: position.x,
                translateY: position.y,
                unit: 'EMU'
              }
            }
          }
        }
        break
        
      case 'createImage':
        newOperation = {
          createImage: {
            objectId,
            url: imageUrl,
            elementProperties: {
              pageObjectId,
              size: {
                width: { magnitude: size.width, unit: 'EMU' },
                height: { magnitude: size.height, unit: 'EMU' }
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: position.x,
                translateY: position.y,
                unit: 'EMU'
              }
            }
          }
        }
        break
        
      case 'createLine':
        newOperation = {
          createLine: {
            objectId,
            elementProperties: {
              pageObjectId,
              size: {
                width: { magnitude: size.width, unit: 'EMU' },
                height: { magnitude: size.height, unit: 'EMU' }
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: position.x,
                translateY: position.y,
                unit: 'EMU'
              }
            }
          }
        }
        break
        
      case 'createTable':
        newOperation = {
          createTable: {
            objectId,
            elementProperties: {
              pageObjectId,
              size: {
                width: { magnitude: size.width, unit: 'EMU' },
                height: { magnitude: size.height, unit: 'EMU' }
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: position.x,
                translateY: position.y,
                unit: 'EMU'
              }
            },
            rows: tableRows,
            columns: tableColumns
          }
        }
        break
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

      {/* Element Type */}
      <div>
        <label className="text-sm font-medium text-gray-200 mb-2 block">
          Element Type
        </label>
        <Select value={elementType} onValueChange={setElementType}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ELEMENT_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Object IDs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Object ID <span className="text-red-400">*</span>
          </label>
          <AutoCompleteField
            value={objectId}
            onChange={setObjectId}
            placeholder="my-shape-1"
            suggestions={['shape-1', 'text-1', 'image-1', 'line-1', 'table-1']}
            fuzzySearch
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Page Object ID <span className="text-red-400">*</span>
          </label>
          <AutoCompleteField
            value={pageObjectId}
            onChange={setPageObjectId}
            placeholder="slide-1"
            suggestions={['slide-1', 'slide-2', 'slide-3']}
            fuzzySearch
          />
        </div>
      </div>

      {/* Shape Type (for shapes only) */}
      {elementType === 'createShape' && (
        <div>
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Shape Type
          </label>
          <Select value={shapeType} onValueChange={setShapeType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHAPE_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, ' ').toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Text Content (for text boxes only) */}
      {elementType === 'createTextBox' && (
        <div>
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Text Content <span className="text-red-400">*</span>
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text content..."
            rows={3}
            className="w-full"
          />
        </div>
      )}

      {/* Image URL (for images only) */}
      {elementType === 'createImage' && (
        <div>
          <label className="text-sm font-medium text-gray-200 mb-2 block">
            Image URL <span className="text-red-400">*</span>
          </label>
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full"
          />
        </div>
      )}

      {/* Table Configuration (for tables only) */}
      {elementType === 'createTable' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Rows (1-25)
            </label>
            <Input
              type="number"
              value={tableRows}
              onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
              min={1}
              max={25}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Columns (1-25)
            </label>
            <Input
              type="number"
              value={tableColumns}
              onChange={(e) => setTableColumns(parseInt(e.target.value) || 1)}
              min={1}
              max={25}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Position */}
      <CoordinatePicker
        value={position}
        onChange={setPosition}
        label="Position"
        snapToGrid
      />

      {/* Size */}
      <DimensionInput
        value={size}
        onChange={setSize}
        label="Size"
        linked
      />

      {/* Colors (for shapes only) */}
      {elementType === 'createShape' && (
        <div className="grid grid-cols-2 gap-4">
          <NeonColorPicker
            value={backgroundColor}
            onChange={setBackgroundColor}
            label="Background Color"
          />
          <NeonColorPicker
            value={borderColor}
            onChange={setBorderColor}
            label="Border Color"
          />
        </div>
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
          Save Operation
        </Button>
      </div>
    </form>
  )
}