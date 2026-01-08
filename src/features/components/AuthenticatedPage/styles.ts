import styled, { css } from 'styled-components';
import { colors } from '../../../shared/styles/colors';
import { MOBILE_SIZE } from '../../../shared';

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: ${colors.bg};
  color: ${colors.text};
  overflow: hidden;

  @media (min-width: ${MOBILE_SIZE}px) {
    flex-direction: row;
  }
`;

// Header Styles
export const HeaderWrap = styled.header`
  flex: none;
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.inputBg};

  @media (max-width: ${MOBILE_SIZE}px) {
    display: none;
  }

`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${MOBILE_SIZE}px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: ${colors.white};
  letter-spacing: -0.025em;
`;

export const HeaderBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  background: ${colors.surface2};
  color: ${colors.muted};
  border: 1px solid ${colors.border};
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.muted};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.surface2};
  border: 1px solid ${colors.border};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background: #343e4b;
  }

  .material-symbols-outlined {
    font-size: 20px;
  }

  span:last-child {
    display: none;
    @media (min-width: 640px) {
      display: inline;
    }
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.primary};
  border: none;
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(19, 127, 236, 0.2);
  transition: all 150ms ease;

  &:hover {
    background: ${colors.primaryHover};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

export const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};

  @media (min-width: ${MOBILE_SIZE}px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${colors.text};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background: ${colors.surface2};
  }

  .material-symbols-outlined {
    font-size: 24px;
  }
`;

export const MobileHeaderTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
`;

export const MobileHeaderSpacer = styled.div`
  width: 40px;
`;

export const SidebarOverlay = styled.div<{ $open?: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;

  @media (min-width: ${MOBILE_SIZE}px) {
    display: none;
  }
`;

export const SidebarWrap = styled.aside<{ $collapsed?: boolean; $mobileOpen?: boolean }>`
  display: flex;
  width: 288px;
  flex-direction: column;
  border-right: 1px solid ${colors.border};
  background: ${colors.bg};
  transition: transform 200ms ease, width 200ms ease;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? '0' : '-100%')});

  @media (min-width: ${MOBILE_SIZE}px) {
    position: relative;
    transform: none;
    width: ${({ $collapsed }) => ($collapsed ? '72px' : '288px')};
  }
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  height: 100%;
`;

export const ProfileSection = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  margin-bottom: 16px;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
`;

export const ProfileAvatar = styled.div<{ $imageUrl?: string; $collapsed?: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '40px' : '48px')};
  height: ${({ $collapsed }) => ($collapsed ? '40px' : '48px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '40px' : '48px')};
  border-radius: 50%;
  background-color: ${colors.surface2};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 0 0 2px ${colors.primaryRing};
  transition: width 200ms ease, height 200ms ease;

  ${({ $imageUrl }) =>
    $imageUrl &&
    css`
      background-image: url(${$imageUrl});
    `}
`;

export const ProfileInfo = styled.div<{ $collapsed?: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
`;

export const ProfileName = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: ${colors.text};
`;

export const ProfileRole = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.muted};
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const NavItem = styled.div<{ $active?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;
  cursor: pointer;

  ${({ $active }) =>
    $active
      ? css`
          background: ${colors.primary};
          color: ${colors.white};
        `
      : css`
          color: ${colors.muted};

          &:hover {
            background: ${colors.surface2};
            color: ${colors.text};
          }
        `}
`;

export const NavLabel = styled.span<{ $collapsed?: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  overflow: hidden;
  white-space: nowrap;
`;

export const NavIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`;

export const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${colors.border};
`;

export const SignOutButton = styled.button<{ $collapsed?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 12px;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.muted};
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: ${colors.danger};
  }
`;

export const CollapseButton = styled.button`
  position: absolute;
  top: 24px;
  right: -12px;
  width: 24px;
  height: 24px;
  display: none;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.border};
  border-radius: 50%;
  background: ${colors.bg};
  color: ${colors.muted};
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
  z-index: 10;

  &:hover {
    background: ${colors.surface2};
    color: ${colors.text};
  }

  .material-symbols-outlined {
    font-size: 16px;
  }

  @media (min-width: ${MOBILE_SIZE}px) {
    display: flex;
  }
`;

export const MobileCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${colors.muted};
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
  margin-left: auto;

  &:hover {
    background: ${colors.surface2};
    color: ${colors.text};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }

  @media (min-width: ${MOBILE_SIZE}px) {
    display: none;
  }
`;

export const MainContentWrap = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: ${colors.bg};
`;

