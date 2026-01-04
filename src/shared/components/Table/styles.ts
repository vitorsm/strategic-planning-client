import styled, { css } from 'styled-components';
import { colors } from '../../styles/colors';

export const TableWrap = styled.div`
  background: ${colors.surface};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const TableOverflow = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${colors.surface2};
`;

export const TableHeadRow = styled.tr`
  border-bottom: 1px solid ${colors.border};
`;

export const TableHeadCell = styled.th<{ $width?: string }>`
  padding: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.muted};
  width: ${({ $width }) => $width || 'auto'};

  &:first-child {
    padding-left: 24px;
  }
`;

export const TableBody = styled.tbody`
  font-size: 14px;
`;

export const TableRow = styled.tr<{ $selected?: boolean; $isChild?: boolean; $isParentBorder?: boolean }>`
  cursor: pointer;
  transition: background-color 150ms ease;

  ${({ $selected }) =>
    $selected
      ? css`
          background: rgba(19, 127, 236, 0.1);
          border-left: 3px solid ${colors.primary};
        `
      : css`
          &:hover {
            background: ${colors.surface2};
          }
        `}

  ${({ $isParentBorder }) =>
    $isParentBorder &&
    css`
      border-top: 2px solid ${colors.border};
    `}

  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

export const TableCell = styled.td`
  padding: 16px;

  &:first-child {
    padding-left: 24px;
  }
`;

// Pagination Styles
export const PaginationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid ${colors.border};
  background: ${colors.surface2};
`;

export const PaginationInfo = styled.span`
  font-size: 12px;
  color: ${colors.muted};
`;

export const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const PaginationButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background: transparent;
  color: ${colors.muted};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: all 150ms ease;

  .material-symbols-outlined {
    font-size: 18px;
  }

  ${({ $disabled }) =>
    !$disabled &&
    css`
      &:hover {
        background: ${colors.surface2};
        color: ${colors.white};
      }
    `}
`;

// Loading State
export const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
  color: ${colors.muted};
  font-size: 14px;
`;

// Empty State
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px;
  text-align: center;

  .material-symbols-outlined {
    font-size: 48px;
    color: ${colors.muted2};
    margin-bottom: 16px;
  }
`;

export const EmptyStateTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
`;

export const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.muted};
`;

