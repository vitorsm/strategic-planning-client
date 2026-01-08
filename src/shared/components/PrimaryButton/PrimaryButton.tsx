import React from 'react';

import { Icon } from '../Icon';
import { Button, ButtonContent } from './styles';

export type PrimaryButtonVariant = 'navbar' | 'form';

export type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: PrimaryButtonVariant;
  icon?: string;
};

export const PrimaryButton = ({
  className,
  variant = 'navbar',
  icon,
  children,
  ...props
}: PrimaryButtonProps) => {
  return (
    <Button className={className} $variant={variant} {...props}>
      <ButtonContent>
        {icon && <Icon name={icon} size="small" />}
        {children}
      </ButtonContent>
    </Button>
  );
};

