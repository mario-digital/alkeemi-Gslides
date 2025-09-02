import { expect, test, describe, beforeEach } from 'bun:test'
import { renderHook, act } from '@testing-library/react'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { validateBatchUpdate } from '@/lib/validation/batch-update-validator'

describe('Validation Flow', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBatchUpdateStore())
    act(() => {
      result.current.clearOperations()
    })
  })

  test('setValidationErrors updates store correctly', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    const errors = {
      'op1': ['Error 1', 'Error 2'],
      'op2': ['Error 3']
    }
    
    act(() => {
      result.current.setValidationErrors(errors)
    })

    expect(result.current.validationErrors).toEqual(errors)
  })

  test('setGlobalValidationState updates correctly', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.setGlobalValidationState('invalid')
    })
    expect(result.current.globalValidationState).toBe('invalid')
    
    act(() => {
      result.current.setGlobalValidationState('warning')
    })
    expect(result.current.globalValidationState).toBe('warning')
    
    act(() => {
      result.current.setGlobalValidationState('valid')
    })
    expect(result.current.globalValidationState).toBe('valid')
  })

  test('clearOperations resets validation state', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.setValidationErrors({ 'test': ['error'] })
      result.current.setGlobalValidationState('invalid')
      result.current.addOperation({
        createShape: {
          objectId: 'test',
          shapeType: 'RECTANGLE'
        }
      })
    })
    
    act(() => {
      result.current.clearOperations()
    })

    expect(result.current.operations).toHaveLength(0)
    expect(result.current.validationErrors).toEqual({})
    expect(result.current.globalValidationState).toBe('valid')
  })

  test('validates operations and updates global state', () => {
    const operations = [
      {
        createShape: {
          objectId: 'shape1',
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: 'p1',
            size: {
              width: { magnitude: 100, unit: 'PT' },
              height: { magnitude: 100, unit: 'PT' }
            }
          }
        }
      }
    ]
    
    const validation = validateBatchUpdate(operations)
    
    expect(validation.isValid).toBe(true)
    expect(validation.errors).toHaveLength(0)
    
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.importOperations(operations)
      
      if (validation.errors.length > 0) {
        result.current.setGlobalValidationState('invalid')
      } else if (validation.warnings.length > 0) {
        result.current.setGlobalValidationState('warning')
      } else {
        result.current.setGlobalValidationState('valid')
      }
    })
    
    expect(result.current.globalValidationState).toBe('valid')
  })
})