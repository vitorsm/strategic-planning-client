import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavLink } from '../NavLink';

describe('NavLink', () => {
  it('renders an anchor with children', () => {
    render(<NavLink href="#">Features</NavLink>);
    expect(screen.getByRole('link', { name: 'Features' })).toBeInTheDocument();
  });
});

