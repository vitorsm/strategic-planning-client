import React from 'react';

import { SearchInputWrap, StyledSearchInput, MaterialIcon } from './styles';

export type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  className?: string;
  icon?: string;
  onOkPress?: () => void;
};

export const SearchInput = ({
  className,
  icon = 'search',
  placeholder = 'Search...',
  onOkPress,
  onKeyDown,
  ...inputProps
}: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onOkPress) {
      onOkPress();
    }
    onKeyDown?.(e);
  };

  return (
    <SearchInputWrap className={className}>
      <MaterialIcon>{icon}</MaterialIcon>
      <StyledSearchInput
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        {...inputProps}
      />
    </SearchInputWrap>
  );
};

