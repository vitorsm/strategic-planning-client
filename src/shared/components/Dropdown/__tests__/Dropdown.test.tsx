import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../Dropdown';

interface Option {
  id: string;
  name: string;
  children?: Option[];
}

const mockOptions: Option[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

const mockTreeOptions: Option[] = [
  {
    id: '1',
    name: 'Parent 1',
    children: [
      { id: '1-1', name: 'Child 1-1', children: [] },
      { id: '1-2', name: 'Child 1-2', children: [] },
    ],
  },
  {
    id: '2',
    name: 'Parent 2',
    children: [
      {
        id: '2-1',
        name: 'Child 2-1',
        children: [
          { id: '2-1-1', name: 'Grandchild 2-1-1', children: [] },
        ],
      },
    ],
  },
  { id: '3', name: 'Parent 3 (No Children)', children: [] },
];

const defaultProps = {
  options: mockOptions,
  selectedValue: null,
  onSelect: jest.fn(),
  getOptionLabel: (option: Option) => option.name,
  getOptionKey: (option: Option) => option.id,
  placeholder: 'Select an option...',
};

const treeProps = {
  ...defaultProps,
  options: mockTreeOptions,
  getOptionChildren: (option: Option) => option.children || [],
};

describe('Dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Flat list mode', () => {
    it('renders with placeholder when no value is selected', () => {
      render(<Dropdown {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('renders with label when provided', () => {
      render(<Dropdown {...defaultProps} label="Test Label" />);
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('displays selected value', () => {
      render(
        <Dropdown
          {...defaultProps}
          selectedValue={mockOptions[0]}
        />
      );
      
      const input = screen.getByPlaceholderText('Select an option...');
      expect(input).toHaveValue('Option 1');
    });

    it('opens dropdown menu on click', () => {
      render(<Dropdown {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      expect(screen.getByText('Option 1')).toBeVisible();
      expect(screen.getByText('Option 2')).toBeVisible();
      expect(screen.getByText('Option 3')).toBeVisible();
    });

    it('calls onSelect when an option is clicked', () => {
      const onSelect = jest.fn();
      render(<Dropdown {...defaultProps} onSelect={onSelect} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      fireEvent.click(screen.getByText('Option 2'));
      
      expect(onSelect).toHaveBeenCalledWith(mockOptions[1]);
    });

    it('filters options based on search input', () => {
      render(<Dropdown {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'Option 1' } });
      
      expect(screen.getByText('Option 1')).toBeVisible();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    });

    it('shows empty message when no options match search', () => {
      render(<Dropdown {...defaultProps} emptyMessage="No results found" />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'xyz' } });
      
      expect(screen.getByText('No results found')).toBeVisible();
    });

    it('closes dropdown on Escape key', () => {
      render(<Dropdown {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      expect(screen.getByText('Option 1')).toBeVisible();
      
      fireEvent.keyDown(input, { key: 'Escape' });
      
      expect(screen.queryByText('Option 1')).not.toBeVisible();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Dropdown {...defaultProps} disabled />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      expect(input).toBeDisabled();
    });

    it('hides search icon when showSearchIcon is false', () => {
      const { container } = render(<Dropdown {...defaultProps} showSearchIcon={false} />);
      
      const leftIconWrapper = container.querySelector('[class*="DropdownIconLeft"]');
      expect(leftIconWrapper).toBeNull();
    });

    it('uses custom renderOption when provided', () => {
      const renderOption = (option: Option) => (
        <span data-testid={`custom-${option.id}`}>{option.name} (Custom)</span>
      );
      
      render(<Dropdown {...defaultProps} renderOption={renderOption} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      expect(screen.getByTestId('custom-1')).toBeInTheDocument();
      expect(screen.getByText('Option 1 (Custom)')).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <Dropdown {...defaultProps} />
        </div>
      );
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      expect(screen.getByText('Option 1')).toBeVisible();
      
      fireEvent.mouseDown(screen.getByTestId('outside'));
      
      expect(screen.queryByText('Option 1')).not.toBeVisible();
    });
  });

  describe('Tree mode', () => {
    it('renders tree items with expand icons', () => {
      render(<Dropdown {...treeProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      expect(screen.getByText('Parent 1')).toBeVisible();
      expect(screen.getByText('Parent 2')).toBeVisible();
      expect(screen.getByText('Parent 3 (No Children)')).toBeVisible();
    });

    it('expands tree item when expand icon is clicked', () => {
      render(<Dropdown {...treeProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      // Children should not be visible initially
      expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();
      
      // Click expand button for Parent 1
      const expandButtons = screen.getAllByRole('button', { name: 'Expand' });
      const parent1ExpandBtn = expandButtons[0];
      fireEvent.click(parent1ExpandBtn);
      
      // Children should now be visible
      expect(screen.getByText('Child 1-1')).toBeVisible();
      expect(screen.getByText('Child 1-2')).toBeVisible();
    });

    it('collapses expanded tree item when expand icon is clicked again', () => {
      render(<Dropdown {...treeProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      // Expand Parent 1
      const expandButtons = screen.getAllByRole('button', { name: 'Expand' });
      const parent1ExpandBtn = expandButtons[0];
      fireEvent.click(parent1ExpandBtn);
      
      expect(screen.getByText('Child 1-1')).toBeVisible();
      
      // Collapse Parent 1 (button is now labeled "Collapse")
      const collapseButton = screen.getAllByRole('button', { name: 'Collapse' })[0];
      fireEvent.click(collapseButton);
      
      expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();
    });

    it('selects child item when clicked', () => {
      const onSelect = jest.fn();
      render(<Dropdown {...treeProps} onSelect={onSelect} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      // Expand Parent 1
      const expandButtons = screen.getAllByRole('button', { name: 'Expand' });
      fireEvent.click(expandButtons[0]);
      
      // Click on Child 1-1
      fireEvent.click(screen.getByText('Child 1-1'));
      
      expect(onSelect).toHaveBeenCalledWith(mockTreeOptions[0].children![0]);
    });

    it('expands all nodes when searching', () => {
      render(<Dropdown {...treeProps} />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      // Type search that matches a grandchild
      fireEvent.change(input, { target: { value: 'Grandchild' } });
      
      // Grandchild should be visible (tree should auto-expand)
      expect(screen.getByText('Grandchild 2-1-1')).toBeVisible();
    });

    it('renders all nodes expanded when defaultExpandAll is true', () => {
      render(<Dropdown {...treeProps} defaultExpandAll />);
      
      const input = screen.getByPlaceholderText('Select an option...');
      fireEvent.click(input);
      
      // All children should be visible
      expect(screen.getByText('Child 1-1')).toBeVisible();
      expect(screen.getByText('Child 1-2')).toBeVisible();
      expect(screen.getByText('Child 2-1')).toBeVisible();
      expect(screen.getByText('Grandchild 2-1-1')).toBeVisible();
    });

    it('displays selected tree item value in input', () => {
      const selectedChild = mockTreeOptions[0].children![0];
      render(
        <Dropdown
          {...treeProps}
          selectedValue={selectedChild}
        />
      );
      
      const input = screen.getByPlaceholderText('Select an option...');
      expect(input).toHaveValue('Child 1-1');
    });
  });
});
