import React, { useCallback, useEffect, useState } from 'react';
import {
  TableWrap,
  TableOverflow,
  StyledTable,
  TableHead,
  TableHeadRow,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  PaginationWrap,
  PaginationInfo,
  PaginationButtons,
  PaginationButton,
  LoadingOverlay,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from './styles';
import { TableProps } from './types';

export function Table({
  columns,
  data,
  renderRow,
  onRowClick,
  isLoading = false,
  emptyIcon = 'inbox',
  emptyTitle = 'No items found',
  emptyText = 'Create your first item to get started',
  showPagination = true,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  getRowKey,
  isRowSelected,
  getRowProps,
}: TableProps) {
  const [displayTotal, setDisplayTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showingStart, setShowingStart] = useState(0);
  const [showingEnd, setShowingEnd] = useState(0);
  const [dataToDisplay, setDataToDisplay] = useState(data);

  useEffect(() => {
    setDisplayTotal(data.length);
    setTotalPages(Math.ceil(displayTotal / pageSize));
    setShowingStart(data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0);
    setShowingEnd(Math.min(currentPage * pageSize, displayTotal));
    setDataToDisplay(data.slice((currentPage - 1) * pageSize, currentPage * pageSize));
  }, [data, currentPage, pageSize, displayTotal]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const defaultGetRowKey = useCallback(
    (_item: any, index: number) => index,
    []
  );

  const rowKeyGetter = getRowKey ?? defaultGetRowKey;

  const renderDefaultRow = (item: any, index: number) => {
    const rowProps = getRowProps?.(item, index) ?? {};
    const selected = isRowSelected?.(item, index) ?? false;

    return (
      <TableRow
        key={rowKeyGetter(item, index)}
        $selected={selected}
        {...rowProps}
        onClick={() => onRowClick?.(item, index)}
      >
        {columns.map((column) => {
          return (
            <TableCell key={column.key}>
              {column.render
                ? column.render(item, index)
                : (item as Record<string, unknown>)[column.key] as React.ReactNode}
            </TableCell>
          )
        })}
      </TableRow>
    );
  };

  return (
    <TableWrap>
      <TableOverflow>
        <StyledTable>
          <TableHead>
            <TableHeadRow>
              {columns.map((column) => (
                <TableHeadCell key={column.key} $width={column.width}>
                  {column.label}
                </TableHeadCell>
              ))}
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <tr>
                <TableCell colSpan={columns.length}>
                  <LoadingOverlay>Loading...</LoadingOverlay>
                </TableCell>
              </tr>
            ) : dataToDisplay.length === 0 ? (
              <tr>
                <TableCell colSpan={columns.length}>
                  <EmptyState>
                    <span className="material-symbols-outlined">{emptyIcon}</span>
                    <EmptyStateTitle>{emptyTitle}</EmptyStateTitle>
                    <EmptyStateText>{emptyText}</EmptyStateText>
                  </EmptyState>
                </TableCell>
              </tr>
            ) : renderRow ? (
              dataToDisplay.map((item, index) => renderRow(item, index, onRowClick))
            ) : (
              dataToDisplay.map((item, index) => renderDefaultRow(item, index))
            )}
          </TableBody>
        </StyledTable>
      </TableOverflow>
      {showPagination && !isLoading && dataToDisplay.length > 0 && (
        <PaginationWrap>
          <PaginationInfo>
            Showing {showingStart} to {showingEnd} of {displayTotal} items
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              $disabled={currentPage <= 1}
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </PaginationButton>
            <PaginationButton
              $disabled={currentPage >= totalPages}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </PaginationButton>
          </PaginationButtons>
        </PaginationWrap>
      )}
    </TableWrap>
  );
}

