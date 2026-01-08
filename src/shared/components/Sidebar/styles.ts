import styled, { css, keyframes } from 'styled-components';

import type { SidebarPosition } from './Sidebar';
import { colors } from '../../styles/colors';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideInFromBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  animation: ${fadeIn} 500ms ease-out forwards;
`;

export const SidebarContent = styled.div<{
  $position: SidebarPosition;
  $width: string;
  $height: string;
  $isOpen: boolean;
}>`
  position: absolute;
  background: ${colors.card};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  overflow-y: auto;

  ${({ $position, $width, $height }) => {
    if ($position === 'bottom') {
      return css`
        left: 0;
        right: 0;
        bottom: 0;
        height: ${$height};
        max-height: 100%;
        animation: ${slideInFromBottom} 250ms ease-out forwards;
      `;
    }
    if ($position === 'right') {
      return css`
        top: 0;
        bottom: 0;
        right: 0;
        width: ${$width};
        max-width: 100%;
        animation: ${slideInFromRight} 250ms ease-out forwards;
      `;
    }
    return css`
      top: 0;
      bottom: 0;
      left: 0;
      width: ${$width};
      max-width: 100%;
      animation: ${slideInFromLeft} 250ms ease-out forwards;
    `;
  }}
`;

