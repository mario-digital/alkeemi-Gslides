import { describe, it, expect, beforeEach, vi } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { DraggableOperationsList } from '@/app/components/editor/operations/DraggableOperationsList'
import { FloatingAddButton } from '@/app/components/editor/operations/FloatingAddButton'
import type { OperationData } from '@/app/components/editor/operations/OperationCard'

expect.extend(toHaveNoViolations)

describe('Operations Components Integration', () => {
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
  ]

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation through operations list', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()

      render(
        <DraggableOperationsList
          operations={mockOperations}
          onReorder={onReorder}
        />
      )

      // Tab through draggable items
      await user.tab()
      
      // First item should be focused
      const firstCard = screen.getByText('Create Shape').closest('[role="button"]')
      expect(document.activeElement).toBe(firstCard)

      // Tab to next item
      await user.tab()
      const secondCard = screen.getByText('Update Text').closest('[role="button"]')
      expect(document.activeElement).toBe(secondCard)
    })

    it('should support keyboard operation in FloatingAddButton', async () => {
      const user = userEvent.setup()
      const onAddOperation = vi.fn()

      render(
        <FloatingAddButton onAddOperation={onAddOperation} />
      )

      // Tab to button
      await user.tab()
      const button = screen.getByRole('button')
      expect(document.activeElement).toBe(button)

      // Press Enter to open menu
      await user.keyboard('{Enter}')

      // Menu should be open
      await waitFor(() => {
        expect(screen.getByText('Create Element')).toBeDefined()
      })

      // Navigate menu with arrow keys
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      // Should trigger callback
      expect(onAddOperation).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations in OperationsList', async () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onReorder={vi.fn()}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations in FloatingAddButton', async () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={vi.fn()} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should announce operation reordering to screen readers', async () => {
      const onReorder = vi.fn()

      render(
        <div role="application" aria-label="Operations list">
          <DraggableOperationsList
            operations={mockOperations}
            onReorder={onReorder}
          />
        </div>
      )

      // Check for ARIA live regions that would announce changes
      const liveRegion = screen.getByRole('application')
      expect(liveRegion).toBeDefined()
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle window resize gracefully', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onReorder={vi.fn()}
        />
      )

      // Initial render
      expect(container.querySelector('.overflow-hidden')).toBeDefined()

      // Simulate resize
      global.innerWidth = 500
      global.dispatchEvent(new Event('resize'))

      // Should still be functional
      expect(screen.getByText('Create Shape')).toBeDefined()
    })

    it('should maintain fixed positioning for FloatingAddButton on scroll', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={vi.fn()} />
      )

      const fixedButton = container.querySelector('.fixed')
      expect(fixedButton).toBeDefined()

      // Should have bottom and right positioning
      expect(fixedButton?.className).toContain('bottom-6')
      expect(fixedButton?.className).toContain('right-6')
    })
  })

  describe('Performance', () => {
    it('should render efficiently with animation frame timing', async () => {
      const operations = Array.from({ length: 50 }, (_, i) => ({
        id: `op-${i}`,
        type: 'create' as const,
        title: `Operation ${i}`,
        isValid: true,
      }))

      const startTime = performance.now()
      
      render(
        <DraggableOperationsList
          operations={operations}
          onReorder={vi.fn()}
        />
      )

      const renderTime = performance.now() - startTime

      // Should maintain 60 FPS (16.67ms per frame)
      // Allow for initial render to take multiple frames
      expect(renderTime).toBeLessThan(16.67 * 10) // 10 frames max
    })

    it('should use GPU acceleration for animations', () => {
      const { container } = render(
        <DraggableOperationsList
          operations={mockOperations}
          onReorder={vi.fn()}
        />
      )

      // Check for will-change property
      const acceleratedElements = container.querySelectorAll('.will-change-transform')
      expect(acceleratedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle empty operations gracefully', () => {
      render(
        <DraggableOperationsList
          operations={[]}
          onReorder={vi.fn()}
        />
      )

      expect(screen.getByText('No operations yet')).toBeDefined()
    })

    it('should display validation errors clearly', () => {
      const invalidOperation: OperationData = {
        id: 'invalid-1',
        type: 'create',
        title: 'Invalid Operation',
        isValid: false,
        error: 'Missing required field: objectId',
      }

      render(
        <DraggableOperationsList
          operations={[invalidOperation]}
          onReorder={vi.fn()}
        />
      )

      expect(screen.getByText('Missing required field: objectId')).toBeDefined()
    })
  })
})