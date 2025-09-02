import { BatchUpdateOperation } from '@/types/batch-update'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateBatchUpdate(operations: BatchUpdateOperation[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (!Array.isArray(operations)) {
    errors.push('Operations must be an array')
    return { isValid: false, errors, warnings }
  }
  
  if (operations.length === 0) {
    warnings.push('No operations to validate')
  }
  
  operations.forEach((operation, index) => {
    const result = validateOperation(operation, index)
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function validateOperation(operation: BatchUpdateOperation, index: number): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const prefix = `Operation ${index + 1}`
  
  if (!operation || typeof operation !== 'object') {
    errors.push(`${prefix}: Invalid operation format`)
    return { isValid: false, errors, warnings }
  }
  
  const operationType = Object.keys(operation)[0]
  if (!operationType) {
    errors.push(`${prefix}: No operation type specified`)
    return { isValid: false, errors, warnings }
  }
  
  const operationData = (operation as Record<string, Record<string, unknown>>)[operationType]
  
  // Common validations
  if ('objectId' in operationData) {
    if (!operationData.objectId || typeof operationData.objectId !== 'string') {
      errors.push(`${prefix}: Invalid or missing objectId`)
    } else if (operationData.objectId.length > 100) {
      warnings.push(`${prefix}: objectId is unusually long`)
    }
  }
  
  // Operation-specific validations
  switch (operationType) {
    case 'createShape':
    case 'createTextBox':
    case 'createImage':
    case 'createLine':
      if (!operationData.elementProperties) {
        errors.push(`${prefix}: Missing elementProperties`)
      } else {
        validateElementProperties(operationData.elementProperties, `${prefix}.elementProperties`, errors, warnings)
      }
      break
    
    case 'insertText':
      if (!operationData.text) {
        errors.push(`${prefix}: Missing text content`)
      }
      break
    
    case 'deleteObject':
      if (!operationData.objectId) {
        errors.push(`${prefix}: deleteObject requires objectId`)
      }
      break
    
    case 'createTable':
      if (!operationData.rows || operationData.rows < 1) {
        errors.push(`${prefix}: Invalid row count`)
      }
      if (!operationData.columns || operationData.columns < 1) {
        errors.push(`${prefix}: Invalid column count`)
      }
      break
    
    case 'groupObjects':
      if (!operationData.childrenObjectIds || !Array.isArray(operationData.childrenObjectIds)) {
        errors.push(`${prefix}: groupObjects requires childrenObjectIds array`)
      } else if (operationData.childrenObjectIds.length < 2) {
        errors.push(`${prefix}: groupObjects requires at least 2 children`)
      }
      if (!operationData.groupObjectId) {
        errors.push(`${prefix}: groupObjects requires groupObjectId`)
      }
      break
    
    case 'updatePageElementTransform':
      if (!operationData.transform) {
        errors.push(`${prefix}: Missing transform data`)
      } else {
        validateTransform(operationData.transform, `${prefix}.transform`, errors, warnings)
      }
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function validateElementProperties(props: Record<string, unknown>, path: string, errors: string[], warnings: string[]) {
  if (!props.pageObjectId) {
    errors.push(`${path}: Missing pageObjectId`)
  }
  
  if (props.size) {
    validateSize(props.size, `${path}.size`, errors, warnings)
  }
  
  if (props.transform) {
    validateTransform(props.transform, `${path}.transform`, errors, warnings)
  }
}

function validateSize(size: Record<string, unknown>, path: string, errors: string[], warnings: string[]) {
  const width = size.width as Record<string, unknown> | undefined
  const height = size.height as Record<string, unknown> | undefined
  
  if (!width || !width.magnitude) {
    errors.push(`${path}: Missing width`)
  } else if ((width.magnitude as number) <= 0) {
    errors.push(`${path}: Width must be positive`)
  }
  
  if (!height || !height.magnitude) {
    errors.push(`${path}: Missing height`)
  } else if ((height.magnitude as number) <= 0) {
    errors.push(`${path}: Height must be positive`)
  }
  
  if (!width?.unit || !height?.unit) {
    warnings.push(`${path}: Missing unit specification (defaulting to EMU)`)
  }
}

function validateTransform(transform: Record<string, unknown>, path: string, errors: string[], warnings: string[]) {
  if (transform.scaleX !== undefined && transform.scaleX === 0) {
    errors.push(`${path}: scaleX cannot be 0`)
  }
  
  if (transform.scaleY !== undefined && transform.scaleY === 0) {
    errors.push(`${path}: scaleY cannot be 0`)
  }
  
  if (!transform.translateX && !transform.translateY && 
      transform.scaleX === undefined && transform.scaleY === undefined &&
      transform.shearX === undefined && transform.shearY === undefined) {
    warnings.push(`${path}: Transform has no effect`)
  }
}