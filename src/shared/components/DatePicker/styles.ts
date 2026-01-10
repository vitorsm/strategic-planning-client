import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const FieldLabel = styled.label<{ $required?: boolean }>`
  color: ${colors.text};
  font-size: 14px;
  font-weight: 600;
  
  ${({ $required }) =>
    $required &&
    `
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

export const DateInput = styled.input`
  width: calc(100% - 28px);
  height: 48px;
  border-radius: 10px;
  border: 1px solid ${colors.surface2};
  background: ${colors.inputBg};
  color: ${colors.text};
  outline: none;
  font-size: 14px;
  padding: 0 14px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  cursor: pointer;

  &::placeholder {
    color: ${colors.muted2};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryRing};
  }

  &:disabled {
    background: ${colors.surface};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

