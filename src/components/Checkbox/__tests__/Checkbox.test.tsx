import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox with label', () => {
    render(<Checkbox label="Remember me" name="remember" />);
    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
  });

  it('toggles when clicked', async () => {
    render(<Checkbox label="Remember me" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' });
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});


