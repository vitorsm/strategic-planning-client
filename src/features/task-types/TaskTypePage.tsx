import React from 'react';
import { MainEntityPage } from '../components/EntityCRUD';
import { ActionButtonProps } from '../components/EntityCRUD/types';
import { TaskTypeDetails } from './TaskTypeDetails';
import { RoutePage } from '../components/EntityCRUD';
import { Icon } from '../../shared';

export interface TaskTypePageProps {
  setPageTitle: (title: string) => void;
  setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
  setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
  setPageSubtitle: (subtitle: string) => void;
}

export const TaskTypePage: React.FC<TaskTypePageProps> = ({ setPageTitle, setPrimaryActionButton, setSecondaryActionButton, setPageSubtitle }) => {
  
  return (
    <RoutePage
      setPageTitle={setPageTitle}
      setPrimaryActionButton={setPrimaryActionButton}
      setSecondaryActionButton={setSecondaryActionButton}
      setPageSubtitle={setPageSubtitle}
      apiEndpoint="/api/task-types"
      rootPath="/task-types"
      MainPageComponent={MainEntityPage}
      DetailsPageComponent={TaskTypeDetails}
      mainPageTitle="Task Types Management"
      mainPageSubtitle="Manage your task types"
      createButtonLabel="New Task Type"
      searchPlaceholder="Search task types..."
      tableColumns={[{key: 'icon', label: 'Icon', render: (taskType: any) => <Icon name={taskType.icon} />}]}
      getItemSubtitle={() => null}
      routes={[]}
      isTreeTable={true}
      childrenKey="children"
    />
  );

};

