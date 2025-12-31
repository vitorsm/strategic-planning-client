import React from 'react';
import { LogoMark, NavLink, IconLink } from '../../../shared/components';
import {
  BottomRow,
  Column,
  ColumnTitle,
  FooterContainer,
  Copyright,
  FooterWrap,
  IconRow,
  LinkGroup,
  LinksGrid,
  Muted,
  TopRow,
} from './styles';

export type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps) => {
  return (
    <FooterWrap className={className}>
      <FooterContainer>
        <TopRow>
          <LinksGrid>
            <Column $span={2} $mdSpan={1}>
              <LinkGroup>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <LogoMark size={24} />
                  <span style={{ fontSize: 18, fontWeight: 700 }}>EM Strategy</span>
                </div>
                <Muted>
                  Empowering engineering leaders to build happier, high-performing teams.
                </Muted>
              </LinkGroup>
            </Column>

            <Column>
              <ColumnTitle>Product</ColumnTitle>
              <NavLink href="#">
                Features
              </NavLink>
              <NavLink href="#">
                Integrations
              </NavLink>
              <NavLink href="#">
                Pricing
              </NavLink>
              <NavLink href="#">
                Changelog
              </NavLink>
            </Column>

            <Column>
              <ColumnTitle>Resources</ColumnTitle>
              <NavLink href="#">
                Blog
              </NavLink>
              <NavLink href="#">
                Community
              </NavLink>
              <NavLink href="#">
                Help Center
              </NavLink>
              <NavLink href="#">
                API Docs
              </NavLink>
            </Column>

            <Column>
              <ColumnTitle>Company</ColumnTitle>
              <NavLink href="#">
                About
              </NavLink>
              <NavLink href="#">
                Careers
              </NavLink>
              <NavLink href="#">
                Legal
              </NavLink>
              <NavLink href="#">
                Contact
              </NavLink>
            </Column>
          </LinksGrid>
        </TopRow>

        <BottomRow>
          <Copyright>© 2025 EM Strategy Tool. All rights reserved.</Copyright>

          <IconRow>
            <IconLink href="#" aria-label="Public">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                public
              </span>
            </IconLink>
            <IconLink href="#" aria-label="Email">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                mail
              </span>
            </IconLink>
          </IconRow>
        </BottomRow>
      </FooterContainer>
    </FooterWrap>
  );
};

