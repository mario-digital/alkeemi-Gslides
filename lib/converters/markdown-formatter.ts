import { BatchUpdateOperation } from '@/types/batch-update'

export function formatOperationsAsMarkdown(operations: BatchUpdateOperation[]): string {
  const timestamp = new Date().toISOString()
  let markdown = `# BatchUpdate Operations\n\nGenerated: ${timestamp}\n\nTotal Operations: ${operations.length}\n\n---\n\n`
  
  operations.forEach((operation, index) => {
    const operationType = Object.keys(operation)[0]
    const description = getOperationDescription(operation)
    
    markdown += `## Operation ${index + 1}: ${operationType}\n\n`
    markdown += `${description}\n\n`
    markdown += '```json\n'
    markdown += JSON.stringify(operation, null, 2)
    markdown += '\n```\n\n'
    markdown += '---\n\n'
  })
  
  return markdown
}

function getOperationDescription(operation: BatchUpdateOperation): string {
  const operationType = Object.keys(operation)[0]
  const operationData = (operation as Record<string, Record<string, unknown>>)[operationType]
  
  switch (operationType) {
    case 'createShape':
      return `Creates a ${operationData.shapeType || 'shape'} element with ID: ${operationData.objectId}`
    
    case 'createTextBox':
      return `Creates a text box with ID: ${operationData.objectId}`
    
    case 'insertText':
      return `Inserts text into element: ${operationData.objectId}`
    
    case 'deleteObject':
      return `Deletes element with ID: ${operationData.objectId}`
    
    case 'updateShapeProperties':
      return `Updates properties of shape: ${operationData.objectId}`
    
    case 'updateTextStyle':
      return `Updates text style in element: ${operationData.objectId}`
    
    case 'createImage':
      return `Creates an image with ID: ${operationData.objectId}`
    
    case 'createLine':
      return `Creates a line with ID: ${operationData.objectId}`
    
    case 'createTable':
      return `Creates a table with ${operationData.rows}x${operationData.columns} cells`
    
    case 'createParagraphBullets':
      return `Creates bullet points in text: ${operationData.objectId}`
    
    case 'updatePageElementTransform':
      return `Transforms element: ${operationData.objectId}`
    
    case 'duplicateObject':
      return `Duplicates element: ${operationData.objectId?.objectId || operationData.objectId}`
    
    case 'groupObjects':
      const ids = operationData.childrenObjectIds || []
      return `Groups ${ids.length} elements into: ${operationData.groupObjectId}`
    
    case 'ungroupObjects':
      const groupIds = operationData.objectIds || []
      return `Ungroups ${groupIds.length} element(s)`
    
    case 'createSlide':
      return `Creates a new slide with ID: ${operationData.objectId}`
    
    case 'updateSlideProperties':
      return `Updates properties of slide: ${operationData.objectId}`
    
    default:
      return `Performs ${operationType} operation`
  }
}