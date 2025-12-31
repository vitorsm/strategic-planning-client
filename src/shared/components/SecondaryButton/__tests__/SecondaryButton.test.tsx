import React from 'react';
import { render, screen } from '@testing-library/react';

import { SecondaryButton } from '../SecondaryButton';

describe('SecondaryButton', () => {
  it('renders a button with text', () => {
    render(<SecondaryButton>Google</SecondaryButton>);
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
  });
});

