import styled, { keyframes } from "styled-components";
import { colors } from "../../styles";

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