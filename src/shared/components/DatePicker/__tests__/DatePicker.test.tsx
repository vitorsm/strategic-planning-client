import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with label', () => {
      render(<DatePicker label="Due Date" onChange={mockOnChange} />);
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    });

    it('renders with required indicator when required is true', () => {
      render(<DatePicker label="Due Date" required onChange={mockOnChange} />);
      const label = screen.getByText(/Due Date/);
      expect(label).toBeInTheDocument();
    });

    it('renders without required indicator when required is false', () => {
      render(<DatePicker label="Due Date" required={false} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).not.toHaveAttribute('required');
    });

    it('renders with custom className', () => {
      const { container } = render(
        <DatePicker label="Due Date" className="custom-class" onChange={mockOnChange} />
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<DatePicker label="Due Date" value="2024-12-31" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date') as HTMLInputElement;
      expect(input.value).toBe('2024-12-31');
    });

    it('renders with placeholder', () => {
      render(<DatePicker label="Due Date" placeholder="Select date" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).toHaveAttribute('placeholder', 'Select date');
    });
  });

  describe('interaction', () => {
    it('calls onChange when date is selected', async () => {
      render(<DatePicker label="Due Date" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      
      await userEvent.type(input, '2024-12-31');
      
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('handles disabled state', () => {
      render(<DatePicker label="Due Date" disabled onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).toBeDisabled();
    });

    it('accepts custom id', () => {
      render(<DatePicker label="Due Date" id="custom-id" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('accessibility', () => {
    it('associates label with input', () => {
      render(<DatePicker label="Due Date" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).toBeInTheDocument();
    });

    it('generates unique id when not provided', () => {
      const { container } = render(<DatePicker label="Due Date" onChange={mockOnChange} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('id');
    });

    it('uses provided id over generated one', () => {
      render(<DatePicker label="Due Date" id="my-date" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).toHaveAttribute('id', 'my-date');
    });
  });

  describe('validation', () => {
    it('applies required attribute when required is true', () => {
      render(<DatePicker label="Due Date" required onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).toHaveAttribute('required');
    });

    it('does not apply required attribute when required is false', () => {
      render(<DatePicker label="Due Date" required={false} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Due Date');
      expect(input).not.toHaveAttribute('required');
    });
  });

  describe('props forwarding', () => {
    it('forwards additional HTML input attributes', () => {
      render(
        <DatePicker 
          label="Due Date" 
          onChange={mockOnChange}
          min="2024-01-01"
          max="2024-12-31"
          data-testid="date-picker"
        />
      );
      const input = screen.getByTestId('date-picker');
      expect(input).toHaveAttribute('min', '2024-01-01');
      expect(input).toHaveAttribute('max', '2024-12-31');
    });
  });
});

