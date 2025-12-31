import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Anchor = styled.a`
  display: inline-flex;
  color: ${colors.muted2};
  text-decoration: none;
  transition: color 150ms ease;

  &:hover {
    color: ${colors.text};
  }
`;


