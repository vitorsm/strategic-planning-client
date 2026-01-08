import React from 'react';

import {
  MembersList,
  MembersHeader,
  MemberItem,
  MemberInfo,
  MemberAvatar,
  MemberAvatarPlaceholder,
  MemberDetails,
  MemberName,
  MemberActions,
} from '../styles';
import { VisualUser } from '../types';
import { Icon, PrimaryButton, SecondaryButton } from '../../../shared';

export interface UserListProps {
  users: VisualUser[];
  onRemoveUser: (user: VisualUser) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onRemoveUser,
}) => {
  return (
    <MembersList>
      <MembersHeader>Selected Members ({users.length})</MembersHeader>
      {users.map((user) => (
        <MemberItem key={user.id}>
          <MemberInfo>
            {user.avatar_url ? (
              <MemberAvatar src={user.avatar_url} alt={user.name} />
            ) : (
              <MemberAvatarPlaceholder $color={user.color}>
                {user.initials ?? user.name.charAt(0)}
              </MemberAvatarPlaceholder>
            )}
            <MemberDetails>
              <MemberName>{user.name}</MemberName>
            </MemberDetails>
          </MemberInfo>
          <MemberActions>
            <SecondaryButton
              icon={<Icon name="close" />}
              onClick={() => onRemoveUser(user)}
              aria-label={`Remove ${user.name}`}
            />
          </MemberActions>
        </MemberItem>
      ))}
    </MembersList>
  );
};

