import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const StyledCard = styled.div`
  background: ${colors.surface};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const StyledStickyCard = styled(StyledCard)`
  @media (min-width: 1024px) {
    position: sticky;
    top: 32px;
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 24px;
`;

export const CardTitle = styled.h2<{ $hasSubtitle?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: ${({ $hasSubtitle }) => ($hasSubtitle ? '0' : '24px')};
`;

export const CardSubtitle = styled.p`
  font-size: 14px;
  color: ${colors.muted};
  margin-top: 4px;
`;

