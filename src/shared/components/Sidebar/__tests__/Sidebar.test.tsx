import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Sidebar isOpen={false}>
        <div>Sidebar content</div>
      </Sidebar>
    );

    expect(screen.queryByText('Sidebar content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Sidebar isOpen={true}>
        <div>Sidebar content</div>
      </Sidebar>
    );

    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    const onClose = jest.fn();

    render(
      <Sidebar isOpen={true} onClose={onClose}>
        <div>Sidebar content</div>
      </Sidebar>
    );

    const overlay = screen.getByTestId('sidebar-overlay');
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render with left position by default', () => {
    const { container } = render(
      <Sidebar isOpen={true}>
        <div>Sidebar content</div>
      </Sidebar>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with right position when specified', () => {
    const { container } = render(
      <Sidebar isOpen={true} position="right">
        <div>Sidebar content</div>
      </Sidebar>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with bottom position when specified', () => {
    const { container } = render(
      <Sidebar isOpen={true} position="bottom" height="300px">
        <div>Sidebar content</div>
      </Sidebar>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children components', () => {
    render(
      <Sidebar isOpen={true}>
        <button>Click me</button>
        <p>Some text</p>
      </Sidebar>
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    expect(screen.getByText('Some text')).toBeInTheDocument();
  });
});

