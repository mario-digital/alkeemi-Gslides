import { describe, it, expect, beforeEach } from 'bun:test'
import { useBatchUpdateStore } from '@/stores/batchUpdateStore'
import { BatchUpdateOperation } from '@/types/batch-update'

describe('Editor Workflow Integration', () => {
  beforeEach(() => {
    // Reset store state
    useBatchUpdateStore.getState().clearOperations()
  })

  it('should add operations to store', () => {
    const store = useBatchUpdateStore.getState()
    
    const operation: BatchUpdateOperation = {
      createShape: {
        objectId: 'shape_1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 100, unit: 'EMU' },
            height: { magnitude: 100, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'EMU'
          }
        }
      }
    }

    store.addOperation(operation)
    expect(store.operations).toHaveLength(1)
    expect(store.operations[0]).toEqual(operation)
  })

  it('should update operations in store', () => {
    const store = useBatchUpdateStore.getState()
    
    const operation1: BatchUpdateOperation = {
      createShape: {
        objectId: 'shape_1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 100, unit: 'EMU' },
            height: { magnitude: 100, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'EMU'
          }
        }
      }
    }

    const operation2: BatchUpdateOperation = {
      createShape: {
        objectId: 'shape_2',
        shapeType: 'ELLIPSE',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 200, unit: 'EMU' },
            height: { magnitude: 200, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 100,
            translateY: 100,
            unit: 'EMU'
          }
        }
      }
    }

    store.addOperation(operation1)
    store.updateOperation(0, operation2)
    
    expect(store.operations).toHaveLength(1)
    expect(store.operations[0]).toEqual(operation2)
  })

  it('should delete operations from store', () => {
    const store = useBatchUpdateStore.getState()
    
    const operation: BatchUpdateOperation = {
      createShape: {
        objectId: 'shape_1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 100, unit: 'EMU' },
            height: { magnitude: 100, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'EMU'
          }
        }
      }
    }

    store.addOperation(operation)
    store.deleteOperation(0)
    
    expect(store.operations).toHaveLength(0)
  })

  it('should reorder operations', () => {
    const store = useBatchUpdateStore.getState()
    
    const operation1: BatchUpdateOperation = {
      createShape: {
        objectId: 'shape_1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 100, unit: 'EMU' },
            height: { magnitude: 100, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'EMU'
          }
        }
      }
    }

    const operation2: BatchUpdateOperation = {
      createTextBox: {
        objectId: 'text_1',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 300, unit: 'EMU' },
            height: { magnitude: 100, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 50,
            unit: 'EMU'
          }
        }
      }
    }

    store.addOperation(operation1)
    store.addOperation(operation2)
    store.reorderOperations(0, 1)
    
    expect(store.operations[0]).toEqual(operation2)
    expect(store.operations[1]).toEqual(operation1)
  })

  it('should generate valid BatchUpdateRequest', () => {
    const store = useBatchUpdateStore.getState()
    
    const operation: BatchUpdateOperation = {
      createShape: {
        objectId: 'shape_1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_1',
          size: {
            width: { magnitude: 100, unit: 'EMU' },
            height: { magnitude: 100, unit: 'EMU' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'EMU'
          }
        }
      }
    }

    store.addOperation(operation)
    const batchRequest = store.getBatchUpdateRequest()
    
    expect(batchRequest.requests).toHaveLength(1)
    expect(batchRequest.requests[0]).toEqual(operation)
  })

  it('should handle import operations', () => {
    const store = useBatchUpdateStore.getState()
    
    const operations: BatchUpdateOperation[] = [
      {
        createShape: {
          objectId: 'shape_1',
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: 'slide_1',
            size: {
              width: { magnitude: 100, unit: 'EMU' },
              height: { magnitude: 100, unit: 'EMU' }
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 0,
              translateY: 0,
              unit: 'EMU'
            }
          }
        }
      },
      {
        createTextBox: {
          objectId: 'text_1',
          elementProperties: {
            pageObjectId: 'slide_1',
            size: {
              width: { magnitude: 300, unit: 'EMU' },
              height: { magnitude: 100, unit: 'EMU' }
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 50,
              translateY: 50,
              unit: 'EMU'
            }
          }
        }
      }
    ]

    store.importOperations(operations)
    expect(store.operations).toHaveLength(2)
    expect(store.operations).toEqual(operations)
  })
})