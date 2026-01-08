import React from 'react';
import { render, screen } from '@testing-library/react';

import { Icon } from '../Icon';

describe('Icon', () => {
  it('renders the icon with the correct name', () => {
    render(<Icon name="home" />);
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('applies the material-symbols-outlined class', () => {
    render(<Icon name="settings" />);
    const icon = screen.getByText('settings');
    expect(icon).toHaveClass('material-symbols-outlined');
  });

  it('applies additional className when provided', () => {
    render(<Icon name="search" className="custom-class" />);
    const icon = screen.getByText('search');
    expect(icon).toHaveClass('material-symbols-outlined');
    expect(icon).toHaveClass('custom-class');
  });
});

