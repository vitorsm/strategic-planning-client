import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { Card } from '../Card';

export const StyledInfoCard = styled(Card)`
  background: rgba(19, 127, 236, 0.08);
  border: 1px solid rgba(19, 127, 236, 0.15);
`;

export const InfoCardContent = styled.div`
  display: flex;
  gap: 12px;
`;

export const InfoIcon = styled.span`
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  color: ${colors.primary};
  font-size: 24px;
  margin-top: 2px;
`;

export const InfoCardText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoCardTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 4px;
`;

export const InfoCardDescription = styled.p`
  font-size: 12px;
  color: ${colors.muted};
  line-height: 1.5;
`;

