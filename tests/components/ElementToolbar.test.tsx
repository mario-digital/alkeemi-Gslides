import { expect, test, describe, beforeEach } from 'bun:test';
import { render, fireEvent, screen } from '@testing-library/react';
import { ElementToolbar } from '@/components/editor/ElementToolbar';
import '@testing-library/jest-dom';

describe('ElementToolbar', () => {
  beforeEach(() => {
    // Reset any state or mocks before each test
  });

  test('renders all element type buttons', () => {
    render(<ElementToolbar />);
    
    expect(screen.getByTitle('Rectangle')).toBeInTheDocument();
    expect(screen.getByTitle('Text Box')).toBeInTheDocument();
    expect(screen.getByTitle('Image')).toBeInTheDocument();
    expect(screen.getByTitle('Ellipse')).toBeInTheDocument();
    expect(screen.getByTitle('Triangle')).toBeInTheDocument();
    expect(screen.getByTitle('Line')).toBeInTheDocument();
    expect(screen.getByTitle('Arrow')).toBeInTheDocument();
  });

  test('calls onElementCreate when button is clicked', async () => {
    let createdType: string | null = null;
    const handleCreate = (type: string) => {
      createdType = type;
    };
    
    render(<ElementToolbar onElementCreate={handleCreate} />);
    
    const rectangleButton = screen.getByTitle('Rectangle');
    fireEvent.click(rectangleButton);
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(createdType).toBe('rectangle');
  });

  test('shows Elements heading', () => {
    render(<ElementToolbar />);
    expect(screen.getByText('Elements')).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    const { container } = render(<ElementToolbar className="custom-class" />);
    const toolbar = container.firstChild;
    
    expect(toolbar).toHaveClass('custom-class');
    expect(toolbar).toHaveClass('bg-zinc-950/90');
    expect(toolbar).toHaveClass('border-purple-500/20');
  });
});