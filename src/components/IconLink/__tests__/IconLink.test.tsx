import React from 'react';
import { render, screen } from '@testing-library/react';

import { IconLink } from '../IconLink';

describe('IconLink', () => {
  it('renders an anchor with href and children', () => {
    render(
      <IconLink href="https://example.com" aria-label="Docs">
        Docs
      </IconLink>
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('forwards common anchor attributes', () => {
    render(
      <IconLink href="/home" target="_blank" rel="noreferrer">
        Home
      </IconLink>
    );

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});


