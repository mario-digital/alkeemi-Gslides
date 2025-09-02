import { expect, test, describe, beforeEach, mock } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OperationEditorModal } from '@/app/components/editor/modals/OperationEditorModal'
import { BatchUpdateRequest } from '@/types/batch-update'

describe('OperationEditorModal', () => {
  const mockOnClose = mock(() => {})
  const mockOnSave = mock(() => {})

  beforeEach(() => {
    mockOnClose.mockClear()
    mockOnSave.mockClear()
  })

  test('renders when open', () => {
    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('New Operation')).toBeDefined()
  })

  test('does not render when closed', () => {
    const { container } = render(
      <OperationEditorModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  test('displays edit title when operation provided', () => {
    const operation: BatchUpdateRequest = {
      createShape: {
        objectId: 'shape-1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide-1'
        }
      }
    }

    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        operation={operation}
        operationIndex={2}
      />
    )

    expect(screen.getByText('Edit Operation #3')).toBeDefined()
  })

  test('closes on escape key', async () => {
    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  test('closes on backdrop click', async () => {
    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop)
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  test('closes on close button click', async () => {
    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  test('applies scale animation on mount', () => {
    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    const modalPanel = screen.getByRole('dialog').querySelector('.animate-in')
    expect(modalPanel?.className).toContain('zoom-in-90')
    expect(modalPanel?.className).toContain('fade-in')
  })

  test('renders correct form for createShape operation', () => {
    const operation: BatchUpdateRequest = {
      createShape: {
        objectId: 'shape-1',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide-1'
        }
      }
    }

    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        operation={operation}
      />
    )

    // CreateElementForm should be rendered
    expect(screen.getByText('Element Type')).toBeDefined()
    expect(screen.getByText('Shape Type')).toBeDefined()
  })

  test('renders correct form for deleteObject operation', () => {
    const operation: BatchUpdateRequest = {
      deleteObject: {
        objectId: 'shape-1'
      }
    }

    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        operation={operation}
      />
    )

    // DeleteElementForm should be rendered
    expect(screen.getByText('Warning: Permanent Deletion')).toBeDefined()
    expect(screen.getByText('I understand this action is permanent')).toBeDefined()
  })

  test('body overflow is hidden when modal is open', () => {
    const { unmount } = render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    expect(document.body.style.overflow).toBe('hidden')
    
    unmount()
    
    expect(document.body.style.overflow).toBe('unset')
  })

  test('has proper accessibility attributes', () => {
    render(
      <OperationEditorModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title')
    
    const title = screen.getByText('New Operation')
    expect(title.id).toBe('modal-title')
  })
})