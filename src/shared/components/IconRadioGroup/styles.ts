import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RadioLabel = styled.label<{ checked?: boolean }>`
  cursor: pointer;
  position: relative;
  display: block;
`;

export const RadioInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const RadioCard = styled.div<{ checked?: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.checked ? colors.primary : colors.border};
  background: ${props => props.checked ? `${colors.primary}0D` : colors.card};
  display: flex;
  align-items: start;
  gap: 16px;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    border-color: ${props => props.checked ? colors.primary : `${colors.primary}80`};
  }

  ${props => props.checked && `
    box-shadow: 0 0 0 1px ${colors.primary}80;
  `}
`;

export const RadioIconWrapper = styled.div<{ checked?: boolean }>`
  padding: 8px;
  border-radius: 8px;
  background: ${props => props.checked ? colors.primary : colors.surface2};
  color: ${props => props.checked ? '#ffffff' : colors.muted};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 24px;
  }
`;

export const RadioContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RadioTitle = styled.span`
  color: ${colors.white};
  font-weight: 700;
  font-size: 14px;
`;

export const RadioDescription = styled.p`
  color: ${colors.muted};
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
`;

export const RadioCheckIcon = styled.div<{ checked?: boolean }>`
  margin-left: auto;
  opacity: ${props => props.checked ? 1 : 0};
  color: ${colors.primary};
  transition: opacity 0.2s ease;

  .material-symbols-outlined {
    font-size: 24px;
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
`;

