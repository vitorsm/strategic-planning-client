import styled, { keyframes, css } from 'styled-components';
import { colors } from '../../shared/styles/colors';

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 2;

  @media (max-width: 1024px) {
    flex: 1;
  }
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ActionCardText = styled.p`
  font-size: 14px;
  color: ${colors.muted};
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

export const ColorPreview = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: ${props => props.$color};
  border: 2px solid ${colors.border};
`;

export const IconPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${colors.muted};
  
  span.material-symbols-outlined {
    font-size: 24px;
  }
`;

// Icon Selection Components
export const IconSelectionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const IconButton = styled.button<{ $selected?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${colors.inputBg};
  border: 1px solid ${props => props.$selected ? colors.primary : colors.border};
  color: ${props => props.$selected ? colors.primary : colors.muted};
  
  ${props => props.$selected && css`
    background-color: rgba(19, 127, 236, 0.1);
    box-shadow: 0 0 0 1px ${colors.primary};
  `}

  &:hover {
    color: ${colors.text};
    background-color: ${colors.surface2};
  }

  span.material-symbols-outlined {
    font-size: 20px;
  }
`;

export const AddIconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  border: 1px dashed ${colors.muted};
  color: ${colors.muted};

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }

  span.material-symbols-outlined {
    font-size: 20px;
  }
`;

// Color Selection Components
export const ColorSelectionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const ColorButton = styled.button<{ $color: string; $selected?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.$color};
  border: none;
  opacity: ${props => props.$selected ? 1 : 0.7};
  
  ${props => props.$selected && css`
    box-shadow: 0 0 0 2px ${colors.card}, 0 0 0 4px ${props.$color};
  `}

  &:hover {
    opacity: 1;
    box-shadow: 0 0 0 2px ${colors.card}, 0 0 0 4px ${props => props.$color};
  }
`;

export const AddColorButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  border: 1px dashed ${colors.muted};
  color: ${colors.muted};

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }

  span.material-symbols-outlined {
    font-size: 14px;
  }
`;

// Form Section Components
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.span<{ $required?: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
  
  ${props => props.$required && css`
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Hierarchy Preview Components
export const HierarchyPreviewContainer = styled.div`
  margin-top: 16px;
  padding: 20px;
  border-radius: 8px;
  background-color: ${colors.inputBg};
  border: 1px dashed ${colors.border};
`;

export const PreviewLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.muted};
  margin-bottom: 16px;
`;

export const HierarchyTree = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
`;

export const HierarchyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${colors.muted};
`;

export const HierarchyBranch = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
`;

export const HierarchyConnector = styled.div`
  height: 24px;
  border-left: 1px solid ${colors.border};
`;

export const HierarchyNewItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

export const HierarchyHorizontalLine = styled.div`
  position: absolute;
  left: -1px;
  top: 14px;
  width: 16px;
  border-top: 1px solid ${colors.border};
`;

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

export const NewTaskTypePreview = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: ${colors.surface2};
  border: 1px solid rgba(19, 127, 236, 0.5);
  color: ${props => props.$color || colors.primary};
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  animation: ${pulseAnimation} 2s ease-in-out infinite;

  span.material-symbols-outlined {
    font-size: 18px;
  }
`;

export const NewTaskTypeName = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

export const NewBadge = styled.span`
  margin-left: auto;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  background-color: rgba(19, 127, 236, 0.1);
  color: ${colors.primary};
  padding: 2px 8px;
  border-radius: 4px;
`;

// Best Practices Components
export const BestPracticesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const BestPracticeItem = styled.li`
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: ${colors.muted};
  
  span.material-symbols-outlined {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

export const SuccessIcon = styled.span`
  color: #22c55e;
`;

export const WarningIcon = styled.span`
  color: #f97316;
`;

// Current Root Types Components
export const RootTypesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RootTypeItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 0 -8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$selected ? css`
    background-color: rgba(19, 127, 236, 0.1);
    border: 1px solid rgba(19, 127, 236, 0.2);
  ` : css`
    border: 1px solid transparent;
    &:hover {
      background-color: ${colors.inputBg};
    }
  `}
`;

export const RootTypeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RootTypeDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color};
`;

export const RootTypeName = styled.span<{ $selected?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$selected ? colors.primary : colors.text};
`;

export const RootTypeBadge = styled.span<{ $selected?: boolean }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.$selected ? colors.card : colors.surface2};
  color: ${props => props.$selected ? colors.primary : colors.muted};
`;

// Search Input for Parent Category
export const SearchInputWrapper = styled.div`
  position: relative;
`;

export const SearchIconLeft = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.muted};
  pointer-events: none;
  
  span.material-symbols-outlined {
    font-size: 20px;
  }
`;

export const DropdownIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.muted};
  pointer-events: none;
  
  span.material-symbols-outlined {
    font-size: 20px;
  }
`;

export const SearchInputStyled = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 40px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  background-color: ${colors.inputBg};
  color: ${colors.text};
  font-size: 16px;
  transition: all 0.2s ease;
  cursor: pointer;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.primaryRing};
    border-color: ${colors.primary};
  }
`;

// Divider
export const FormDivider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.border};
  margin: 8px 0;
`;

// Sidebar Card (transparent)
export const TransparentCard = styled.div`
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding: 24px;
  background-color: transparent;
`;

export const TransparentCardTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.text};
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
  margin: 0;
`;

export const SectionDescription = styled.p`
  font-size: 14px;
  color: ${colors.muted};
  margin: 0;
`;
