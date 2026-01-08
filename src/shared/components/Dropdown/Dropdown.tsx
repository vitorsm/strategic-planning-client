import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../Icon';
import {
  DropdownContainer,
  DropdownLabel,
  DropdownWrapper,
  DropdownInputRow,
  DropdownIconLeft,
  DropdownClearButton,
  DropdownInput,
  DropdownMenu,
  DropdownItem,
  DropdownEmptyState,
  TreeItemRow,
  TreeItemExpandIcon,
  TreeItemContent,
  TreeItemLabel,
} from './styles';

export type DropdownProps<T> = {
  /** Array of options to display in the dropdown */
  options: T[];
  /** Currently selected value */
  selectedValue: T | null;
  /** Callback when an option is selected */
  onSelect: (value: T | null) => void;
  /** Function to get the display label from an option */
  getOptionLabel: (option: T) => string;
  /** Function to get a unique key for each option */
  getOptionKey: (option: T) => string;
  /** Function to get children of an option (enables tree mode) */
  getOptionChildren?: (option: T) => T[];
  /** Optional label for the dropdown */
  label?: string;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Whether to show the search icon on the left */
  showSearchIcon?: boolean;
  /** Icon name for the left icon (defaults to 'search') */
  leftIcon?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom render function for options */
  renderOption?: (option: T, isSelected: boolean, depth: number) => React.ReactNode;
  /** Empty state message when no options */
  emptyMessage?: string;
  /** Whether to expand all tree nodes by default */
  defaultExpandAll?: boolean;
  /** Whether to show a clear button when a value is selected */
  clearable?: boolean;
};

