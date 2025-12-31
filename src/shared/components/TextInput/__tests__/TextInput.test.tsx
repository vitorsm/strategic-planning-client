import React from 'react';
import { render, screen } from '@testing-library/react';

import { TextInput } from '../TextInput';

describe('TextInput', () => {
  it('renders a labeled input', () => {
    render(<TextInput label="Work Email" id="email" name="email" type="email" />);

    const input = screen.getByLabelText('Work Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders a left icon when provided', () => {
    render(<TextInput label="Password" type="password" icon="lock" />);
    expect(screen.getByText('lock')).toBeInTheDocument();
  });
});

