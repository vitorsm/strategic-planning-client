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
  CollapseButton,
  MobileCloseButton,
} from './styles';
import { NavItemType } from './types';
import { clearAccessToken } from '../../../shared/auth/useAuthenticate';

export type SidebarProps = {
  userName: string;
  userRole: string;
  userAvatar?: string;
  navItems: NavItemType[];
  onSignOut?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export const Sidebar = ({
  userName,
  userRole,
  userAvatar,
  navItems,
  onSignOut,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarWrap $collapsed={collapsed} $mobileOpen={mobileOpen}>
      <CollapseButton onClick={toggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <span className="material-symbols-outlined">
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </CollapseButton>

      <SidebarContent>
        <ProfileSection $collapsed={collapsed}>
          <ProfileAvatar
            $imageUrl={userAvatar}
            $collapsed={collapsed}
            data-alt={`Profile picture of ${userName}`}
          />
          <ProfileInfo $collapsed={collapsed}>
            <ProfileName>{userName}</ProfileName>
            <ProfileRole>{userRole}</ProfileRole>
          </ProfileInfo>
          <MobileCloseButton onClick={onMobileClose} aria-label="Close menu">
            <span className="material-symbols-outlined">close</span>
          </MobileCloseButton>
        </ProfileSection>

        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} $active={item.active} $collapsed={collapsed}>
              <NavIcon className="material-symbols-outlined">{item.icon}</NavIcon>
              <NavLabel $collapsed={collapsed}>{item.label}</NavLabel>
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <SignOutButton
            onClick={() => {
              clearAccessToken();
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
