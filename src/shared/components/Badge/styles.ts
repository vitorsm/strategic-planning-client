import styled from 'styled-components';
import { BadgeVariant } from './Badge';

const variantStyles = {
  success: {
    background: '#dcfce7',
    color: '#166534',
    border: '#86efac',
  },
  warning: {
    background: '#fef3c7',
    color: '#92400e',
    border: '#fcd34d',
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '#fca5a5',
  },
  info: {
    background: '#dbeafe',
    color: '#1e40af',
    border: '#93c5fd',
  },
  neutral: {
    background: '#f3f4f6',
    color: '#374151',
    border: '#d1d5db',
  },
};

export const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => variantStyles[props.$variant].background};
  color: ${props => variantStyles[props.$variant].color};
  border: 1px solid ${props => variantStyles[props.$variant].border};
  white-space: nowrap;
`;

