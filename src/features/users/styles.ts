import styled from "styled-components";
import { colors } from "../../shared";


export const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

export const UserNotFoundCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
`;

export const UserNotFoundContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserNotFoundText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserNotFoundTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
`;

export const UserNotFoundDescription = styled.span`
  font-size: 12px;
  color: ${colors.muted};
`;



export const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MembersHeader = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.muted2};
  margin-bottom: 8px;
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.inputBg};
  border: 1px solid ${colors.border};
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${colors.primary};
  }
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MemberAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${colors.border};
`;

export const MemberAvatarPlaceholder = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color || colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
`;

export const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MemberName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
`;

export const MemberActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;