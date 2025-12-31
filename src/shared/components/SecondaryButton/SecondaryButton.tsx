import React from 'react';

import { Button, Label } from './styles';

export type SecondaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  icon?: React.ReactNode;
};

export const SecondaryButton = ({ className, icon, children, ...props }: SecondaryButtonProps) => {
  return (
    <Button className={className} {...props}>
      {icon}
      <Label>{children}</Label>
    </Button>
  );
};

