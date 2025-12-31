import React from 'react';

import { Anchor } from './styles';

export type IconLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string;
};

export const IconLink = ({ className, ...props }: IconLinkProps) => {
  return <Anchor className={className} {...props} />;
};


