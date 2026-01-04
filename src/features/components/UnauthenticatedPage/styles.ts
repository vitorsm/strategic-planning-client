import styled from 'styled-components';
import { colors } from '../../../shared/styles/colors';
import { MOBILE_SIZE } from '../../../shared';

export const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.bg};
  color: ${colors.text};
`;

export const Body = styled.main`
  flex: 1;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 24px;

  @media (min-width: 1024px) {
    padding: 16px 80px;
  }
`;

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: ${colors.text};
`;

export const BrandTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.25;

  @media (max-width: 639px) {
    display: none;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  gap: 32px;
`;

export const LinkRow = styled.nav`
  display: none;
  align-items: center;
  gap: 36px;

  @media (min-width: ${MOBILE_SIZE}px) {
    display: flex;
  }
`;

export const NavLink = styled.a`
  color: ${colors.text};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms ease;

  &:hover {
    color: ${colors.primary};
  }
`;


export const FooterWrap = styled.footer`
  background: ${colors.bg};
  border-top: 1px solid ${colors.border};
  padding: 48px 24px;

  @media (min-width: 1024px) {
    padding: 48px 80px;
  }
`;

export const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const TopRow = styled.div`
  margin-bottom: 48px;
`;

export const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;

  @media (min-width: ${MOBILE_SIZE}px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const Column = styled.div<{ $span?: number; $mdSpan?: number }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  grid-column: span ${({ $span }) => $span ?? 1} / span ${({ $span }) => $span ?? 1};

  @media (min-width: ${MOBILE_SIZE}px) {
    grid-column: span ${({ $mdSpan, $span }) => $mdSpan ?? $span ?? 1} /
      span ${({ $mdSpan, $span }) => $mdSpan ?? $span ?? 1};
  }
`;

export const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${colors.text};
`;

export const Muted = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 14px;
  line-height: 1.5;
`;

export const ColumnTitle = styled.h4`
  margin: 0;
  color: ${colors.text};
  font-weight: 700;
`;


export const BottomRow = styled.div`
  padding-top: 32px;
  border-top: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${MOBILE_SIZE}px) {
    flex-direction: row;
  }
`;

export const Copyright = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 14px;
`;

export const IconRow = styled.div`
  display: flex;
  gap: 24px;
`;

