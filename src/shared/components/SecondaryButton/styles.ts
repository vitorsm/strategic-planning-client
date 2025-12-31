import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Button = styled.button`
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${colors.surface2};
  background: ${colors.inputBg};
  color: ${colors.text};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 150ms ease;

  &:hover {
    background: ${colors.surface2};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Label = styled.span`
  font-size: 13px;
  font-weight: 700;
`;

