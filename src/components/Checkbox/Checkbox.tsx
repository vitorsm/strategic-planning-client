import React from 'react';

import { CheckboxInput, CheckboxLabel, LabelText } from './styles';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
  className?: string;
  label: React.ReactNode;
};

export const Checkbox = ({ className, label, id, ...props }: CheckboxProps) => {
  const reactId = React.useId();
  const checkboxId = id ?? reactId;

  return (
    <CheckboxLabel className={className} htmlFor={checkboxId}>
      <CheckboxInput id={checkboxId} type="checkbox" {...props} />
      <LabelText>{label}</LabelText>
    </CheckboxLabel>
  );
};


