import React, { useState, useEffect } from 'react';
import { MenuSidebar } from './MenuSidebar';
import {
  PageWrap,
  MainContent,
  MainContentWrap,
  MobileHeader,
  MobileMenuButton,
  MobileHeaderTitle,
  MobileHeaderSpacer,
  SidebarOverlay,
  HeaderWrap,
  HeaderContent,
  HeaderTitleGroup,
  HeaderTitleRow,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  ActionButton,
  CreateButton,
} from './styles';
import { NavItemType } from './types';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useAuthenticate } from '../../../shared/auth/useAuthenticate';
import { MainEntityPage, EntityItem } from '../EntityCRUD';
import { TeamPage } from '../../teams';
import { TaskTypePage } from '../../task-types';
import { ReminderPage } from '../../reminders';
import { TableColumn } from '../../../shared';
import { OwnerAvatar } from '../EntityCRUD/styles';
import { ActionButtonProps } from '../EntityCRUD/types';
import { MobileActionButtons } from './MobileActionButtons';

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
    active: false,
    addButtonClicked: false,
  }, {
    icon: 'groups',
    label: 'Teams',
    href: '/teams',
    active: false,
    addButtonClicked: false,
  }, {
    icon: 'category',
    label: 'Task Types',
    href: '/task-types',
    active: false,
    addButtonClicked: false,
  }, {
    icon: 'notifications',
    label: 'Reminders',
    href: '/reminders',
    active: false,
    addButtonClicked: false,
  }, {
    icon: 'person',
    label: 'Users',
    href: '/users',
    active: false,
    addButtonClicked: false,
  }
];

// Sample data for demonstration
const SAMPLE_ITEMS: EntityItem[] = [
  {
    id: '1',
    name: 'Reduce Technical Debt',
    subtitle: 'Payment Service',
    owner: {
      name: 'Sarah',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYWKVPeET9IMllxsnvbSbozS8Iz7yw6KNDP7E3Ha6M0detzZLILs7eOwZGNOCi7-ZYVDmIcoVk8VWPkjtSzT_oMslTeTHSN-qX7lJPH7ctFpEOdXDIShjj_GDOeKLrEz7f6MoMjGWbrafBWqm8J2ObqSY3grCrrj-MHwjNVRDZK5AYLgvKiMYaJwLNiqlpu9q-Ak4-Qv2tnl-VKDxvgwBNQVpCwyDSTgXtq4M_T1FwKn7YKUo8M-uJRmv_DwQYFGxtRRi5Y8t7kl9_',
    },
    status: 'on_track',
    progress: 65,
    dueDate: 'Oct 15',
    children: [
      {
        id: '1-1',
        name: 'Migrate Stripe API to v12',
        owner: {
          name: 'James',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX2oAHFvUW0CCDMyxSxFqBaiqCN3ts5jlFOGzb4gVvN84sDeaWR1zeZ_nRXV4zvh4kGfh4Zoow8T3inhVErWVjE1Lgom5mVQD0OND-GrcDh898uWK9UXqUOw_nlTR7zRzPbGUd3JD8rckgJX1qTGYSbDiSot9hToALHR7-7_8rP4trujixPEHqOWuk_RWDFVU8pcA_XnauM-1Hk5M6PnRG_PN1QHuzFDZwqRF7Stkhme7oWDZTrWAepTlEcUWOdx6dEVndTcex0YS7',
        },
        status: 'at_risk',
        progress: 45,
        dueDate: 'Sep 30',
        tags: [{ label: 'Blocked', type: 'blocked' }],
      },
      {
        id: '1-2',
        name: 'Deprecate Legacy Checkout',
        owner: {
          name: 'Emily',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqyu0r7sC35WyEjKHbj1a7kFCDBAxYuS4yG6k-VSwdZyTyJybBLMmAbYA4xUlQ7oyxaYDYSb2g4etRmdVN9KH8fYZaPZILncJGlFu5iy3_ckyHTK0jaDkt0Lcd0CKu2aBmuhH6rgGNLslafeq3Imbj-eEhCOLxilNIo6sBLdX-KnZFyecwc5pBWqzAuZf3907g54yheiGCvW8YqZ__TgB6G2WG9q-kplRS98vqckvPcn-_WNxEFw72pJTTI1mgQ5m6ayW6rrt9f_AO',
        },
        status: 'on_track',
        progress: 90,
        dueDate: 'Oct 10',
      },
    ],
  },
  {
    id: '2',
    name: 'Improve Hiring Pipeline',
    subtitle: 'Recruiting',
    owner: {
      name: 'Manager',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsTs4CEfQ9Lf1Z9hyxHlZJDqpCuS6Ebg9-OJoZK7GUq4PTlVIfJ9XzkFr2Wj2rcYJ9bqtKrBmbdzd-jdmoQNhEAihDSlluXDftJM8l8lQ1pWbd29d1kEb9oQRgap1NG3RsbaqA6mkC5cZUk0yUi4jzVz69PDEcth4SQzAAf3F8_yJj_A9Gwfl8bpo6S-6dvspch9DZuUwp90_WBycABJOS8WyVDURBm_roAVsHGXQftugNMm-wmapmwzakuzeZsFYAX5-QkYGp6xnT',
    },
    status: 'warning',
    progress: 30,
    dueDate: 'Nov 15',
    children: [
      {
        id: '2-1',
        name: 'Hire 2 Senior Backend Engineers',
        owner: {
          name: 'Recruiter',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmlwi-cOIE1pa2_9CB32Jyxu85mz4Afc3CjZhfummAaknoOltl23VTgeY4BLnlFJ9Iz3l3_sGunKxhNx52n8Z8JNhGZBUCBjl7HCC6abT3Kso9fhSK39rnUXNvz_s2WEkWMfxpEJXYARZzhsc_FQ8jprYyHOESul5SBtJMZhSI181Hz8sdrHLeTJe5GVkkw-zkYuUKykMHA_GnvNCpeIyHH-mcPP45Ihuoel94ApqGOI5WpsjXuYFaygLUtlR5tSzXEv4IKECB16C9',
        },
        status: 'warning',
        progress: 20,
        dueDate: 'Dec 01',
      },
    ],
  },
];

