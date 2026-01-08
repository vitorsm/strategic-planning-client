import styled from 'styled-components';
import { colors } from '../../shared/styles/colors';


export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 2;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ActionCardText = styled.p`
  font-size: 14px;
  color: ${colors.muted};
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

