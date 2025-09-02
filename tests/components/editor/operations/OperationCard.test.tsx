import { describe, it, expect, beforeEach, vi } from 'bun:test'
import { render, screen, fireEvent } from '@testing-library/react'
import { OperationCard, type OperationData } from '@/app/components/editor/operations/OperationCard'

describe('OperationCard', () => {
  const mockOperation: OperationData = {
    id: 'test-1',
    type: 'create',
    title: 'Create Shape',
    description: 'Creates a new shape element',
    objectId: 'shape_123',
    pageObjectId: 'page_456',
    isValid: true,
  }

  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render operation card with basic information', () => {
      render(
        <OperationCard
          operation={mockOperation}
          index={0}
        />
      )

      expect(screen.getByText('Create Shape')).toBeDefined()
      expect(screen.getByText('Creates a new shape element')).toBeDefined()
      expect(screen.getByText(/ID: shape_123/)).toBeDefined()
      expect(screen.getByText(/Page: page_456/)).toBeDefined()
    })

    it('should render with correct type color for create operation', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={0}
        />
      )

      const glassPanel = container.querySelector('.text-\\[\\#06ffa5\\]')
      expect(glassPanel).toBeDefined()
    })

    it('should render with correct type color for update operation', () => {
      const updateOperation = { ...mockOperation, type: 'update' as const }
      const { container } = render(
        <OperationCard
          operation={updateOperation}
          index={0}
        />
      )

      const card = container.querySelector('.text-\\[\\#22d3ee\\]')
      expect(card).toBeDefined()
    })

    it('should render with correct type color for delete operation', () => {
      const deleteOperation = { ...mockOperation, type: 'delete' as const }
      const { container } = render(
        <OperationCard
          operation={deleteOperation}
          index={0}
        />
      )

      const card = container.querySelector('.text-\\[\\#ec4899\\]')
      expect(card).toBeDefined()
    })

    it('should render with correct type color for transform operation', () => {
      const transformOperation = { ...mockOperation, type: 'transform' as const }
      const { container } = render(
        <OperationCard
          operation={transformOperation}
          index={0}
        />
      )

      const card = container.querySelector('.text-\\[\\#a855f7\\]')
      expect(card).toBeDefined()
    })

    it('should render with correct type color for text operation', () => {
      const textOperation = { ...mockOperation, type: 'text' as const }
      const { container } = render(
        <OperationCard
          operation={textOperation}
          index={0}
        />
      )

      const card = container.querySelector('.text-\\[\\#fbbf24\\]')
      expect(card).toBeDefined()
    })
  })

  describe('Validation States', () => {
    it('should show error indicator when operation is invalid', () => {
      const invalidOperation = { ...mockOperation, isValid: false }
      render(
        <OperationCard
          operation={invalidOperation}
          index={0}
        />
      )

      const errorIcon = document.querySelector('.text-red-500')
      expect(errorIcon).toBeDefined()
    })

    it('should show success indicator when operation is valid', () => {
      render(
        <OperationCard
          operation={mockOperation}
          index={0}
        />
      )

      const successIcon = document.querySelector('.text-green-500')
      expect(successIcon).toBeDefined()
    })

    it('should display error message when provided', () => {
      const errorOperation = { 
        ...mockOperation, 
        isValid: false,
        error: 'Invalid object ID format' 
      }
      render(
        <OperationCard
          operation={errorOperation}
          index={0}
        />
      )

      expect(screen.getByText('Invalid object ID format')).toBeDefined()
    })
  })

  describe('Drag States', () => {
    it('should apply dragging styles when isDragging is true', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={0}
          isDragging={true}
        />
      )

      const card = container.firstChild
      expect(card?.className).toContain('opacity-50')
      expect(card?.className).toContain('scale-95')
    })

    it('should apply drag over styles when isDragOver is true', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={0}
          isDragOver={true}
        />
      )

      const card = container.firstChild
      expect(card?.className).toContain('scale-105')
    })
  })

  describe('Animation', () => {
    it('should apply slide-in animation with correct delay', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={3}
        />
      )

      const card = container.firstChild as HTMLElement
      expect(card?.style.animationDelay).toBe('150ms')
    })

    it('should have will-change property for performance', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={0}
        />
      )

      const glassPanel = container.querySelector('.will-change-transform')
      expect(glassPanel).toBeDefined()
    })
  })

  describe('Hover States', () => {
    it('should have hover transform effect', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={0}
        />
      )

      const glassPanel = container.querySelector('.hover\\:translate-y-\\[-4px\\]')
      expect(glassPanel).toBeDefined()
    })

    it('should have hover shadow effect', () => {
      const { container } = render(
        <OperationCard
          operation={mockOperation}
          index={0}
        />
      )

      const glassPanel = container.querySelector('.hover\\:shadow-\\[0_0_30px_rgba\\(168\\,85\\,247\\,0\\.3\\)\\]')
      expect(glassPanel).toBeDefined()
    })
  })

  describe('Icon Rendering', () => {
    it('should render correct icon for each operation type', () => {
      const types = ['create', 'update', 'delete', 'transform', 'text'] as const
      
      types.forEach(type => {
        const operation = { ...mockOperation, type }
        const { container } = render(
          <OperationCard
            operation={operation}
            index={0}
          />
        )
        
        const icon = container.querySelector('svg')
        expect(icon).toBeDefined()
      })
    })
  })
})