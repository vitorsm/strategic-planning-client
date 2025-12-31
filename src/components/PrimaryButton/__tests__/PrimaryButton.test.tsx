import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PrimaryButton } from '../PrimaryButton';

describe('PrimaryButton', () => {
  it('renders a button with text', () => {
    render(<PrimaryButton>Continue</PrimaryButton>);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = jest.fn();

    render(<PrimaryButton onClick={onClick}>Save</PrimaryButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = jest.fn();

    render(
      <PrimaryButton disabled onClick={onClick}>
        Save
      </PrimaryButton>
    );

    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeDisabled();

    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});


