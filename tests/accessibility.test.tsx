import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AccessibilityProvider } from '../app/components/accessibility/AccessibilityProvider';
import { AccessibleButton } from '../app/components/ui/AccessibleButton';
import { ResponsiveLayout } from '../app/components/layout/ResponsiveLayout';

expect.extend(toHaveNoViolations);

describe('WCAG 2.1 AA+ Compliance', () => {
  test('meets color contrast requirements', () => {
    const getContrastRatio = (fg: string, bg: string): number => {
      const getLuminance = (color: string): number => {
        const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
        const [r, g, b] = rgb.map(val => {
          val = val / 255;
          return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const l1 = getLuminance(fg);
      const l2 = getLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    const textPrimary = 'rgb(248, 250, 252)';
    const bgPrimary = 'rgb(10, 10, 15)';
    const ratio = getContrastRatio(textPrimary, bgPrimary);
    
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  test('focus indicators meet minimum thickness requirements', () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibleButton>Test Button</AccessibleButton>
      </AccessibilityProvider>
    );

    const button = screen.getByRole('button');
    button.focus();

    const styles = window.getComputedStyle(button);
    const outlineWidth = styles.outlineWidth;
    
    expect(parseInt(outlineWidth)).toBeGreaterThanOrEqual(3);
  });

  test('accessible button has no WCAG violations', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibleButton aria-label="Submit form">Submit</AccessibleButton>
      </AccessibilityProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Screen Reader Support', () => {
  test('includes skip links for keyboard navigation', () => {
    render(
      <AccessibilityProvider>
        <div>Content</div>
      </AccessibilityProvider>
    );

    const skipLinks = document.querySelectorAll('.skip-link');
    expect(skipLinks.length).toBeGreaterThan(0);
    
    const mainContentLink = Array.from(skipLinks).find(
      link => link.textContent?.includes('main content')
    );
    expect(mainContentLink).toBeDefined();
  });

  test('includes ARIA live regions for dynamic updates', () => {
    render(
      <AccessibilityProvider>
        <div>Content</div>
      </AccessibilityProvider>
    );

    const politeRegion = document.getElementById('aria-live-polite');
    const assertiveRegion = document.getElementById('aria-live-assertive');

    expect(politeRegion).toBeDefined();
    expect(assertiveRegion).toBeDefined();
    expect(politeRegion?.getAttribute('aria-live')).toBe('polite');
    expect(assertiveRegion?.getAttribute('aria-live')).toBe('assertive');
  });

  test('buttons have appropriate ARIA attributes', () => {
    const { rerender } = render(
      <AccessibilityProvider>
        <AccessibleButton loading={false}>Submit</AccessibleButton>
      </AccessibilityProvider>
    );

    let button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('false');
    expect(button.getAttribute('aria-disabled')).toBe('false');

    rerender(
      <AccessibilityProvider>
        <AccessibleButton loading={true}>Submit</AccessibleButton>
      </AccessibilityProvider>
    );

    button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('Keyboard Navigation', () => {
  test('Tab key navigates through focusable elements', async () => {
    const user = userEvent.setup();
    
    render(
      <AccessibilityProvider>
        <div>
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
        </div>
      </AccessibilityProvider>
    );

    const buttons = screen.getAllByRole('button');
    
    await user.tab();
    expect(document.activeElement).toBe(buttons[0]);
    
    await user.tab();
    expect(document.activeElement).toBe(buttons[1]);
    
    await user.tab();
    expect(document.activeElement).toBe(buttons[2]);
  });

  test('Escape key closes modals', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    
    render(
      <AccessibilityProvider>
        <div role="dialog" aria-hidden="false">
          <button aria-label="Close dialog" onClick={onClose}>×</button>
          <div>Modal Content</div>
        </div>
      </AccessibilityProvider>
    );

    await user.keyboard('{Escape}');
    
    expect(onClose).toHaveBeenCalled();
  });

  test('keyboard shortcuts work correctly', async () => {
    const user = userEvent.setup();
    const onExport = jest.fn();
    const onImport = jest.fn();
    
    render(
      <AccessibilityProvider>
        <button aria-label="Export" onClick={onExport}>Export</button>
        <button aria-label="Import" onClick={onImport}>Import</button>
      </AccessibilityProvider>
    );

    await user.keyboard('{Control>}e{/Control}');
    expect(onExport).toHaveBeenCalled();

    await user.keyboard('{Control>}i{/Control}');
    expect(onImport).toHaveBeenCalled();
  });
});

describe('Touch Targets', () => {
  test('buttons meet minimum touch target size', () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibleButton size="sm">Small</AccessibleButton>
        <AccessibleButton size="md">Medium</AccessibleButton>
        <AccessibleButton size="lg">Large</AccessibleButton>
      </AccessibilityProvider>
    );

    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(rect.width).toBeGreaterThanOrEqual(44);
    });
  });
});

describe('Responsive Breakpoints', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    });
  });

  test('renders mobile layout at < 768px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });

    const { container } = render(
      <ResponsiveLayout
        editorContent={<div>Editor</div>}
        previewContent={<div>Preview</div>}
      >
        <div>Header</div>
      </ResponsiveLayout>
    );

    const mobileNav = container.querySelector('nav[aria-label="Panel Navigation"]');
    expect(mobileNav).toBeDefined();
  });

  test('renders tablet layout at 768px-1023px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 800,
    });

    const { container } = render(
      <ResponsiveLayout
        editorContent={<div>Editor</div>}
        previewContent={<div>Preview</div>}
      >
        <div>Header</div>
      </ResponsiveLayout>
    );

    const mainContent = container.querySelector('main');
    const gridClasses = mainContent?.querySelector('.grid')?.className;
    expect(gridClasses).toContain('grid-cols-2');
  });

  test('renders desktop layout at 1024px+', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1280,
    });

    const { container } = render(
      <ResponsiveLayout
        editorContent={<div>Editor</div>}
        previewContent={<div>Preview</div>}
      >
        <div>Header</div>
      </ResponsiveLayout>
    );

    const sections = container.querySelectorAll('section[role="region"]');
    expect(sections.length).toBeGreaterThanOrEqual(2);
  });
});

