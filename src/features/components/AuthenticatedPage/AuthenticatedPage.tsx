import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import {
  PageWrap,
  MainContent,
  MainContentWrap,
  MobileHeader,
  MobileMenuButton,
  MobileHeaderTitle,
  MobileHeaderSpacer,
  SidebarOverlay,
} from './styles';
import { NavItemType } from './types';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useIsAuthenticated } from '../../../shared/auth/useIsAuthenticated';

export type AuthenticatedPageProps = {
  userName: string;
  userRole: string;
  userAvatar?: string;
  navItems: NavItemType[];
  onSignOut?: () => void;
  title?: string;
};

export const AuthenticatedPage = ({
  userName,
  userRole,
  userAvatar,
  navItems,
  onSignOut,
  title = 'Dashboard',
}: AuthenticatedPageProps) => {
  const isAuthenticated = useIsAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageWrap>
      <MobileHeader>
        <MobileMenuButton onClick={openMobileMenu} aria-label="Open menu">
          <span className="material-symbols-outlined">menu</span>
        </MobileMenuButton>
        <MobileHeaderTitle>{title}</MobileHeaderTitle>
        <MobileHeaderSpacer />
      </MobileHeader>

      <SidebarOverlay $open={mobileMenuOpen} onClick={closeMobileMenu} />

      <MainContentWrap>
        <Sidebar
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          navItems={navItems}
          onSignOut={onSignOut}
          mobileOpen={mobileMenuOpen}
          onMobileClose={closeMobileMenu}
        />
        <MainContent>
          <Routes>
            <Route path="/dashbord" element={<div>dashbord</div>} />
            <Route path="/users" element={<div>Users</div>} />]
            <Route path="*" element={<Navigate to="/dashbord" replace />} />
          </Routes>
        </MainContent>
      </MainContentWrap>
    </PageWrap>
  );
};