export const Dropdown = <T,>({
  options,
  selectedValue,
  onSelect,
  getOptionLabel,
  getOptionKey,
  getOptionChildren,
  label,
  placeholder = 'Select an option...',
  showSearchIcon = true,
  leftIcon = 'search',
  required = false,
  disabled = false,
  className,
  renderOption,
  emptyMessage = 'No options available',
  defaultExpandAll = false,
  clearable = true,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = selectedValue ? getOptionLabel(selectedValue) : '';
  const isTreeMode = Boolean(getOptionChildren);

  // Initialize expanded state when defaultExpandAll changes or dropdown opens
  useEffect(() => {
    if (defaultExpandAll && isTreeMode) {
      const getAllKeys = (items: T[]): string[] => {
        const keys: string[] = [];
        items.forEach(item => {
          keys.push(getOptionKey(item));
          const children = getOptionChildren?.(item) || [];
          if (children.length > 0) {
            keys.push(...getAllKeys(children));
          }
        });
        return keys;
      };
      setExpandedKeys(new Set(getAllKeys(options)));
    }
  }, [defaultExpandAll, isTreeMode, options, getOptionKey, getOptionChildren]);

  // Flatten tree for searching
  const flattenTree = useCallback((items: T[], depth = 0): { item: T; depth: number }[] => {
    const result: { item: T; depth: number }[] = [];
    items.forEach(item => {
      result.push({ item, depth });
      if (getOptionChildren) {
        const children = getOptionChildren(item);
        if (children.length > 0) {
          result.push(...flattenTree(children, depth + 1));
        }
      }
    });
    return result;
  }, [getOptionChildren]);

  // Filter options based on search
  const filterOptions = useCallback((items: T[]): T[] => {
    if (!searchValue) return items;
    
    const searchLower = searchValue.toLowerCase();
    
    const filterRecursive = (items: T[]): T[] => {
      return items.filter(item => {
        const labelMatches = getOptionLabel(item).toLowerCase().includes(searchLower);
        if (getOptionChildren) {
          const children = getOptionChildren(item);
          const filteredChildren = filterRecursive(children);
          return labelMatches || filteredChildren.length > 0;
        }
        return labelMatches;
      });
    };
    
    return filterRecursive(items);
  }, [searchValue, getOptionLabel, getOptionChildren]);

  const filteredOptions = filterOptions(options);

  // Expand all when searching in tree mode
  useEffect(() => {
    if (searchValue && isTreeMode) {
      const flatItems = flattenTree(options);
      setExpandedKeys(new Set(flatItems.map(({ item }) => getOptionKey(item))));
    }
  }, [searchValue, isTreeMode, flattenTree, options, getOptionKey]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchValue('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchValue('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option: T) => {
    onSelect(option);
    setIsOpen(false);
    setSearchValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchValue('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setSearchValue('');
  };

  const handleToggleExpand = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isOptionSelected = (option: T): boolean => {
    if (!selectedValue) return false;
    return getOptionKey(option) === getOptionKey(selectedValue);
  };

  // Render flat list items
  const renderFlatItems = () => {
    return filteredOptions.map((option) => {
      const isSelected = isOptionSelected(option);
      return (
        <DropdownItem
          key={getOptionKey(option)}
          $isSelected={isSelected}
          onClick={() => handleOptionSelect(option)}
        >
          {renderOption ? renderOption(option, isSelected, 0) : getOptionLabel(option)}
        </DropdownItem>
      );
    });
  };

  // Render tree items recursively
  const renderTreeItems = (items: T[], depth = 0): React.ReactNode[] => {
    const searchLower = searchValue.toLowerCase();
    
    return items.flatMap((option) => {
      const key = getOptionKey(option);
      const isSelected = isOptionSelected(option);
      const children = getOptionChildren?.(option) || [];
      const hasChildren = children.length > 0;
      const isExpanded = expandedKeys.has(key);
      const labelMatches = getOptionLabel(option).toLowerCase().includes(searchLower);
      
      // Filter children recursively
      const filteredChildren = searchValue
        ? children.filter(child => {
            const childLabel = getOptionLabel(child).toLowerCase();
            const childMatches = childLabel.includes(searchLower);
            const grandChildren = getOptionChildren?.(child) || [];
            const hasMatchingDescendants = grandChildren.some(gc => 
              getOptionLabel(gc).toLowerCase().includes(searchLower)
            );
            return childMatches || hasMatchingDescendants;
          })
        : children;

      // Skip if neither this item nor its descendants match
      if (searchValue && !labelMatches && filteredChildren.length === 0) {
        return [];
      }

      const result: React.ReactNode[] = [
        <TreeItemRow
          key={key}
          $isSelected={isSelected}
          $depth={depth}
          onClick={() => handleOptionSelect(option)}
        >
          <TreeItemExpandIcon
            $isExpanded={isExpanded}
            $hasChildren={hasChildren}
            onClick={(e) => hasChildren && handleToggleExpand(e, key)}
            type="button"
            aria-label={hasChildren ? (isExpanded ? 'Collapse' : 'Expand') : undefined}
          >
            <Icon name="chevron_right" />
          </TreeItemExpandIcon>
          <TreeItemContent>
            {renderOption ? (
              renderOption(option, isSelected, depth)
            ) : (
              <TreeItemLabel>{getOptionLabel(option)}</TreeItemLabel>
            )}
          </TreeItemContent>
        </TreeItemRow>
      ];

      if (hasChildren && isExpanded) {
        result.push(...renderTreeItems(filteredChildren, depth + 1));
      }

      return result;
    });
  };

  const hasFilteredOptions = isTreeMode 
    ? renderTreeItems(filteredOptions).length > 0 
    : filteredOptions.length > 0;

  const showClearButton = clearable && selectedValue !== null && !isOpen;

  return (
    <DropdownContainer className={className}>
      {label && <DropdownLabel $required={required}>{label}</DropdownLabel>}
      <DropdownWrapper ref={wrapperRef}>
        <DropdownInputRow>
          {showSearchIcon && (
            <DropdownIconLeft>
              <Icon name={leftIcon} />
            </DropdownIconLeft>
          )}
          <DropdownInput
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={isOpen ? searchValue : displayValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={!isOpen}
          />
          {showClearButton && (
            <DropdownClearButton
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <Icon name="close" />
            </DropdownClearButton>
          )}
        </DropdownInputRow>
        <DropdownMenu $isOpen={isOpen}>
          {!hasFilteredOptions ? (
            <DropdownEmptyState>{emptyMessage}</DropdownEmptyState>
          ) : isTreeMode ? (
            renderTreeItems(filteredOptions)
          ) : (
            renderFlatItems()
          )}
        </DropdownMenu>
      </DropdownWrapper>
    </DropdownContainer>
  );
};
