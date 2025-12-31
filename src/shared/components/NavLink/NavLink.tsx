import React from 'react';
import { Anchor } from './styles';

export type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string;
};

export const NavLink = ({ className, ...props }: NavLinkProps) => {
  return <Anchor className={className} {...props} />;
};

