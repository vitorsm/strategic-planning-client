import React from 'react';

import { IconWrapper } from './styles';

export type IconSize = 'small' | 'medium' | 'large';

export type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  size?: IconSize;
  className?: string;
};

export const Icon = ({ 
    name, 
    size = 'medium', 
    className,
    ...props }: IconProps) => {
  return (
    <IconWrapper className={`material-symbols-outlined ${className ?? ''}`} $size={size} {...props}>
      {name}
    </IconWrapper>
  );
};

