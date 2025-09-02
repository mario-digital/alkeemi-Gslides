import { expect, test, describe, beforeEach } from 'bun:test';
import { render, fireEvent, screen } from '@testing-library/react';
import { ElementToolbar } from '@/components/editor/ElementToolbar';
import '@testing-library/jest-dom';

describe('ElementToolbar', () => {
  beforeEach(() => {
    // Reset any state or mocks before each test
  });

  test('renders all element type buttons', () => {
    const { container } = render(<ElementToolbar />);
    
    // Use container.querySelector to avoid duplicate issues
    expect(container.querySelector('button[title="Rectangle"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Text Box"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Image"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Ellipse"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Triangle"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Line"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Arrow"]')).toBeInTheDocument();
  });

  test('calls onElementCreate when button is clicked', async () => {
    let createdType: string | null = null;
    const handleCreate = (type: string) => {
      createdType = type;
    };
    
    const { container } = render(<ElementToolbar onElementCreate={handleCreate} />);
    
    const rectangleButton = container.querySelector('button[title="Rectangle"]');
    if (rectangleButton) {
      fireEvent.click(rectangleButton);
    }
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(createdType).toBe('rectangle');
  });

  test('shows Elements heading', () => {
    const { container } = render(<ElementToolbar />);
    expect(container.querySelector('h3')).toHaveTextContent('Elements');
  });

  test('applies correct styling classes', () => {
    const { container } = render(<ElementToolbar className="custom-class" />);
    const toolbar = container.firstChild;
    
    expect(toolbar).toHaveClass('custom-class');
    expect(toolbar).toHaveClass('bg-zinc-950/90');
    expect(toolbar).toHaveClass('border-purple-500/20');
  });
});