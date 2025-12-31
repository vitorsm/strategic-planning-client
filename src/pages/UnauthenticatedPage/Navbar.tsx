import React from 'react';
import { LogoMark } from '../../components/LogoMark';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  Actions,
  Brand,
  BrandTitle,
  Container,
  Header,
  LinkRow,
  NavLink,
} from './styles';

export type NavbarProps = {
  className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <Header className={className}>
      <Container>
        <Brand>
          <LogoMark size={32} />
          <BrandTitle>EM Strategy Tool</BrandTitle>
        </Brand>

        <Actions>
          <LinkRow>
            <NavLink href="#">Features</NavLink>
            <NavLink href="#">Pricing</NavLink>
            <NavLink href="#">Resources</NavLink>
          </LinkRow>

          <PrimaryButton type="button">Start Free Trial</PrimaryButton>
        </Actions>
      </Container>
    </Header>
  );
};


