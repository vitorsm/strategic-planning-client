import React from 'react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (item: any, index: number, depth?: number) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  renderRow?: (item: any, index: number, onItemClick?: (item: any, index: number) => void) => React.ReactNode;
  onRowClick?: (item: any, index: number) => void;
  selectedRowIndex?: number;
  isLoading?: boolean;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyText?: string;
  showPagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  getRowKey?: (item: any, index: number) => string | number;
  isRowSelected?: (item: any, index: number) => boolean;
  getRowProps?: (item: any, index: number) => {
    $selected?: boolean;
    $isChild?: boolean;
    $isParentBorder?: boolean;
  };
  // Tree-related props
  isTreeTable?: boolean;
  childrenKey?: string;
  defaultExpandedIds?: string[];
}

export interface PaginationProps {
  showingStart: number;
  showingEnd: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

