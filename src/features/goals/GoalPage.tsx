import React, { useMemo } from 'react';
import { MainEntityPage } from '../components/EntityCRUD';
import { ActionButtonProps } from '../components/EntityCRUD/types';
import { CreateUpdateGoal } from './CreateUpdateGoal';
import { RoutePage } from '../components/EntityCRUD';
import { Goal, GoalStatus, GoalType } from '../../shared/models/goal';
import { Badge, BadgeVariant, useIsMobile } from '../../shared';
import { GoalDetails } from './GoalDetails';

const getStatusBadgeVariant = (status: GoalStatus): BadgeVariant => {
  switch (status) {
    case GoalStatus.DONE:
      return 'success';
    case GoalStatus.IN_PROGRESS:
      return 'info';
    case GoalStatus.NOT_STARTED:
      return 'neutral';
    case GoalStatus.ARCHIVED:
      return 'neutral';
    default:
      return 'neutral';
  }
};

const getTypeBadgeVariant = (type: GoalType): BadgeVariant => {
  switch (type) {
    case GoalType.PERSONAL:
      return 'info';
    case GoalType.ORGANIZATIONAL:
      return 'success';
    default:
      return 'neutral';
  }
};

const MOBILE_COLUMNS = [
  {
    key: 'status', 
    label: 'Status', 
    render: (goal: Goal) => (
      <Badge variant={getStatusBadgeVariant(goal.status)}>
        {goal.status.replace('_', ' ')}
      </Badge>
    )
  }
];

const DESKTOP_COLUMNS = [
  {
    key: 'type',
    label: 'Type',
    render: (goal: Goal) => (
      <Badge variant={getTypeBadgeVariant(goal.type)}>
        {goal.type}
      </Badge>
    )
  },
  ...MOBILE_COLUMNS,
  {key: 'team', label: 'Team', render: (goal: Goal) => goal.team?.name ?? '-' },
  {key: 'user', label: 'User', render: (goal: Goal) => goal.user?.name ?? '-' }
];

export interface GoalPageProps {
  setPageTitle: (title: string) => void;
  setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
  setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
  setPageSubtitle: (subtitle: string) => void;
}

export const GoalPage: React.FC<GoalPageProps> = ({ setPageTitle, setPrimaryActionButton, setSecondaryActionButton, setPageSubtitle }) => {
  const isMobile = useIsMobile();
  const columns = useMemo(() => isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS, [isMobile]);

  return (
    <RoutePage
      setPageTitle={setPageTitle}
      setPrimaryActionButton={setPrimaryActionButton}
      setSecondaryActionButton={setSecondaryActionButton}
      setPageSubtitle={setPageSubtitle}
      apiEndpoint="/api/goals"
      rootPath="/goals"
      MainPageComponent={MainEntityPage}
      GenericCreateUpdateComponent={CreateUpdateGoal}
      EntityDetailsComponent={GoalDetails}
      mainPageTitle="Goals Management"
      mainPageSubtitle="Track and manage personal and organizational goals"
      createButtonLabel="New Goal"
      searchPlaceholder="Search goals..."
      tableColumns={columns}
      getItemSubtitle={(goal: any) => {
        if (goal.type === GoalType.PERSONAL && goal.user) {
          return `Personal - ${goal.user.name}`;
        } else if (goal.type === GoalType.ORGANIZATIONAL && goal.team) {
          return `${goal.team.name}`;
        }
        return 'No assignment';
      }}
      routes={[]}
      isTreeTable={true}
      childrenKey="children"
      defaultExpandedIds={[]}
    />
  );

};

