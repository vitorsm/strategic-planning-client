import React from 'react';

import { Button } from './styles';

export type PrimaryButtonVariant = 'navbar' | 'form';

export type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: PrimaryButtonVariant;
};

export const PrimaryButton = ({
  className,
  variant = 'navbar',
  ...props
}: PrimaryButtonProps) => {
  return <Button className={className} $variant={variant} {...props} />;
};

