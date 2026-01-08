import React from 'react';

import { Field, FieldLabel, Input, InputIcon, InputWrap, MaterialIcon, TextArea } from './styles';

export type TextInputProps = Omit<React.InputHTMLAttributes<HTMLElement>, 'children'> & {
  className?: string;
  label: string;
  icon?: string;
  type?: 'text' | 'textarea' | 'password';
  onChange: (e: any) => void;
};

export const TextInput = ({ className, label, icon, id, type = 'text', onChange, ...inputProps }: TextInputProps) => {
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
        {type === 'textarea' ? (
          <TextArea id={inputId} onChange={onChange} {...inputProps} />
        ) : (
          <Input id={inputId} $hasIcon={Boolean(icon)} onChange={onChange} type={type} {...inputProps} />
        )}
      </InputWrap>
    </Field>
  );
};

