import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dialog } from '../Dialog';

describe('Dialog', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test description text',
    onOkAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description', () => {
    render(<Dialog {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });

  it('renders with dialog role and accessible labels', () => {
    render(<Dialog {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description');
  });

  it('calls onOkAction when OK button is clicked', async () => {
    const onOkAction = jest.fn();

    render(<Dialog {...defaultProps} onOkAction={onOkAction} />);
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(onOkAction).toHaveBeenCalledTimes(1);
  });

  it('renders icon when provided', () => {
    render(
      <Dialog
        {...defaultProps}
        icon={<svg data-testid="test-icon" />}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('does not render icon wrapper when icon is not provided', () => {
    const { container } = render(<Dialog {...defaultProps} />);

    const iconWrapper = container.querySelector('[class*="IconWrapper"]');
    expect(iconWrapper).not.toBeInTheDocument();
  });

  it('renders cancel button when onCancelAction is provided', () => {
    const onCancelAction = jest.fn();

    render(<Dialog {...defaultProps} onCancelAction={onCancelAction} />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render cancel button when onCancelAction is not provided', () => {
    render(<Dialog {...defaultProps} />);

    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('calls onCancelAction when Cancel button is clicked', async () => {
    const onCancelAction = jest.fn();

    render(<Dialog {...defaultProps} onCancelAction={onCancelAction} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancelAction).toHaveBeenCalledTimes(1);
  });

  it('renders custom button labels when provided', () => {
    render(
      <Dialog
        {...defaultProps}
        onCancelAction={jest.fn()}
        okLabel="Delete"
        cancelLabel="Keep"
      />
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
  });
});

