import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  it('renders with default placeholder', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchInput placeholder="Search teams..." />);
    expect(screen.getByPlaceholderText('Search teams...')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<SearchInput onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays the value prop', () => {
    render(<SearchInput value="initial value" onChange={() => {}} />);
    expect(screen.getByDisplayValue('initial value')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(<SearchInput icon="filter_list" />);
    expect(screen.getByText('filter_list')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SearchInput className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

