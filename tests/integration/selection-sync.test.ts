import { expect, test, describe, beforeEach } from 'bun:test'
import { renderHook, act } from '@testing-library/react'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'

describe('Selection Synchronization', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBatchUpdateStore())
    act(() => {
      result.current.clearOperations()
    })
  })

  test('syncSelection from operation updates both IDs', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.syncSelection('operation', 'test-id')
    })

    expect(result.current.selectedOperationId).toBe('test-id')
    expect(result.current.selectedElementId).toBe('test-id')
  })

  test('syncSelection from element updates both IDs', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.syncSelection('element', 'element-id')
    })

    expect(result.current.selectedOperationId).toBe('element-id')
    expect(result.current.selectedElementId).toBe('element-id')
  })

  test('syncSelection with null clears both selections', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.syncSelection('operation', 'test-id')
    })
    
    act(() => {
      result.current.syncSelection('operation', null)
    })

    expect(result.current.selectedOperationId).toBeNull()
    expect(result.current.selectedElementId).toBeNull()
  })

  test('selectByIds updates both selection IDs independently', () => {
    const { result } = renderHook(() => useBatchUpdateStore())
    
    act(() => {
      result.current.selectByIds('op-id', 'el-id')
    })

    expect(result.current.selectedOperationId).toBe('op-id')
    expect(result.current.selectedElementId).toBe('el-id')
  })
})