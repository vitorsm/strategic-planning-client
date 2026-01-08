import styled, { css } from 'styled-components';
import { colors } from '../../../shared/styles/colors';


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

export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

// Filters Styles
export const FiltersWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const FilterDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${colors.border};
  margin: 0 4px;
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

export const DateText = styled.span`
  color: ${colors.muted};
`;

export const DetailsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: calc(100% - 64px);
  margin: 0 auto;
  padding: 32px;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 140px;
`;

export const DetailsPageGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 20px;

  @media (min-width: 1024px) {
    flex-direction: row;
    padding-bottom: 10px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

export const MobileFixedActionWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: ${colors.bg};
  border-top: 1px solid ${colors.border};
  z-index: 100;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
`;