import { expect, test, describe, beforeEach, mock } from 'bun:test'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AutoCompleteField } from '@/app/components/editor/modals/AutoCompleteField'

describe('AutoCompleteField', () => {
  const mockOnChange = mock(() => {})
  const suggestions = ['shape-1', 'shape-2', 'text-1', 'text-2', 'image-1']
  const recentItems = ['shape-1', 'text-1']

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  test('renders with placeholder', () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        placeholder="Enter ID..."
      />
    )

    expect(screen.getByPlaceholderText('Enter ID...')).toBeDefined()
  })

  test('renders with label', () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        label="Object ID"
      />
    )

    expect(screen.getByText('Object ID')).toBeDefined()
  })

  test('shows suggestions on focus', async () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined()
    })
  })

  test('filters suggestions based on input', async () => {
    const user = userEvent.setup()
    
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'shape')

    await waitFor(() => {
      const listItems = screen.getAllByRole('option')
      expect(listItems.length).toBe(2)
      expect(screen.getByText('shape-1')).toBeDefined()
      expect(screen.getByText('shape-2')).toBeDefined()
    })
  })

  test('shows recent items when available', async () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
        recentItems={recentItems}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('Recent')).toBeDefined()
      const recentTags = screen.getAllByText('recent')
      expect(recentTags.length).toBe(2)
    })
  })

  test('handles keyboard navigation with arrow keys', async () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    let firstOption = screen.getAllByRole('option')[0]
    expect(firstOption.getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    let secondOption = screen.getAllByRole('option')[1]
    expect(secondOption.getAttribute('aria-selected')).toBe('true')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    firstOption = screen.getAllByRole('option')[0]
    expect(firstOption.getAttribute('aria-selected')).toBe('true')
  })

  test('selects item on enter key', async () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(suggestions[0])
    })
  })

  test('closes dropdown on escape key', async () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    fireEvent.keyDown(input, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).toBeNull()
    })
  })

  test('selects item on click', async () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    const firstOption = screen.getAllByRole('option')[0]
    fireEvent.click(firstOption)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(suggestions[0])
    })
  })

  test('highlights matching text in suggestions', async () => {
    const user = userEvent.setup()
    
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'text')

    await waitFor(() => {
      const highlighted = document.querySelectorAll('.text-cyan-400')
      expect(highlighted.length).toBeGreaterThan(0)
      expect(highlighted[0].textContent).toBe('text')
    })
  })

  test('fuzzy search finds partial matches', async () => {
    const user = userEvent.setup()
    
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={['createShape', 'updateShape', 'deleteShape']}
        fuzzySearch={true}
      />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'csh')

    await waitFor(() => {
      const options = screen.getAllByRole('option')
      expect(options.length).toBeGreaterThan(0)
      expect(screen.getByText(/createShape/)).toBeDefined()
    })
  })

  test('closes dropdown on outside click', async () => {
    const { container } = render(
      <div>
        <AutoCompleteField
          value=""
          onChange={mockOnChange}
          suggestions={suggestions}
        />
        <button>Outside Button</button>
      </div>
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    const outsideButton = screen.getByText('Outside Button')
    fireEvent.mouseDown(outsideButton)

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).toBeNull()
    })
  })

  test('has proper accessibility attributes', () => {
    render(
      <AutoCompleteField
        value=""
        onChange={mockOnChange}
        suggestions={suggestions}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input.getAttribute('aria-autocomplete')).toBe('list')
    expect(input.getAttribute('aria-expanded')).toBe('false')

    fireEvent.focus(input)
    
    waitFor(() => {
      expect(input.getAttribute('aria-expanded')).toBe('true')
      expect(input.getAttribute('aria-controls')).toBe('autocomplete-list')
    })
  })
})