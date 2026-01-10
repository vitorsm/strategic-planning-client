import styled, { css } from 'styled-components';
import { colors } from '../../styles/colors';

export const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DropdownLabel = styled.label<{ $required?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  
  ${props => props.$required && css`
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

export const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DropdownInputRow = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background-color: ${colors.inputBg};
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus-within {
    box-shadow: 0 0 0 2px ${colors.primaryRing};
    border-color: ${colors.primary};
  }
`;

export const DropdownIconLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 12px;
  color: ${colors.muted};
  pointer-events: none;
  flex-shrink: 0;
  
  span.material-symbols-outlined {
    font-size: 20px;
  }
`;

export const DropdownClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  padding: 0;
  background: ${colors.surface2};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: ${colors.muted};
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${colors.border};
    color: ${colors.text};
  }

  span.material-symbols-outlined {
    font-size: 16px;
  }
`;

export const DropdownInput = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 16px;
  border: none;
  background-color: transparent;
  color: ${colors.text};
  font-size: 16px;
  cursor: pointer;
  min-width: 0;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
  background-color: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

export const DropdownItem = styled.div<{ $isSelected?: boolean; $depth?: number }>`
  padding: 12px 16px;
  padding-left: ${props => 16 + (props.$depth || 0) * 20}px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  color: ${props => props.$isSelected ? colors.primary : colors.text};
  background-color: ${props => props.$isSelected ? colors.primaryRing : 'transparent'};

  &:hover {
    background-color: ${props => props.$isSelected ? colors.primaryRing : colors.surface2};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:only-child {
    border-radius: 8px;
  }
`;

export const DropdownEmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: ${colors.muted};
  font-size: 14px;
`;

// Tree-specific styles
export const TreeItemRow = styled.div<{ $isSelected?: boolean; $depth?: number }>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  padding-left: ${props => 12 + (props.$depth || 0) * 20}px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  color: ${props => props.$isSelected ? colors.primary : colors.text};
  background-color: ${props => props.$isSelected ? colors.primaryRing : 'transparent'};

  &:hover {
    background-color: ${props => props.$isSelected ? colors.primaryRing : colors.surface2};
  }
`;

export const TreeItemExpandIcon = styled.button<{ $isExpanded?: boolean; $hasChildren?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-right: 8px;
  background: transparent;
  border: none;
  cursor: ${props => props.$hasChildren ? 'pointer' : 'default'};
  color: ${colors.muted};
  border-radius: 4px;
  transition: all 0.15s ease;
  visibility: ${props => props.$hasChildren ? 'visible' : 'hidden'};

  &:hover {
    background-color: ${props => props.$hasChildren ? colors.surface2 : 'transparent'};
    color: ${props => props.$hasChildren ? colors.text : colors.muted};
  }

  span.material-symbols-outlined {
    font-size: 18px;
    transform: rotate(${props => props.$isExpanded ? '90deg' : '0deg'});
    transition: transform 0.2s ease;
  }
`;

export const TreeItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const TreeItemLabel = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TreeItemBadge = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${colors.surface2};
  color: ${colors.muted};
  margin-left: auto;
  flex-shrink: 0;
`;

export const TreeItemIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.$color ? `${props.$color}20` : colors.surface2};
  color: ${props => props.$color || colors.muted};
  flex-shrink: 0;

  span.material-symbols-outlined {
    font-size: 16px;
  }
`;
