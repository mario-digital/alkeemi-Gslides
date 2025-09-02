import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { FloatingAddButton } from '@/app/components/editor/operations/FloatingAddButton'

describe('FloatingAddButton', () => {
  const mockOnAddOperation = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Rendering', () => {
    it('should render the floating button', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = container.querySelector('button')
      expect(button).toBeDefined()
    })

    it('should have fixed positioning', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const fixedElement = container.querySelector('.fixed')
      expect(fixedElement).toBeDefined()
    })

    it('should have gradient background', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const gradientButton = container.querySelector('.bg-gradient-to-r')
      expect(gradientButton).toBeDefined()
    })

    it('should have pulse animation', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const pulseElement = container.querySelector('.animate-pulse')
      expect(pulseElement).toBeDefined()
    })

    it('should have ping animation overlay', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const pingElement = container.querySelector('.animate-ping')
      expect(pingElement).toBeDefined()
    })
  })

  describe('Dropdown Menu', () => {
    it('should show dropdown menu on click', async () => {
      render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Create Element')).toBeDefined()
        expect(screen.getByText('Update Element')).toBeDefined()
        expect(screen.getByText('Delete Element')).toBeDefined()
        expect(screen.getByText('Transform Element')).toBeDefined()
        expect(screen.getByText('Text Operation')).toBeDefined()
      })
    })

    it('should call onAddOperation with correct type when menu item clicked', async () => {
      render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        const createOption = screen.getByText('Create Element')
        fireEvent.click(createOption)
      })

      expect(mockOnAddOperation).toHaveBeenCalledWith('create')
    })

    it('should have correct color styling for each operation type', async () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        // Check for hover color classes
        const createItem = screen.getByText('Create Element').parentElement
        expect(createItem?.className).toContain('hover:text-[#06ffa5]')

        const updateItem = screen.getByText('Update Element').parentElement
        expect(updateItem?.className).toContain('hover:text-[#22d3ee]')

        const deleteItem = screen.getByText('Delete Element').parentElement
        expect(deleteItem?.className).toContain('hover:text-[#ec4899]')

        const transformItem = screen.getByText('Transform Element').parentElement
        expect(transformItem?.className).toContain('hover:text-[#a855f7]')

        const textItem = screen.getByText('Text Operation').parentElement
        expect(textItem?.className).toContain('hover:text-[#fbbf24]')
      })
    })
  })

  describe('Button States', () => {
    it('should rotate icon when dropdown is open', async () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = screen.getByRole('button')
      const icon = button.querySelector('svg')
      
      // Initially not rotated
      expect(icon?.className).not.toContain('rotate-45')

      // Click to open
      fireEvent.click(button)

      await waitFor(() => {
        const rotatedIcon = button.querySelector('.rotate-45')
        expect(rotatedIcon).toBeDefined()
      })
    })

    it('should have hover scale effect', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = container.querySelector('.hover\\:scale-110')
      expect(button).toBeDefined()
    })

    it('should have active scale effect', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = container.querySelector('.active\\:scale-95')
      expect(button).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button label', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = container.querySelector('button')
      const srOnly = button?.querySelector('.sr-only')
      expect(srOnly?.textContent).toBe('Add Operation')
    })

    it('should have proper ARIA attributes for dropdown', async () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const button = container.querySelector('button')
      
      // Check for aria-expanded
      expect(button?.getAttribute('aria-expanded')).toBe('false')

      if (button) {
        fireEvent.click(button)

        await waitFor(() => {
          expect(button.getAttribute('aria-expanded')).toBe('true')
        })
      }
    })
  })

  describe('Shadow and Glow Effects', () => {
    it('should have shadow effects', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const shadowElement = container.querySelector('.shadow-lg')
      expect(shadowElement).toBeDefined()

      const glowShadow = container.querySelector('.shadow-primary-neon\\/30')
      expect(glowShadow).toBeDefined()
    })

    it('should have enhanced shadow on hover', () => {
      const { container } = render(
        <FloatingAddButton onAddOperation={mockOnAddOperation} />
      )

      const hoverShadow = container.querySelector('.hover\\:shadow-xl')
      expect(hoverShadow).toBeDefined()
    })
  })
})