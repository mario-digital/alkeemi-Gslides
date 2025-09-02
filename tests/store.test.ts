import { describe, test, expect, beforeEach } from 'bun:test'
import { useBatchUpdateStore } from '../stores/batchUpdateStore'

describe('BatchUpdateStore', () => {
  beforeEach(() => {
    useBatchUpdateStore.setState({
      operations: [],
      selectedOperationIndex: null,
      presentationId: '',
    })
  })

  test('adds operations', () => {
    const store = useBatchUpdateStore.getState()
    
    store.addOperation({
      createSlide: {
        insertionIndex: 0,
      },
    })
    
    const newState = useBatchUpdateStore.getState()
    expect(newState.operations).toHaveLength(1)
    expect(newState.operations[0]).toHaveProperty('createSlide')
  })

  test('updates operations', () => {
    useBatchUpdateStore.getState().addOperation({
      createSlide: {
        insertionIndex: 0,
      },
    })
    
    useBatchUpdateStore.getState().updateOperation(0, {
      createSlide: {
        insertionIndex: 1,
        objectId: 'slide_1',
      },
    })
    
    const state = useBatchUpdateStore.getState()
    const operation = state.operations[0] as any
    expect(operation.createSlide.insertionIndex).toBe(1)
    expect(operation.createSlide.objectId).toBe('slide_1')
  })

  test('deletes operations', () => {
    const { addOperation, deleteOperation } = useBatchUpdateStore.getState()
    
    addOperation({ createSlide: {} })
    addOperation({ createShape: { shapeType: 'RECTANGLE', elementProperties: { pageObjectId: 'slide1' } } })
    addOperation({ createTable: { rows: 2, columns: 3, elementProperties: { pageObjectId: 'slide1' } } })
    
    deleteOperation(1)
    
    const state = useBatchUpdateStore.getState()
    expect(state.operations).toHaveLength(2)
    expect(state.operations[1]).toHaveProperty('createTable')
  })

  test('reorders operations', () => {
    const { addOperation, reorderOperations } = useBatchUpdateStore.getState()
    
    addOperation({ createSlide: { objectId: 'slide1' } })
    addOperation({ createSlide: { objectId: 'slide2' } })
    addOperation({ createSlide: { objectId: 'slide3' } })
    
    reorderOperations(0, 2)
    
    const { operations } = useBatchUpdateStore.getState()
    const ops = operations as any[]
    expect(ops[0].createSlide.objectId).toBe('slide2')
    expect(ops[1].createSlide.objectId).toBe('slide3')
    expect(ops[2].createSlide.objectId).toBe('slide1')
  })

  test('selects operations', () => {
    const { addOperation, selectOperation } = useBatchUpdateStore.getState()
    
    addOperation({ createSlide: {} })
    selectOperation(0)
    
    let state = useBatchUpdateStore.getState()
    expect(state.selectedOperationIndex).toBe(0)
    
    selectOperation(null)
    state = useBatchUpdateStore.getState()
    expect(state.selectedOperationIndex).toBe(null)
  })

  test('clears operations', () => {
    const { addOperation, selectOperation, clearOperations } = useBatchUpdateStore.getState()
    
    addOperation({ createSlide: {} })
    addOperation({ createShape: { shapeType: 'RECTANGLE', elementProperties: { pageObjectId: 'slide1' } } })
    selectOperation(1)
    
    clearOperations()
    
    const state = useBatchUpdateStore.getState()
    expect(state.operations).toHaveLength(0)
    expect(state.selectedOperationIndex).toBe(null)
  })

  test('sets presentation ID', () => {
    const { setPresentationId } = useBatchUpdateStore.getState()
    
    setPresentationId('presentation_123')
    
    const state = useBatchUpdateStore.getState()
    expect(state.presentationId).toBe('presentation_123')
  })

  test('gets batchUpdate request', () => {
    const { addOperation, getBatchUpdateRequest } = useBatchUpdateStore.getState()
    
    addOperation({ createSlide: { insertionIndex: 0 } })
    addOperation({ createSlide: { insertionIndex: 1 } })
    
    const request = getBatchUpdateRequest()
    
    expect(request.requests).toHaveLength(2)
    expect(request.requests[0]).toHaveProperty('createSlide')
    expect(request.requests[1]).toHaveProperty('createSlide')
  })

  test('imports operations', () => {
    const { importOperations } = useBatchUpdateStore.getState()
    
    const operations = [
      { createSlide: { insertionIndex: 0 } },
      { createShape: { shapeType: 'RECTANGLE', elementProperties: { pageObjectId: 'slide1' } } },
    ]
    
    importOperations(operations)
    
    const state = useBatchUpdateStore.getState()
    expect(state.operations).toHaveLength(2)
    expect(state.selectedOperationIndex).toBe(null)
  })

  test('handles selected index during deletion', () => {
    const { addOperation, selectOperation, deleteOperation } = useBatchUpdateStore.getState()
    
    addOperation({ createSlide: { objectId: 'slide1' } })
    addOperation({ createSlide: { objectId: 'slide2' } })
    addOperation({ createSlide: { objectId: 'slide3' } })
    
    selectOperation(2)
    deleteOperation(1)
    
    let state = useBatchUpdateStore.getState()
    expect(state.selectedOperationIndex).toBe(1)
    
    selectOperation(1)
    deleteOperation(1)
    
    state = useBatchUpdateStore.getState()
    expect(state.selectedOperationIndex).toBe(null)
  })
})