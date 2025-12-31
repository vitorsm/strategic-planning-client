import React from 'react';

import { Field, FieldLabel, Input, InputIcon, InputWrap, MaterialIcon } from './styles';

export type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> & {
  className?: string;
  label: string;
  icon?: string;
};

export const TextInput = ({ className, label, icon, id, ...inputProps }: TextInputProps) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;

  return (
    <Field className={className}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <InputWrap>
        {icon ? (
          <InputIcon aria-hidden="true">
            <MaterialIcon style={{ fontSize: 20 }}>{icon}</MaterialIcon>
          </InputIcon>
        ) : null}
        <Input id={inputId} $hasIcon={Boolean(icon)} {...inputProps} />
      </InputWrap>
    </Field>
  );
};


