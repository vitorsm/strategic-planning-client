import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const FieldLabel = styled.label`
  color: ${colors.text};
  font-size: 13px;
  font-weight: 600;
`;

export const InputWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 12px;
  color: ${colors.muted};
  pointer-events: none;
`;

export const MaterialIcon = styled.span`
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
`;

export const Input = styled.input<{ $hasIcon: boolean }>`
  width: calc(100% - 28px);
  height: 48px;
  border-radius: 10px;
  border: 1px solid ${colors.surface2};
  background: ${colors.inputBg};
  color: ${colors.text};
  outline: none;
  font-size: 14px;
  padding: ${({ $hasIcon }) => ($hasIcon ? '0 14px 0 40px' : '0 14px')};
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: ${colors.muted2};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryRing};
  }
`;

export const TextArea = styled.textarea`
  width: calc(100% - 28px);
  min-height: 140px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background: ${colors.inputBg};
  color: ${colors.text};
  outline: none;
  font-size: 14px;
  padding: 12px 16px;
  resize: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: ${colors.muted2};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryRing};
  }
`;

