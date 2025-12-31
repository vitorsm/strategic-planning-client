import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${colors.primary};
`;

export const LabelText = styled.span`
  color: ${colors.muted};
  font-size: 13px;
`;


