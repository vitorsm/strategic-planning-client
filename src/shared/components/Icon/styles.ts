import styled from 'styled-components';

import type { IconSize } from './Icon';

const sizeMap: Record<IconSize, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
};

export const IconWrapper = styled.span<{ $size: IconSize }>`
  font-size: ${({ $size }) => sizeMap[$size]};
  line-height: 1;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

