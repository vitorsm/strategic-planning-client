import React from 'react';
import { render, screen } from '@testing-library/react';

import { LogoMark } from '../LogoMark';

describe('LogoMark', () => {
  it('renders with default title', () => {
    render(<LogoMark />);
    expect(screen.getByLabelText('EM Strategy')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<LogoMark title="Custom Logo" />);
    expect(screen.getByLabelText('Custom Logo')).toBeInTheDocument();
  });
});

