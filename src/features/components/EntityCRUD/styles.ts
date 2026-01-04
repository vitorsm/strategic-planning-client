import styled, { css } from 'styled-components';
import { colors } from '../../../shared/styles/colors';
import { MOBILE_SIZE } from '../../../shared';

// Header Styles
export const HeaderWrap = styled.header`
  flex: none;
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.inputBg};

  @media (max-width: ${MOBILE_SIZE}px) {
    display: none;
  }

`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${MOBILE_SIZE}px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: ${colors.white};
  letter-spacing: -0.025em;
`;

export const HeaderBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  background: ${colors.surface2};
  color: ${colors.muted};
  border: 1px solid ${colors.border};
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.muted};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.surface2};
  border: 1px solid ${colors.border};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background: #343e4b;
  }

  .material-symbols-outlined {
    font-size: 20px;
  }

  span:last-child {
    display: none;
    @media (min-width: 640px) {
      display: inline;
    }
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${colors.primary};
  border: none;
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(19, 127, 236, 0.2);
  transition: all 150ms ease;

  &:hover {
    background: ${colors.primaryHover};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

// Content Styles
export const ContentWrap = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ContentInner = styled.div`
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Filters Styles
export const FiltersWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const SearchInputWrap = styled.div`
  position: relative;

  .material-symbols-outlined {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.muted};
    font-size: 20px;
  }
`;

export const SearchInput = styled.input`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  color: ${colors.white};
  font-size: 14px;
  border-radius: 8px;
  padding: 8px 16px 8px 40px;
  width: 256px;
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: ${colors.muted2};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }
`;

export const FilterDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${colors.border};
  margin: 0 4px;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;

  .material-symbols-outlined {
    font-size: 18px;
  }

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(19, 127, 236, 0.2);
          color: ${colors.primary};
          border: 1px solid rgba(19, 127, 236, 0.2);
        `
      : css`
          background: ${colors.surface2};
          color: ${colors.muted};
          border: 1px solid ${colors.border};

          &:hover {
            color: ${colors.white};
          }
        `}
`;

export const FilterDropdownWrap = styled.div`
  position: relative;
`;

export const FilterDropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 160px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
  z-index: 50;
  overflow: hidden;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 150ms ease;
`;

export const FilterDropdownItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: ${({ $selected }) => ($selected ? colors.primary : colors.muted)};
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  text-align: left;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${colors.surface2};
    color: ${colors.white};
  }

  .material-symbols-outlined {
    font-size: 16px;
    margin-left: auto;
  }
`;

// Entity-specific cell styles (used with shared Table component)
export const TitleCell = styled.div<{ $isChild?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ $isChild }) =>
    $isChild &&
    css`
      padding-left: 32px;
      position: relative;
    `}
`;

export const TreeLine = styled.span`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-left: 1px solid #4b5563;
  border-bottom: 1px solid #4b5563;
  border-bottom-left-radius: 6px;
`;

export const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border: none;
  color: ${colors.muted};
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: ${colors.white};
  }
`;

export const TitleContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleText = styled.span<{ $isParent?: boolean }>`
  color: ${colors.white};
  font-weight: ${({ $isParent }) => ($isParent ? 600 : 500)};
  font-size: ${({ $isParent }) => ($isParent ? '16px' : '14px')};
`;

export const SubtitleText = styled.span`
  color: ${colors.muted};
  font-size: 12px;
  margin-top: 2px;
`;

export const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const Tag = styled.span<{ $type: 'blocked' | 'info' | 'warning' | 'success' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;

  .material-symbols-outlined {
    font-size: 12px;
  }

  ${({ $type }) => {
    switch ($type) {
      case 'blocked':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'warning':
        return css`
          background: rgba(249, 115, 22, 0.1);
          color: #fb923c;
          border: 1px solid rgba(249, 115, 22, 0.2);
        `;
      case 'success':
        return css`
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      default:
        return css`
          background: ${colors.surface2};
          color: ${colors.muted};
          border: 1px solid ${colors.border};
        `;
    }
  }}
`;

export const OwnerAvatar = styled.div<{ $imageUrl?: string }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background-color: ${colors.surface2};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 0 0 2px ${colors.border};

  ${({ $imageUrl }) =>
    $imageUrl &&
    css`
      background-image: url(${$imageUrl});
    `}
`;

export const StatusBadge = styled.span<{ $status: 'on_track' | 'at_risk' | 'warning' | 'completed' | 'pending' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;

  ${({ $status }) => {
    switch ($status) {
      case 'on_track':
      case 'completed':
        return css`
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      case 'at_risk':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'warning':
        return css`
          background: rgba(249, 115, 22, 0.1);
          color: #fb923c;
          border: 1px solid rgba(249, 115, 22, 0.2);
        `;
      default:
        return css`
          background: ${colors.surface2};
          color: ${colors.muted};
          border: 1px solid ${colors.border};
        `;
    }
  }}
`;

export const StatusDot = styled.span<{ $status: 'on_track' | 'at_risk' | 'warning' | 'completed' | 'pending' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;

  ${({ $status }) => {
    switch ($status) {
      case 'on_track':
      case 'completed':
        return css`
          background: #4ade80;
        `;
      case 'at_risk':
        return css`
          background: #f87171;
        `;
      case 'warning':
        return css`
          background: #fb923c;
        `;
      default:
        return css`
          background: ${colors.muted};
        `;
    }
  }}
`;

export const ProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${colors.surface2};
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percentage: number; $status?: 'on_track' | 'at_risk' | 'warning' | 'completed' | 'pending' }>`
  height: 100%;
  border-radius: 9999px;
  width: ${({ $percentage }) => `${$percentage}%`};

  ${({ $status }) => {
    switch ($status) {
      case 'on_track':
      case 'completed':
        return css`
          background: #22c55e;
        `;
      case 'at_risk':
        return css`
          background: #ef4444;
        `;
      case 'warning':
        return css`
          background: #f97316;
        `;
      default:
        return css`
          background: ${colors.primary};
        `;
    }
  }}
`;

export const ProgressText = styled.span`
  color: ${colors.white};
  font-weight: 500;
  font-size: 12px;
  min-width: 32px;
`;

export const DateText = styled.span`
  color: ${colors.muted};
`;
