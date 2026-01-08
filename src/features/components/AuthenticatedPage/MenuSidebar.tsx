import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarWrap,
  SidebarContent,
  ProfileSection,
  ProfileAvatar,
  ProfileInfo,
  ProfileName,
  ProfileRole,
  Nav,
  NavItem,
  NavIcon,
  NavLabel,
  SidebarFooter,
  SignOutButton,
  MobileCloseButton,
} from './styles';
import { NavItemType } from './types';
import { useAuthenticate } from '../../../shared/auth/useAuthenticate';

export type MenuSidebarProps = {
  userName: string;
  userLogin: string;
  userAvatar?: string;
  navItems: NavItemType[];
  onSignOut?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onNavItemClick?: (item: NavItemType) => void;
};

export const MenuSidebar = ({
  userName,
  userLogin,
  userAvatar,
  navItems,
  onSignOut,
  mobileOpen = false,
  onMobileClose,
  onNavItemClick,
}: MenuSidebarProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const { logout } = useAuthenticate();

  // On mobile, when the sidebar is open, it should be expanded (not collapsed)
  const isCollapsed = mobileOpen ? false : collapsed;

  const handleMouseEnter = () => {
    if (!mobileOpen) {
      setCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!mobileOpen) {
      setCollapsed(true);
    }
  };

  const onNavItemClickSidebar = (item: NavItemType) => {
    onNavItemClick?.(item);
    setCollapsed(false);
  }

  return (
    <SidebarWrap
      $collapsed={isCollapsed}
      $mobileOpen={mobileOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <SidebarContent>
        <ProfileSection $collapsed={isCollapsed}>
          <ProfileAvatar
            $imageUrl={userAvatar}
            $collapsed={isCollapsed}
            data-alt={`Profile picture of ${userName}`}
          />
          <ProfileInfo $collapsed={isCollapsed}>
            <ProfileName>{userName}</ProfileName>
            <ProfileRole>{userLogin}</ProfileRole>
          </ProfileInfo>
          <MobileCloseButton onClick={onMobileClose} aria-label="Close menu">
            <span className="material-symbols-outlined">close</span>
          </MobileCloseButton>
        </ProfileSection>

        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.href} $active={item.active} $collapsed={isCollapsed} onClick={() => onNavItemClickSidebar(item)}>
              <NavIcon className="material-symbols-outlined">{item.icon}</NavIcon>
              <NavLabel $collapsed={isCollapsed}>{item.label}</NavLabel>
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <SignOutButton
            onClick={() => {
              logout();
              onSignOut?.();
              navigate('/login', { replace: true });
            }}
            $collapsed={isCollapsed}
          >
            <NavIcon className="material-symbols-outlined">logout</NavIcon>
            <NavLabel $collapsed={isCollapsed}>Sign Out</NavLabel>
          </SignOutButton>
        </SidebarFooter>
      </SidebarContent>
      
    </SidebarWrap>
  );
};
