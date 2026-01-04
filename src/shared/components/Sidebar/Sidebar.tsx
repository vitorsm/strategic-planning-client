import React from 'react';

import { Overlay, SidebarContainer, SidebarContent } from './styles';

export type SidebarPosition = 'left' | 'right' | 'bottom';

export type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  position?: SidebarPosition;
  width?: string;
  height?: string;
  children: React.ReactNode;
  className?: string;
};

export const Sidebar = ({
  isOpen,
  onClose,
  position = 'left',
  width = '320px',
  height = '50vh',
  children,
  className,
}: SidebarProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <SidebarContainer className={className}>
      <Overlay onClick={onClose} $isOpen={isOpen} data-testid="sidebar-overlay" />
      <SidebarContent $position={position} $width={width} $height={height} $isOpen={isOpen}>
        {children}
      </SidebarContent>
    </SidebarContainer>
  );
};

