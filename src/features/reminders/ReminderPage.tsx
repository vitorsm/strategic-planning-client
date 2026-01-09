import React, { useMemo } from 'react';
import { MainEntityPage } from '../components/EntityCRUD';
import { ActionButtonProps } from '../components/EntityCRUD/types';
import { ReminderDetails } from './ReminderDetails';
import { RoutePage } from '../components/EntityCRUD';
import { Reminder, ReminderStatus } from '../../shared/models/reminder';
import { Badge, BadgeVariant, useIsMobile } from '../../shared';

const getStatusBadgeVariant = (status: ReminderStatus): BadgeVariant => {
  switch (status) {
    case ReminderStatus.DONE:
      return 'success';
    case ReminderStatus.PENDING:
      return 'warning';
    default:
      return 'neutral';
  }
};

const MOBILE_COLUMNS = [{
  key: 'status', 
  label: 'Status', 
  render: (reminder: Reminder) => (
    <Badge variant={getStatusBadgeVariant(reminder.status)}>
      {reminder.status}
    </Badge>
  )
}];

const DESKTOP_COLUMNS = [
  ...MOBILE_COLUMNS,
  {key: 'team', label: 'Team', render: (reminder: Reminder) => reminder.related_team?.name },
  {key: 'user', label: 'User', render: (reminder: Reminder) => reminder.related_user?.name }
];

export interface ReminderPageProps {
  setPageTitle: (title: string) => void;
  setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
  setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
  setPageSubtitle: (subtitle: string) => void;
}

export const ReminderPage: React.FC<ReminderPageProps> = ({ setPageTitle, setPrimaryActionButton, setSecondaryActionButton, setPageSubtitle }) => {
  const isMobile = useIsMobile();
  const columns = useMemo(() => isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS, [isMobile]);

  return (
    <RoutePage
      setPageTitle={setPageTitle}
      setPrimaryActionButton={setPrimaryActionButton}
      setSecondaryActionButton={setSecondaryActionButton}
      setPageSubtitle={setPageSubtitle}
      apiEndpoint="/api/reminders"
      rootPath="/reminders"
      MainPageComponent={MainEntityPage}
      DetailsPageComponent={ReminderDetails}
      mainPageTitle="Reminders Management"
      mainPageSubtitle="Manage your reminders"
      createButtonLabel="New Reminder"
      searchPlaceholder="Search reminders..."
      tableColumns={columns}
      getItemSubtitle={(reminder: any) => reminder.to_user ? `To: ${reminder.to_user.name}` : 'No recipient'}
      routes={[]}
    />
  );

};

