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
  TreeExpandButton,
  TableCellTitle,
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
  isTreeTable = false,
  childrenKey = 'children',
  defaultExpandedIds = [],
}: TableProps) {
  const [displayTotal, setDisplayTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showingStart, setShowingStart] = useState(0);
  const [showingEnd, setShowingEnd] = useState(0);
  const [dataToDisplay, setDataToDisplay] = useState(data);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));

  useEffect(() => {
    // For tree tables, we count only root items for pagination
    const rootItems = data;
    setDisplayTotal(rootItems.length);
    setTotalPages(Math.ceil(rootItems.length / pageSize));
    setShowingStart(rootItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0);
    setShowingEnd(Math.min(currentPage * pageSize, rootItems.length));
    setDataToDisplay(rootItems.slice((currentPage - 1) * pageSize, currentPage * pageSize));
  }, [data, currentPage, pageSize]);

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

  const toggleExpand = useCallback((itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const hasChildren = useCallback((item: any): boolean => {
    const children = item[childrenKey];
    return Array.isArray(children) && children.length > 0;
  }, [childrenKey]);

  const renderTreeRow = useCallback(
    (item: any, index: number, depth: number = 0, parentKey: string = ''): React.ReactNode[] => {
      const rowProps = getRowProps?.(item, index) ?? {};
      const selected = isRowSelected?.(item, index) ?? false;
      const itemId = item.id?.toString() ?? rowKeyGetter(item, index).toString();
      const uniqueKey = parentKey ? `${parentKey}-${itemId}` : itemId;
      const isExpanded = expandedIds.has(itemId);
      const itemHasChildren = hasChildren(item);
      const children = item[childrenKey] as any[] | undefined;

      const rows: React.ReactNode[] = [
        <TableRow
          key={uniqueKey}
          $selected={selected}
          $isChild={depth > 0}
          {...rowProps}
          onClick={() => onRowClick?.(item, index)}
        >
          {columns.map((column, colIndex) => {
            const isFirstColumn = colIndex === 0;
            const cellContent = column.render
              ? column.render(item, index, depth)
              : (item[column.key] as React.ReactNode);

            return (
              <TableCell key={column.key} $depth={isFirstColumn ? depth : 0}>
                {isFirstColumn && isTreeTable ? (
                  <TableCellTitle>
                    {itemHasChildren ? (
                      <TreeExpandButton
                        $expanded={isExpanded}
                        onClick={(e) => toggleExpand(itemId, e)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </TreeExpandButton>
                    ) : (
                      <span style={{ display: 'inline-block', width: '32px' }} />
                    )}
                    {cellContent}
                  </TableCellTitle>
                ) : (
                  cellContent
                )}
              </TableCell>
            );
          })}
        </TableRow>,
      ];

      // Render children if expanded
      if (isExpanded && children) {
        children.forEach((child, childIndex) => {
          rows.push(...renderTreeRow(child, childIndex, depth + 1, uniqueKey));
        });
      }

      return rows;
    },
    [
      getRowProps,
      isRowSelected,
      rowKeyGetter,
      expandedIds,
      hasChildren,
      childrenKey,
      columns,
      isTreeTable,
      toggleExpand,
      onRowClick,
    ]
  );

  const renderDefaultRow = (item: any, index: number) => {
    if (isTreeTable) {
      return renderTreeRow(item, index, 0);
    }

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
            ) : isTreeTable ? (
              dataToDisplay.flatMap((item, index) => renderTreeRow(item, index, 0))
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

