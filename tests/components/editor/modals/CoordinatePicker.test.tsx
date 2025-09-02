import { expect, test, describe, beforeEach, mock } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CoordinatePicker } from '@/app/components/editor/modals/CoordinatePicker'

describe('CoordinatePicker', () => {
  const mockOnChange = mock(() => {})

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  test('renders with default values', () => {
    render(
      <CoordinatePicker
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('Position')).toBeDefined()
    expect(screen.getByDisplayValue('0')).toBeDefined()
    expect(screen.getByText('0, 0')).toBeDefined()
  })

  test('renders with custom values', () => {
    render(
      <CoordinatePicker
        value={{ x: 1000000, y: 2000000 }}
        onChange={mockOnChange}
        label="Custom Position"
      />
    )

    expect(screen.getByText('Custom Position')).toBeDefined()
    expect(screen.getByDisplayValue('1000000')).toBeDefined()
    expect(screen.getByDisplayValue('2000000')).toBeDefined()
    expect(screen.getByText('1000000, 2000000')).toBeDefined()
  })

  test('handles grid click', async () => {
    render(
      <CoordinatePicker
        onChange={mockOnChange}
        snapToGrid={true}
        gridSize={914400}
      />
    )

    const grid = screen.getByRole('button', { hidden: true }).closest('div')
    if (grid) {
      fireEvent.click(grid, { 
        clientX: 200, 
        clientY: 112
      })
    }

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled()
      const call = mockOnChange.mock.calls[0][0]
      expect(call.x).toBeGreaterThan(0)
      expect(call.y).toBeGreaterThan(0)
    })
  })

  test('handles manual input change for X coordinate', async () => {
    render(
      <CoordinatePicker
        value={{ x: 0, y: 0 }}
        onChange={mockOnChange}
      />
    )

    const xInput = screen.getAllByRole('spinbutton')[0] as HTMLInputElement
    fireEvent.change(xInput, { target: { value: '5000000' } })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        x: 5000000,
        y: 0
      })
    })
  })

  test('handles manual input change for Y coordinate', async () => {
    render(
      <CoordinatePicker
        value={{ x: 0, y: 0 }}
        onChange={mockOnChange}
      />
    )

    const yInput = screen.getAllByRole('spinbutton')[1] as HTMLInputElement
    fireEvent.change(yInput, { target: { value: '3000000' } })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        x: 0,
        y: 3000000
      })
    })
  })

  test('clamps values to valid range', async () => {
    render(
      <CoordinatePicker
        value={{ x: 0, y: 0 }}
        onChange={mockOnChange}
      />
    )

    const xInput = screen.getAllByRole('spinbutton')[0] as HTMLInputElement
    fireEvent.change(xInput, { target: { value: '99999999' } })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        x: 10058400, // Max slide width
        y: 0
      })
    })
  })

  test('displays grid lines when snapToGrid is enabled', () => {
    const { container } = render(
      <CoordinatePicker
        onChange={mockOnChange}
        snapToGrid={true}
        gridSize={914400}
      />
    )

    const gridLines = container.querySelectorAll('.bg-white\\/10')
    expect(gridLines.length).toBeGreaterThan(0)
  })

  test('does not display grid lines when snapToGrid is disabled', () => {
    const { container } = render(
      <CoordinatePicker
        onChange={mockOnChange}
        snapToGrid={false}
      />
    )

    const gridLines = container.querySelectorAll('.bg-white\\/10')
    expect(gridLines.length).toBe(0)
  })

  test('displays helper text with snap information', () => {
    render(
      <CoordinatePicker
        onChange={mockOnChange}
        snapToGrid={true}
        gridSize={914400}
      />
    )

    const helperText = screen.getByText(/Slide dimensions:.*Snap:/)
    expect(helperText).toBeDefined()
    expect(helperText.textContent).toContain('1" grid')
  })

  test('position marker updates with coordinate changes', async () => {
    const { rerender } = render(
      <CoordinatePicker
        value={{ x: 0, y: 0 }}
        onChange={mockOnChange}
      />
    )

    const marker = document.querySelector('.bg-cyan-500')
    const initialStyle = marker?.getAttribute('style')

    rerender(
      <CoordinatePicker
        value={{ x: 5000000, y: 2500000 }}
        onChange={mockOnChange}
      />
    )

    await waitFor(() => {
      const updatedMarker = document.querySelector('.bg-cyan-500')
      const updatedStyle = updatedMarker?.getAttribute('style')
      expect(updatedStyle).not.toBe(initialStyle)
    })
  })

  test('handles drag selection', async () => {
    render(
      <CoordinatePicker
        onChange={mockOnChange}
        snapToGrid={true}
        gridSize={914400}
      />
    )

    const grid = screen.getByRole('button', { hidden: true }).closest('div')
    if (grid) {
      fireEvent.mouseDown(grid, { clientX: 100, clientY: 50 })
      fireEvent.mouseMove(document, { clientX: 200, clientY: 100 })
      fireEvent.mouseUp(document)
    }

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled()
    })
  })
})