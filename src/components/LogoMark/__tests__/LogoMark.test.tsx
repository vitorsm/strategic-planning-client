import React from 'react';
import { render, screen } from '@testing-library/react';

import { LogoMark } from '../LogoMark';

describe('LogoMark', () => {
  it('renders with a default accessible label', () => {
    render(<LogoMark />);
    expect(screen.getByLabelText('EM Strategy')).toBeInTheDocument();
  });

  it('uses the provided title as the accessible label', () => {
    render(<LogoMark title="My App" />);
    expect(screen.getByLabelText('My App')).toBeInTheDocument();
  });

  it('applies size via inline style', () => {
    render(<LogoMark size={48} title="Brand" />);
    const wrap = screen.getByLabelText('Brand');
    expect(wrap).toHaveStyle({ width: '48px', height: '48px' });
  });
});


