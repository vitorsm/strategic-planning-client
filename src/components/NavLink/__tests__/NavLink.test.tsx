import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavLink } from '../NavLink';

describe('NavLink', () => {
  it('renders an anchor with href and children', () => {
    render(<NavLink href="/pricing">Pricing</NavLink>);

    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/pricing');
  });

  it('forwards aria attributes', () => {
    render(
      <NavLink href="/settings" aria-current="page">
        Settings
      </NavLink>
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});


