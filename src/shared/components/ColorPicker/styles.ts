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

export const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

export const PickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border};
`;

export const PickerTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${colors.muted};
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${colors.surface2};
    color: ${colors.text};
  }
`;

export const ColorsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

export const CategoryTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.muted};
  margin: 0 0 16px;
  padding-top: 16px;

  &:first-child {
    padding-top: 0;
  }
`;

export const ColorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

export const ColorItem = styled.button<{ $color: string; $selected?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid ${props => props.$selected ? colors.text : 'transparent'};
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 150ms ease;
  position: relative;

  ${props => props.$selected && `
    box-shadow: 0 0 0 2px ${colors.card}, 0 0 0 4px ${props.$color};
  `}

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: ${props => props.$selected ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\'/%3E%3C/svg%3E")' : 'none'};
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const CustomColorSection = styled.div`
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px solid ${colors.border};
`;

export const CustomColorLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CustomColorLabelText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.text};
`;

export const CustomColorInputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const CustomColorPreview = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color};
  border: 1px solid ${colors.border};
  flex-shrink: 0;
`;

export const CustomColorInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.inputBg};
  color: ${colors.text};
  font-size: 14px;
  font-family: monospace;
  transition: all 150ms ease;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryRing};
  }
`;

export const NativeColorInput = styled.input`
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  overflow: hidden;

  &::-webkit-color-swatch-wrapper {
    padding: 4px;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

export const SelectedPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${colors.border};
  background: ${colors.surface};
`;

export const PreviewColor = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color};
  border: 1px solid ${colors.border};
`;

export const PreviewInfo = styled.div`
  flex: 1;
`;

export const PreviewLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.muted};
`;

export const PreviewValue = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
  font-family: monospace;
  color: ${colors.text};
`;

export const SelectButton = styled.button`
  height: 40px;
  padding: 0 20px;
  border: none;
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

