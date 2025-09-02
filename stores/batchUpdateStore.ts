import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { BatchUpdateOperation, BatchUpdateRequest } from '@/types/batch-update'

export interface SelectedElement {
  objectId: string;
  type: string;
  properties: Record<string, any>;
}

interface BatchUpdateState {
  operations: BatchUpdateOperation[]
  selectedOperationIndex: number | null
  selectedElement: SelectedElement | null
  selectedOperationId: string | null
  selectedElementId: string | null
  presentationId: string
  undoStack: BatchUpdateOperation[][]
  redoStack: BatchUpdateOperation[][]
  isDirty: boolean
  validationErrors: Record<string, string[]>
  globalValidationState: 'valid' | 'invalid' | 'warning'
  
  addOperation: (operation: BatchUpdateOperation) => void
  addRequest: (request: any) => void
  updateOperation: (index: number, operation: BatchUpdateOperation) => void
  deleteOperation: (index: number) => void
  reorderOperations: (fromIndex: number, toIndex: number) => void
  selectOperation: (index: number | null) => void
  selectElement: (element: SelectedElement | null) => void
  selectByIds: (operationId: string | null, elementId: string | null) => void
  syncSelection: (source: 'operation' | 'element', id: string | null) => void
  setValidationErrors: (errors: Record<string, string[]>) => void
  setGlobalValidationState: (state: 'valid' | 'invalid' | 'warning') => void
  clearOperations: () => void
  setPresentationId: (id: string) => void
  getBatchUpdateRequest: () => BatchUpdateRequest
  importOperations: (operations: BatchUpdateOperation[]) => void
  undo: () => void
  redo: () => void
  setDirty: (dirty: boolean) => void
}

export const useBatchUpdateStore = create<BatchUpdateState>()(
  persist(
    (set, get) => ({
      operations: [],
      selectedOperationIndex: null,
      selectedElement: null,
      selectedOperationId: null,
      selectedElementId: null,
      presentationId: '',
      undoStack: [],
      redoStack: [],
      isDirty: false,
      validationErrors: {},
      globalValidationState: 'valid',

      addOperation: (operation) => {
        const { operations, undoStack } = get();
        set({
          operations: [...operations, operation],
          undoStack: [...undoStack, operations],
          redoStack: [],
          isDirty: true,
        });
      },

      addRequest: (request) => {
        const { operations, undoStack } = get();
        set({
          operations: [...operations, request],
          undoStack: [...undoStack, operations],
          redoStack: [],
          isDirty: true,
        });
      },

      updateOperation: (index, operation) =>
        set((state) => ({
          operations: state.operations.map((op, i) =>
            i === index ? operation : op
          ),
        })),

      deleteOperation: (index) =>
        set((state) => ({
          operations: state.operations.filter((_, i) => i !== index),
          selectedOperationIndex:
            state.selectedOperationIndex === index
              ? null
              : state.selectedOperationIndex && state.selectedOperationIndex > index
              ? state.selectedOperationIndex - 1
              : state.selectedOperationIndex,
        })),

      reorderOperations: (fromIndex, toIndex) =>
        set((state) => {
          const operations = [...state.operations]
          const [removed] = operations.splice(fromIndex, 1)
          operations.splice(toIndex, 0, removed)
          
          let newSelectedIndex = state.selectedOperationIndex
          if (state.selectedOperationIndex === fromIndex) {
            newSelectedIndex = toIndex
          } else if (
            state.selectedOperationIndex !== null &&
            fromIndex < state.selectedOperationIndex &&
            toIndex >= state.selectedOperationIndex
          ) {
            newSelectedIndex = state.selectedOperationIndex - 1
          } else if (
            state.selectedOperationIndex !== null &&
            fromIndex > state.selectedOperationIndex &&
            toIndex <= state.selectedOperationIndex
          ) {
            newSelectedIndex = state.selectedOperationIndex + 1
          }
          
          return { operations, selectedOperationIndex: newSelectedIndex }
        }),

      selectOperation: (index) =>
        set({ selectedOperationIndex: index }),

      selectElement: (element) =>
        set({ selectedElement: element }),

      selectByIds: (operationId, elementId) =>
        set({ selectedOperationId: operationId, selectedElementId: elementId }),

      syncSelection: (source, id) => {
        if (source === 'operation') {
          set({ selectedOperationId: id, selectedElementId: id });
        } else {
          set({ selectedElementId: id, selectedOperationId: id });
        }
      },

      setValidationErrors: (errors) =>
        set({ validationErrors: errors }),

      setGlobalValidationState: (state) =>
        set({ globalValidationState: state }),

      clearOperations: () =>
        set({ 
          operations: [], 
          selectedOperationIndex: null, 
          selectedElement: null,
          selectedOperationId: null,
          selectedElementId: null,
          isDirty: false,
          validationErrors: {},
          globalValidationState: 'valid'
        }),

      setPresentationId: (id) =>
        set({ presentationId: id }),

      getBatchUpdateRequest: () => ({
        requests: get().operations,
      }),

      importOperations: (operations) =>
        set({ operations, selectedOperationIndex: null }),

      undo: () => {
        const { undoStack, operations, redoStack } = get();
        if (undoStack.length === 0) return;
        
        const previousState = undoStack[undoStack.length - 1];
        const newUndoStack = undoStack.slice(0, -1);
        
        set({
          operations: previousState,
          undoStack: newUndoStack,
          redoStack: [...redoStack, operations],
          isDirty: newUndoStack.length > 0,
        });
      },

      redo: () => {
        const { redoStack, operations, undoStack } = get();
        if (redoStack.length === 0) return;
        
        const nextState = redoStack[redoStack.length - 1];
        const newRedoStack = redoStack.slice(0, -1);
        
        set({
          operations: nextState,
          undoStack: [...undoStack, operations],
          redoStack: newRedoStack,
          isDirty: true,
        });
      },

      setDirty: (dirty) => {
        set({ isDirty: dirty });
      },
    }),
    {
      name: 'batch-update-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({
        operations: state.operations,
        presentationId: state.presentationId,
      }),
    }
  )
)