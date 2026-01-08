import styled, { css } from 'styled-components';

import type { PrimaryButtonVariant } from './PrimaryButton';
import { colors } from '../../styles/colors';

export const Button = styled.button<{ $variant: PrimaryButtonVariant }>`
  height: 40px;
  border: 0;
  background: ${colors.primary};
  color: ${colors.white};
  cursor: pointer;
  transition: background 150ms ease;

  ${({ $variant }) =>
    $variant === 'form'
      ? css`
          border-radius: 10px;
          font-weight: 800;
          font-size: 14px;
          padding: 0 16px;
        `
      : css`
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          padding: 0 16px;
        `}

  &:hover {
    background: ${colors.primaryHover};
  }
`;

export const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

