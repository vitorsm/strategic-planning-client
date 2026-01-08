import styled from 'styled-components';

import { colors } from '../../styles/colors';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

export const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${colors.surface2};
  margin-bottom: 20px;
  color: ${colors.primary};

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: ${colors.text};
  text-align: center;
`;

export const Description = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.muted};
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

export const OkButton = styled.button`
  flex: 1;
  height: 44px;
  border: 0;
  border-radius: 8px;
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: ${colors.primaryHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primaryRing};
  }
`;

export const CancelButton = styled.button`
  flex: 1;
  height: 44px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${colors.surface2};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primaryRing};
  }
`;

