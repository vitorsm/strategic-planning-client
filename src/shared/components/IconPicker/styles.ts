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
  max-width: 560px;
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

export const SearchWrapper = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.border};
`;

export const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  color: ${colors.muted};
  pointer-events: none;
  font-family: 'Material Symbols Outlined';
  font-size: 20px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px 0 44px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.inputBg};
  color: ${colors.text};
  font-size: 14px;
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

export const IconsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 24px;
`;

export const CategoryTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.muted};
  margin: 0 0 12px;
  padding-top: 8px;

  &:first-child {
    padding-top: 0;
  }
`;

export const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
  margin-bottom: 20px;
`;

export const IconItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${props => props.$selected ? colors.primary : colors.border};
  background: ${props => props.$selected ? 'rgba(19, 127, 236, 0.1)' : colors.inputBg};
  color: ${props => props.$selected ? colors.primary : colors.muted};
  cursor: pointer;
  transition: all 150ms ease;

  ${props => props.$selected && `
    box-shadow: 0 0 0 1px ${colors.primary};
  `}

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.text};
    background: ${colors.surface2};
  }

  span.material-symbols-outlined {
    font-size: 24px;
  }
`;

export const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: ${colors.muted};
  text-align: center;

  span.material-symbols-outlined {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

export const NoResultsText = styled.p`
  margin: 0;
  font-size: 14px;
`;

export const SelectedPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${colors.border};
  background: ${colors.surface};
`;

export const PreviewIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgba(19, 127, 236, 0.1);
  color: ${props => props.$color || colors.primary};

  span.material-symbols-outlined {
    font-size: 28px;
  }
`;

export const PreviewInfo = styled.div`
  flex: 1;
`;

export const PreviewLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.muted};
`;

export const PreviewName = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
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

