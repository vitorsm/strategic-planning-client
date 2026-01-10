import styled from 'styled-components';
import { colors } from '../../shared/styles/colors';

export const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const RightColumn = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  padding-top: 12px;
`;

export const ActionCardText = styled.p`
  color: ${colors.muted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.muted2};
  pointer-events: none;

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

export const SelectArrow = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.muted2};
  pointer-events: none;

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

export const StyledSelect = styled.select<{ hasIcon?: boolean }>`
  width: 100%;
  background: ${colors.inputBg};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  color: ${colors.white};
  padding: 12px ${props => props.hasIcon ? '40px' : '12px'} 12px ${props => props.hasIcon ? '44px' : '16px'};
  font-size: 14px;
  outline: none;
  appearance: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }

  option {
    background: ${colors.inputBg};
    color: ${colors.white};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.muted};
  margin-bottom: 8px;

  .required {
    color: ${colors.primary};
    margin-left: 4px;
  }
`;

export const HelperText = styled.p`
  font-size: 12px;
  color: ${colors.muted2};
  margin-top: 8px;
  padding-left: 4px;
`;

export const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${colors.border};
`;

export const UserIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${colors.surface2};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${colors.border};

  .material-symbols-outlined {
    font-size: 14px;
    color: ${colors.muted};
  }
`;

export const ParentGoalWrapper = styled.div`
  margin-top: 32px;
`;

export const PreviewLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.muted};
  margin-bottom: 16px;
`;

export const HierarchyPreviewContainer = styled.div`
  margin-top: 16px;
  padding: 20px;
  border-radius: 8px;
  background-color: ${colors.inputBg};
  border: 1px dashed ${colors.border};
`;

// Goal Details Styles
export const GoalDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 24px 0;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    gap: 32px;
    padding: 16px 0;
  }
`;

export const GoalHeaderCard = styled.div<{ $statusColor?: string }>`
  position: relative;
  background: ${colors.surface};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.$statusColor || colors.primary};
  }

  @media (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

export const GoalHeaderContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const GoalHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const GoalHeaderLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GoalTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${colors.surface2};
  color: ${colors.muted};
  border: 1px solid ${colors.border};
  width: fit-content;
`;

export const GoalTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.white};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const GoalDescription = styled.p`
  color: ${colors.muted};
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  max-width: 900px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const GoalMetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid ${colors.border};
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

export const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MetadataIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${colors.surface2};
  border: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: 18px;
    color: ${colors.muted};
  }
`;

export const MetadataContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const MetadataLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${colors.muted2};
`;

export const MetadataValue = styled.span`
  color: ${colors.white};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusBadge = styled.div<{ $variant: 'success' | 'warning' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
  
  ${props => props.$variant === 'success' && `
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    color: #22c55e;
  `}
  
  ${props => props.$variant === 'warning' && `
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  `}
  
  ${props => props.$variant === 'error' && `
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
  `}
  
  ${props => props.$variant === 'info' && `
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #3b82f6;
  `}

  .material-symbols-outlined {
    font-size: 14px;
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
`;

export const ChildGoalsSection = styled.div`
  position: relative;
  padding-left: 24px;

  @media (min-width: 640px) {
    padding-left: 40px;
  }

  @media (max-width: 768px) {
    margin-right: 16px;
  }
`;

export const VerticalLine = styled.div`
  position: absolute;
  left: 0;
  top: -20px;
  bottom: 48px;
  width: 1px;
  background: linear-gradient(to bottom, ${colors.border}, ${colors.border}, transparent);

  @media (min-width: 640px) {
    left: 16px;
  }
`;

export const ChildGoalCard = styled.div<{ $isExpanded?: boolean }>`
  position: relative;
  margin-bottom: 32px;
  
  &::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 24px;
    width: 24px;
    height: 1px;
    background: ${colors.border};

    @media (min-width: 640px) {
      left: -24px;
      width: 24px;
    }
  }
`;

export const ChildGoalCardInner = styled.div<{ $statusColor?: string }>`
  background: ${colors.surface2};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:hover {
    border-color: rgba(19, 127, 236, 0.3);
    background: ${colors.surface};
  }

  ${props => props.$statusColor && `
    border-left: 2px solid ${props.$statusColor};
  `}

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const ChildGoalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ChildGoalLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: 2px;
  color: ${colors.muted};
  cursor: pointer;
  transition: color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: ${colors.white};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

export const ChildGoalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const ChildGoalName = styled.h3`
  color: ${colors.white};
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  word-break: break-word;
`;

export const ChildGoalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${colors.muted};
  font-size: 12px;

  .material-symbols-outlined {
    font-size: 14px;
  }
`;

export const ChildGoalRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 32px;

  @media (max-width: 768px) {
    padding-left: 0;
    width: 100%;
    justify-content: space-between;
  }
`;

export const AssigneeAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${colors.white};
  font-weight: 500;
  flex-shrink: 0;
`;

export const SubGoalsContainer = styled.div`
  padding-left: 32px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  @media (min-width: 640px) {
    padding-left: 48px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 14px;
    top: 0;
    bottom: 24px;
    width: 1px;
    background: ${colors.border};

    @media (min-width: 640px) {
      left: 24px;
    }
  }
`;

export const SubGoalItem = styled.div<{ $statusColor?: string }>`
  position: relative;
  background: ${colors.inputBg};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.border};
    background: ${colors.surface};
  }

  ${props => props.$statusColor && `
    border-left: 2px solid ${props.$statusColor};
  `}

  &::before {
    content: '';
    position: absolute;
    left: -16px;
    top: 20px;
    width: 16px;
    height: 1px;
    background: ${colors.border};

    @media (min-width: 640px) {
      left: -24px;
      width: 24px;
    }
  }
`;

export const SubGoalLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

export const SubGoalDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${colors.border};
  flex-shrink: 0;
  margin-left: 4px;
`;

export const SubGoalName = styled.span`
  color: ${colors.text};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SubGoalRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${colors.muted};

  .material-symbols-outlined {
    font-size: 64px;
    color: ${colors.muted2};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${colors.muted};
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: ${colors.muted2};
    margin: 0;
  }
`;
