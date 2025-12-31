import React from 'react';
import { render, screen } from '@testing-library/react';

import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox with label', () => {
    render(<Checkbox label="Remember me" />);
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
  });
});

