import React from 'react';

import { StyledCard, StyledStickyCard, CardHeader, CardTitle, CardSubtitle } from './styles';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  sticky?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, sticky = false, className, ...props }) => {
  const Component = sticky ? StyledStickyCard : StyledCard;
  const hasSubtitle = Boolean(subtitle);
  
  return (
    <Component className={className} {...props}>
      {title && hasSubtitle ? (
        <CardHeader>
          <CardTitle $hasSubtitle>{title}</CardTitle>
          <CardSubtitle>{subtitle}</CardSubtitle>
        </CardHeader>
      ) : title ? (
        <CardTitle>{title}</CardTitle>
      ) : null}
      {children}
    </Component>
  );
};

