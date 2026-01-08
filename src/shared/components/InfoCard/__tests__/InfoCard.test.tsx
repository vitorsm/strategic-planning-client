import { render, screen } from '@testing-library/react';
import { InfoCard } from '../InfoCard';

describe('InfoCard', () => {
  it('renders the icon', () => {
    render(
      <InfoCard
        icon="lightbulb"
        title="Test Title"
        description="Test description"
      />
    );
    
    expect(screen.getByText('lightbulb')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <InfoCard
        icon="lightbulb"
        title="Pro Tip"
        description="Test description"
      />
    );
    
    expect(screen.getByText('Pro Tip')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <InfoCard
        icon="info"
        title="Title"
        description="This is a helpful description"
      />
    );
    
    expect(screen.getByText('This is a helpful description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InfoCard
        icon="lightbulb"
        title="Title"
        description="Description"
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

