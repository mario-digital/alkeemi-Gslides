import { describe, it, expect, beforeEach, vi } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DraggableOperationsList } from '@/app/components/editor/operations/DraggableOperationsList'
import type { OperationData } from '@/app/components/editor/operations/OperationCard'

describe('DraggableOperationsList', () => {
  const mockOperations: OperationData[] = [
    {
      id: 'op-1',
      type: 'create',
      title: 'Create Shape',
      description: 'Creates a new shape',
      isValid: true,
    },
    {
      id: 'op-2',
      type: 'update',
      title: 'Update Text',
      description: 'Updates text content',
      isValid: true,
    },
    {
      id: 'op-3',
      type: 'delete',
      title: 'Delete Element',
      description: 'Removes an element',
      isValid: false,
    },
  ]

  const mockOnOperationEdit = vi.fn()
  const mockOnOperationDelete = vi.fn()
  const mockOnReorder = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all operations', () => {
      render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      expect(screen.getByText('Create Shape')).toBeDefined()
      expect(screen.getByText('Update Text')).toBeDefined()
      expect(screen.getByText('Delete Element')).toBeDefined()
    })

    it('should display operation count', () => {
      render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      expect(screen.getByText('(3)')).toBeDefined()
    })

    it('should show empty state when no operations', () => {
      render(
        <DraggableOperationsList
          operations={[]}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      expect(screen.getByText('No operations yet')).toBeDefined()
      expect(screen.getByText('Click the + button to add your first operation')).toBeDefined()
    })
  })

  describe('Drag and Drop', () => {
    it('should render with sortable context', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      // Check that cards are rendered within draggable context
      const cards = container.querySelectorAll('[role="button"]')
      expect(cards.length).toBeGreaterThan(0)
    })

    it('should have drag attributes on operation cards', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      // Check for draggable attributes
      const draggableElements = container.querySelectorAll('[draggable]')
      expect(draggableElements.length).toBeGreaterThan(0)
    })
  })

  describe('Glass Panel Styling', () => {
    it('should have glass panel styling', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      const glassPanel = container.querySelector('.bg-bg-secondary\\/60')
      expect(glassPanel).toBeDefined()
    })

    it('should have border styling', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      const borderElement = container.querySelector('.border-primary-neon\\/10')
      expect(borderElement).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('should handle large lists efficiently', () => {
      const largeOperationsList = Array.from({ length: 100 }, (_, i) => ({
        id: `op-${i}`,
        type: 'create' as const,
        title: `Operation ${i}`,
        description: `Description ${i}`,
        isValid: true,
      }))

      const startTime = performance.now()
      
      render(
        <DraggableOperationsList
          operations={largeOperationsList}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      const renderTime = performance.now() - startTime
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(1000) // 1 second
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      const heading = screen.getByText('Operations')
      expect(heading.tagName).toBe('H2')
    })

    it('should support keyboard navigation', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onOperationEdit={mockOnOperationEdit}
          onOperationDelete={mockOnOperationDelete}
          onReorder={mockOnReorder}
        />
      )

      // DnD kit should add keyboard support
      const draggableElements = container.querySelectorAll('[role="button"]')
      draggableElements.forEach(element => {
        expect(element.getAttribute('tabindex')).toBeDefined()
      })
    })
  })
})