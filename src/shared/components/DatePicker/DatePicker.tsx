import React from 'react';
import { Field, FieldLabel, DateInput } from './styles';

export type DatePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  className?: string;
  label: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const DatePicker = ({ 
  className, 
  label, 
  id, 
  required = false,
  onChange, 
  ...inputProps 
}: DatePickerProps) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;

  return (
    <Field className={className}>
      <FieldLabel htmlFor={inputId} $required={required}>
        {label}
      </FieldLabel>
      <DateInput 
        id={inputId} 
        type="date" 
        onChange={onChange} 
        required={required}
        {...inputProps} 
      />
    </Field>
  );
};