export const AuthenticatedPage = ({
  userAvatar,
  onSignOut,
}: AuthenticatedPageProps) => {
  const { isAuthenticated, currentUser, getCurrentUser } = useAuthenticate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItemType[]>(INITIAL_NAV_ITEMS);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageSubtitle, setPageSubtitle] = useState<string>('');
  const [primaryActionButton, setPrimaryActionButton] = useState<ActionButtonProps | undefined>(undefined);
  const [secondaryActionButton, setSecondaryActionButton] = useState<ActionButtonProps | undefined>(undefined);
  const [actionSidebarIsOpen, setActionSidebarIsOpen] = useState(false);

  // to remove after migration to the new component
  const [items] = useState<EntityItem[]>(SAMPLE_ITEMS);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // to remove 
  const tableColumns: TableColumn[] = [
    { key: 'title', label: 'Title', width: '40%' },
    { key: 'owner', label: 'Owner', width: '10%', render: (item: EntityItem) => <OwnerAvatar $imageUrl={item.owner?.avatar} title={item.owner?.name} /> },
    { key: 'status', label: 'Status', width: '15%', render: (item: EntityItem) => item.status, },
    { key: 'progress', label: 'Progress', width: '20%', render: (item: EntityItem) => item.progress, },
    { key: 'dueDate', label: 'Due Date', width: '15%', render: (item: EntityItem) => item.dueDate, },
  ];

  useEffect(() => {
    setNavItems((items) =>
      items.map((item) => ({
        ...item,
        active: location.pathname === item.href,
      }))
    );
  }, [location.pathname]);

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const onCloseActionsButtons = () => {
    navItems.forEach((item) => {
      item.addButtonClicked = false;
    });
    setNavItems([...navItems]);
  };
  
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
    setMobileMenuOpen(false);
  };

  const renderMobileButtons = () => {
    if (!primaryActionButton) {
      return null;
    }
    
    if (secondaryActionButton) {
      return (
        <MobileMenuButton onClick={() => setActionSidebarIsOpen(true)} aria-label="Actions">
          <span className="material-symbols-outlined">more_vert</span>
        </MobileMenuButton>
      )
    }

    return (
      <MobileMenuButton onClick={primaryActionButton?.onClick} aria-label="primary action">
        <span className="material-symbols-outlined">{primaryActionButton?.icon}</span>
      </MobileMenuButton>
    )
  }

  const renderMobileHeader = () => {
    return (
      <MobileHeader>
          <MobileMenuButton onClick={openMobileMenu} aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </MobileMenuButton>
          <MobileHeaderTitle>{pageTitle}</MobileHeaderTitle>
          <MobileHeaderSpacer />
          {renderMobileButtons()}
        </MobileHeader>
    );
  };

  const renderDesktopHeader = () => {
    return (
      <HeaderWrap>
          <HeaderContent>
            <HeaderTitleGroup>
              <HeaderTitleRow>
                <HeaderTitle>{pageTitle}</HeaderTitle>
              </HeaderTitleRow>
              {pageSubtitle && <HeaderSubtitle>{pageSubtitle}</HeaderSubtitle>}
            </HeaderTitleGroup>
            <HeaderActions>
              {secondaryActionButton && (
                <ActionButton onClick={secondaryActionButton?.onClick}>
                  <span className="material-symbols-outlined">{secondaryActionButton?.icon}</span>
                  <span>{secondaryActionButton?.label}</span>
                </ActionButton>
              )}
              {primaryActionButton && (
                <CreateButton onClick={primaryActionButton.onClick}>
                  <span className="material-symbols-outlined">{primaryActionButton.icon}</span>
                  {primaryActionButton.label}
                </CreateButton>
              )}
            </HeaderActions>
          </HeaderContent>
        </HeaderWrap>
    );
  }

  const renderHeader = () => {
    return (
      <>
        {renderDesktopHeader()}
        {renderMobileHeader()}
      </>
    );
  }

  return (
    <PageWrap className="page-wrap">
      <SidebarOverlay $open={mobileMenuOpen} onClick={closeMobileMenu} />

      <MainContentWrap className="main-content-wrap">
        <MenuSidebar
          userName={currentUser?.name ?? ''}
          userLogin={currentUser?.login ?? ''}
          userAvatar={userAvatar}
          navItems={navItems}
          onSignOut={onSignOut}
          mobileOpen={mobileMenuOpen}
          onMobileClose={closeMobileMenu}
          onNavItemClick={onNavItemClick}
        />

        <MobileActionButtons
          primaryActionButton={primaryActionButton }
          secondaryActionButton={secondaryActionButton}
          actionSidebarIsOpen={actionSidebarIsOpen}
          onSidebarClose={() => setActionSidebarIsOpen(false)}
        />
        
        <MainContent>
          {renderHeader()}
          <Routes>
            <Route
              path="/dashbord/*"
              element={
                <MainEntityPage
                  title="Goal Tracking"
                  subtitle="Strategic initiatives and engineering KPIs"
                  setPageTitle={setPageTitle}
                  setPageSubtitle={setPageSubtitle}
                  items={items}
                  tableColumns={tableColumns}
                  createButtonLabel="New Goal"
                  searchPlaceholder="Search goals..."
                  setPrimaryActionButton={setPrimaryActionButton}
                  onRefresh={() => {}}
                />
              }
            />
            <Route
              path="/teams/*"
              element={
                <TeamPage
                  setPageTitle={setPageTitle}
                  setPrimaryActionButton={setPrimaryActionButton}
                  setSecondaryActionButton={setSecondaryActionButton}
                  setPageSubtitle={setPageSubtitle}
                />
              }
            />
            <Route
              path="/task-types/*"
              element={
                <TaskTypePage
                  setPageTitle={setPageTitle}
                  setPrimaryActionButton={setPrimaryActionButton}
                  setSecondaryActionButton={setSecondaryActionButton}
                  setPageSubtitle={setPageSubtitle}
                />
              }
            />
            <Route
              path="/reminders/*"
              element={
                <ReminderPage
                  setPageTitle={setPageTitle}
                  setPrimaryActionButton={setPrimaryActionButton}
                  setSecondaryActionButton={setSecondaryActionButton}
                  setPageSubtitle={setPageSubtitle}
                />
              }
            />
            <Route
              path="/users/*"
              element={
                <MainEntityPage
                  title="Users"
                  subtitle="Manage team members and access"
                  items={[]}
                  setPageTitle={setPageTitle}
                  tableColumns={tableColumns}
                  createButtonLabel="New User"
                  searchPlaceholder="Search users..."
                  setPrimaryActionButton={setPrimaryActionButton}
                  setPageSubtitle={setPageSubtitle}
                  onRefresh={() => {}}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashbord" replace />} />
          </Routes>
        </MainContent>

      </MainContentWrap>
    </PageWrap>
  );
};
