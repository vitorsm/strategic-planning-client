import React, { useState, useEffect } from 'react';
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
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuthenticate } from '../../../shared/auth/useAuthenticate';

export type AuthenticatedPageProps = {
  userAvatar?: string;
  onSignOut?: () => void;
  title?: string;
};

const INITIAL_NAV_ITEMS: NavItemType[] = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    href: '/dashbord',
    active: true,
  }, {
    icon: 'person',
    label: 'Users',
    href: '/users',
    active: false,
  }
];

export const AuthenticatedPage = ({
  userAvatar,
  onSignOut,
  title = 'Dashboard',
}: AuthenticatedPageProps) => {
  const { isAuthenticated, currentUser, getCurrentUser } = useAuthenticate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItemType[]>(INITIAL_NAV_ITEMS);

  const navigate = useNavigate();

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  useEffect(() => {
    if (isAuthenticated()) {
      getCurrentUser();
    }
  }, [getCurrentUser, isAuthenticated()]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const onNavItemClick = (item: NavItemType) => {
    setNavItems(navItems.map((i) => ({ ...i, active: i.href === item.href })));
    navigate(item.href, { replace: true });
  };

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
          userName={currentUser?.name ?? ''}
          userLogin={currentUser?.login ?? ''}
          userAvatar={userAvatar}
          navItems={navItems}
          onSignOut={onSignOut}
          mobileOpen={mobileMenuOpen}
          onMobileClose={closeMobileMenu}
          onNavItemClick={onNavItemClick}
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
