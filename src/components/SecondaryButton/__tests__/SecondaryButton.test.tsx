import React from 'react';
import { render, screen } from '@testing-library/react';

import { SecondaryButton } from '../SecondaryButton';

describe('SecondaryButton', () => {
  it('renders a button with label', () => {
    render(<SecondaryButton type="button">Google</SecondaryButton>);
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
  });

  it('renders an icon when provided', () => {
    render(
      <SecondaryButton type="button" icon={<svg aria-hidden="true" viewBox="0 0 24 24" />}>
        Google
      </SecondaryButton>
    );

    expect(screen.getByRole('button', { name: 'Google' }).querySelector('svg')).toBeTruthy();
  });
});


