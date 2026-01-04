import { TableColumn } from "../../../shared";

export type EntityStatus = 'on_track' | 'at_risk' | 'warning' | 'completed' | 'pending';

export interface EntityColumn<T = unknown> {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface EntityItem {
  id: string;
  name: string;
  subtitle?: string;
  owner?: {
    name: string;
    avatar?: string;
  };
  status?: EntityStatus;
  progress?: number;
  dueDate?: string;
  children?: EntityItem[];
  tags?: EntityTag[];
  [key: string]: unknown;
}

export interface EntityTag {
  label: string;
  type: 'blocked' | 'info' | 'warning' | 'success';
}

export interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon: string;
}

export interface ListEntitiesProps {
  items: EntityItem[];
  columns: TableColumn[];
  onItemClick?: (item: EntityItem) => void;
  selectedItemId?: string;
  isLoading?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
}

export interface EntityCRUDProps {
  title: string;
  subtitle?: string;
  items: any[];
  tableColumns: TableColumn[];
  setPageTitle: (title: string) => void;
  setPageSubtitle: (subtitle: string) => void;
  onCreateClick?: () => void;
  secondaryActionButton?: ActionButtonProps;
  isLoading?: boolean;
  searchPlaceholder?: string;
  createButtonLabel?: string;
  pageSize?: number;
  setPrimaryActionButton: (button: ActionButtonProps) => void;
  setSecondaryActionButton?: (button: ActionButtonProps) => void;
}

export interface FilterOption {
  label: string;
  value: string;
  active?: boolean;
}