describe('High Contrast Mode', () => {
  test('applies high contrast styles when enabled', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <div className="glass-panel">Content</div>
      </AccessibilityProvider>
    );

    const checkbox = screen.getByLabelText('Toggle high contrast mode');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    });
  });

  test('detects system high contrast preference', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-contrast: high)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(
      <AccessibilityProvider>
        <div>Content</div>
      </AccessibilityProvider>
    );

    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });
});

describe('Reduced Motion Support', () => {
  test('applies reduced motion styles when enabled', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibleButton>Animated Button</AccessibleButton>
      </AccessibilityProvider>
    );

    const checkbox = screen.getByLabelText('Toggle reduced motion');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
    });
  });

  test('detects system reduced motion preference', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(
      <AccessibilityProvider>
        <div>Content</div>
      </AccessibilityProvider>
    );

    expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
  });

  test('disables ripple effects when reduced motion is enabled', () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibleButton>Click Me</AccessibleButton>
      </AccessibilityProvider>
    );

    const button = screen.getByRole('button');
    
    document.documentElement.classList.add('reduced-motion');
    fireEvent.click(button);
    
    const ripples = container.querySelectorAll('.ripple-effect');
    expect(ripples.length).toBe(0);
  });
});

describe('Performance Optimization', () => {
  test('text remains readable at 200% zoom', () => {
    document.documentElement.style.fontSize = '200%';
    
    const { container } = render(
      <AccessibilityProvider>
        <p>Test paragraph</p>
      </AccessibilityProvider>
    );

    const paragraph = container.querySelector('p');
    const styles = window.getComputedStyle(paragraph!);
    const fontSize = parseFloat(styles.fontSize);
    
    expect(fontSize).toBeGreaterThanOrEqual(16);
    
    document.documentElement.style.fontSize = '100%';
  });

  test('no horizontal scrolling at various zoom levels', () => {
    const zoomLevels = ['100%', '150%', '200%'];
    
    zoomLevels.forEach(zoom => {
      document.documentElement.style.fontSize = zoom;
      
      render(
        <AccessibilityProvider>
          <ResponsiveLayout
            editorContent={<div>Editor</div>}
            previewContent={<div>Preview</div>}
          >
            <div>Header</div>
          </ResponsiveLayout>
        </AccessibilityProvider>
      );
      
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
    
    document.documentElement.style.fontSize = '100%';
  });
});