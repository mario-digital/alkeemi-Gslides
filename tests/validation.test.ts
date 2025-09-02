import { describe, test, expect } from 'bun:test'
import { ValidationService } from '../services/validation'

describe('ValidationService', () => {
  describe('validateBatchUpdateRequest', () => {
    test('validates empty request array', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [],
      })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('rejects non-array requests', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: null as any,
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('requests must be an array')
    })

    test('validates createSlide operation', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [
          {
            createSlide: {
              insertionIndex: 1,
            },
          },
        ],
      })
      expect(result.valid).toBe(true)
    })

    test('rejects negative insertionIndex', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [
          {
            createSlide: {
              insertionIndex: -1,
            },
          },
        ],
      })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('insertionIndex must be non-negative')
    })

    test('validates createShape operation', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [
          {
            createShape: {
              shapeType: 'RECTANGLE',
              elementProperties: {
                pageObjectId: 'slide1',
              },
            },
          },
        ],
      })
      expect(result.valid).toBe(true)
    })

    test('rejects createShape without shapeType', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [
          {
            createShape: {
              elementProperties: {
                pageObjectId: 'slide1',
              },
            } as any,
          },
        ],
      })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('shapeType is required')
    })

    test('validates createTable operation', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [
          {
            createTable: {
              rows: 3,
              columns: 4,
              elementProperties: {
                pageObjectId: 'slide1',
              },
            },
          },
        ],
      })
      expect(result.valid).toBe(true)
    })

    test('rejects createTable with invalid rows', () => {
      const result = ValidationService.validateBatchUpdateRequest({
        requests: [
          {
            createTable: {
              rows: 0,
              columns: 4,
              elementProperties: {
                pageObjectId: 'slide1',
              },
            },
          },
        ],
      })
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('rows must be at least 1')
    })
  })

  describe('validateObjectId', () => {
    test('validates valid object IDs', () => {
      expect(ValidationService.validateObjectId('slide_123')).toBe(true)
      expect(ValidationService.validateObjectId('SHAPE-456')).toBe(true)
      expect(ValidationService.validateObjectId('obj789')).toBe(true)
    })

    test('rejects invalid object IDs', () => {
      expect(ValidationService.validateObjectId('')).toBe(false)
      expect(ValidationService.validateObjectId('obj with spaces')).toBe(false)
      expect(ValidationService.validateObjectId('obj@123')).toBe(false)
      expect(ValidationService.validateObjectId('a'.repeat(101))).toBe(false)
    })
  })

  describe('validatePresentationId', () => {
    test('validates valid presentation IDs', () => {
      expect(ValidationService.validatePresentationId('1234567890abcdefghij')).toBe(true)
      expect(ValidationService.validatePresentationId('ABC-123_xyz-0987654321')).toBe(true)
    })

    test('rejects invalid presentation IDs', () => {
      expect(ValidationService.validatePresentationId('')).toBe(false)
      expect(ValidationService.validatePresentationId('short')).toBe(false)
      expect(ValidationService.validatePresentationId('id with spaces 123456789')).toBe(false)
    })
  })
})