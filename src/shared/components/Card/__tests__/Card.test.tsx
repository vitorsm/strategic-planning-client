import React from 'react';
import { render, screen } from '@testing-library/react';

import { Card } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title and subtitle when both provided', () => {
    render(<Card title="Card Title" subtitle="Card Subtitle">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(<Card>Content Only</Card>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card data-testid="card" className="custom-class">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('renders as sticky when sticky prop is true', () => {
    const { container } = render(<Card sticky>Sticky Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes additional props to the underlying element', () => {
    render(<Card data-testid="card-element">Content</Card>);
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
  });
});

