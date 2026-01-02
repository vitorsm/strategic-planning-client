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

export type SidebarProps = {
  userName: string;
  userLogin: string;
  userAvatar?: string;
  navItems: NavItemType[];
  onSignOut?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onNavItemClick?: (item: NavItemType) => void;
};

export const Sidebar = ({
  userName,
  userLogin,
  userAvatar,
  navItems,
  onSignOut,
  mobileOpen = false,
  onMobileClose,
  onNavItemClick,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(mobileOpen);
  const { logout } = useAuthenticate();

  console.log("userName", userName);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  return (
    <SidebarWrap
      $collapsed={collapsed}
      $mobileOpen={mobileOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <SidebarContent>
        <ProfileSection $collapsed={collapsed}>
          <ProfileAvatar
            $imageUrl={userAvatar}
            $collapsed={collapsed}
            data-alt={`Profile picture of ${userName}`}
          />
          <ProfileInfo $collapsed={collapsed}>
            <ProfileName>{userName}</ProfileName>
            <ProfileRole>{userLogin}</ProfileRole>
          </ProfileInfo>
          <MobileCloseButton onClick={onMobileClose} aria-label="Close menu">
            <span className="material-symbols-outlined">close</span>
          </MobileCloseButton>
        </ProfileSection>

        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.href} $active={item.active} $collapsed={collapsed} onClick={() => onNavItemClick?.(item)}>
              <NavIcon className="material-symbols-outlined">{item.icon}</NavIcon>
              <NavLabel $collapsed={collapsed}>{item.label}</NavLabel>
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
            $collapsed={collapsed}
          >
            <NavIcon className="material-symbols-outlined">logout</NavIcon>
            <NavLabel $collapsed={collapsed}>Sign Out</NavLabel>
          </SignOutButton>
        </SidebarFooter>
      </SidebarContent>
    </SidebarWrap>
  );
};
