import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const Anchor = styled.a`
  color: ${colors.text};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms ease;

  &:hover {
    color: ${colors.primary};
  }
`;

