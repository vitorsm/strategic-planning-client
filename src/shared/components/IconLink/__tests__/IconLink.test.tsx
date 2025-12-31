import React from 'react';
import { render, screen } from '@testing-library/react';

import { IconLink } from '../IconLink';

describe('IconLink', () => {
  it('renders an anchor element', () => {
    render(<IconLink href="#" aria-label="Test link" />);
    expect(screen.getByRole('link', { name: 'Test link' })).toBeInTheDocument();
  });
});

