import { expect, test, describe } from 'bun:test'
import { parseMarkdownToOperations } from '@/lib/converters/markdown-parser'
import { formatOperationsAsMarkdown } from '@/lib/converters/markdown-formatter'
import { validateBatchUpdate } from '@/lib/validation/batch-update-validator'
import { BatchUpdateOperation } from '@/types/batch-update'

describe('Import/Export Round Trip', () => {
  const testOperations: BatchUpdateOperation[] = [
    {
      createShape: {
        objectId: 'shape1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'p1',
          size: {
            width: { magnitude: 100, unit: 'PT' },
            height: { magnitude: 100, unit: 'PT' }
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 50,
            unit: 'PT'
          }
        }
      }
    },
    {
      insertText: {
        objectId: 'shape1',
        text: 'Test Text',
        insertionIndex: 0
      }
    }
  ]

  test('exports operations to markdown format', () => {
    const markdown = formatOperationsAsMarkdown(testOperations)
    
    expect(markdown).toContain('# BatchUpdate Operations')
    expect(markdown).toContain('Operation 1: createShape')
    expect(markdown).toContain('Operation 2: insertText')
    expect(markdown).toContain('```json')
    expect(markdown).toContain('"objectId": "shape1"')
  })

  test('parses markdown back to operations', () => {
    const markdown = formatOperationsAsMarkdown(testOperations)
    const result = parseMarkdownToOperations(markdown)
    
    expect(result.errors).toHaveLength(0)
    expect(result.operations).toHaveLength(2)
    expect(result.operations[0]).toEqual(testOperations[0])
    expect(result.operations[1]).toEqual(testOperations[1])
  })

  test('validates imported operations', () => {
    const validation = validateBatchUpdate(testOperations)
    
    expect(validation.isValid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  test('catches validation errors in invalid operations', () => {
    const invalidOperations = [
      {
        createShape: {
          // Missing objectId
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: 'p1',
            size: {
              width: { magnitude: -100, unit: 'PT' }, // Invalid negative width
              height: { magnitude: 100, unit: 'PT' }
            }
          }
        }
      }
    ]
    
    const validation = validateBatchUpdate(invalidOperations)
    
    expect(validation.isValid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
    expect(validation.errors[0]).toContain('Width must be positive')
  })

  test('handles malformed markdown gracefully', () => {
    const malformedMarkdown = `
## Operation 1: createShape
This is not valid JSON
{ broken: json }
    `
    
    const result = parseMarkdownToOperations(malformedMarkdown)
    
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.operations).toHaveLength(0)
  })

  test('parses JSON code blocks from markdown', () => {
    const markdown = `
# BatchUpdate Operations

\`\`\`json
[
  {
    "createShape": {
      "objectId": "test",
      "shapeType": "RECTANGLE"
    }
  }
]
\`\`\`
    `
    
    const result = parseMarkdownToOperations(markdown)
    
    expect(result.errors).toHaveLength(0)
    expect(result.operations).toHaveLength(1)
    expect(result.operations[0].createShape?.objectId).toBe('test')
  })
})