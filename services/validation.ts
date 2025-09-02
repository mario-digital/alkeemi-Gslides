import { BatchUpdateRequest, BatchUpdateOperation } from '@/types/batch-update'

export class ValidationService {
  static validateBatchUpdateRequest(request: BatchUpdateRequest): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!request.requests || !Array.isArray(request.requests)) {
      errors.push('requests must be an array')
      return { valid: false, errors }
    }

    request.requests.forEach((operation, index) => {
      const operationErrors = this.validateOperation(operation, index)
      errors.push(...operationErrors)
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  static validateOperation(operation: BatchUpdateOperation, index: number): string[] {
    const errors: string[] = []
    const prefix = `Operation ${index + 1}: `

    if (!operation || typeof operation !== 'object') {
      errors.push(`${prefix}Invalid operation structure`)
      return errors
    }

    const operationKeys = Object.keys(operation)
    if (operationKeys.length !== 1) {
      errors.push(`${prefix}Operation must have exactly one request type`)
      return errors
    }

    const operationType = operationKeys[0]
    const operationData = (operation as any)[operationType]

    switch (operationType) {
      case 'createSlide':
        if (operationData.insertionIndex !== undefined && operationData.insertionIndex < 0) {
          errors.push(`${prefix}insertionIndex must be non-negative`)
        }
        break
      
      case 'createShape':
        if (!operationData.shapeType) {
          errors.push(`${prefix}shapeType is required`)
        }
        if (!operationData.elementProperties) {
          errors.push(`${prefix}elementProperties is required`)
        } else {
          if (!operationData.elementProperties.pageObjectId) {
            errors.push(`${prefix}pageObjectId is required in elementProperties`)
          }
        }
        break
      
      case 'createTable':
        if (!operationData.rows || operationData.rows < 1) {
          errors.push(`${prefix}rows must be at least 1`)
        }
        if (!operationData.columns || operationData.columns < 1) {
          errors.push(`${prefix}columns must be at least 1`)
        }
        if (!operationData.elementProperties?.pageObjectId) {
          errors.push(`${prefix}pageObjectId is required in elementProperties`)
        }
        break
      
      case 'deleteObject':
        if (!operationData.objectId) {
          errors.push(`${prefix}objectId is required`)
        }
        break
      
      case 'insertText':
        if (!operationData.objectId) {
          errors.push(`${prefix}objectId is required`)
        }
        if (!operationData.text) {
          errors.push(`${prefix}text is required`)
        }
        break
      
      case 'updatePageElementTransform':
        if (!operationData.objectId) {
          errors.push(`${prefix}objectId is required`)
        }
        if (!operationData.transform) {
          errors.push(`${prefix}transform is required`)
        }
        if (!operationData.applyMode) {
          errors.push(`${prefix}applyMode is required`)
        } else if (!['RELATIVE', 'ABSOLUTE'].includes(operationData.applyMode)) {
          errors.push(`${prefix}applyMode must be RELATIVE or ABSOLUTE`)
        }
        break
      
      default:
        break
    }

    return errors
  }

  static validateObjectId(objectId: string): boolean {
    if (!objectId || typeof objectId !== 'string') return false
    if (objectId.length > 100) return false
    return /^[a-zA-Z0-9_-]+$/.test(objectId)
  }

  static validatePresentationId(presentationId: string): boolean {
    if (!presentationId || typeof presentationId !== 'string') return false
    return /^[a-zA-Z0-9_-]{20,}$/.test(presentationId)
  }
}