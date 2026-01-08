import React from 'react';
import { MainEntityPage } from '../components/EntityCRUD';
import { ActionButtonProps } from '../components/EntityCRUD/types';
import { TeamDetails } from './TeamDetails';
import { RoutePage } from '../components/EntityCRUD';

export interface TeamPageProps {
  setPageTitle: (title: string) => void;
  setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
  setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
  setPageSubtitle: (subtitle: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ setPageTitle, setPrimaryActionButton, setSecondaryActionButton, setPageSubtitle }) => {
  
  return (
    <RoutePage
      setPageTitle={setPageTitle}
      setPrimaryActionButton={setPrimaryActionButton}
      setSecondaryActionButton={setSecondaryActionButton}
      setPageSubtitle={setPageSubtitle}
      apiEndpoint="/api/teams"
      rootPath="/teams"
      MainPageComponent={MainEntityPage}
      DetailsPageComponent={TeamDetails}
      mainPageTitle="Teams Management"
      mainPageSubtitle="Manage your teams"
      createButtonLabel="New Team"
      searchPlaceholder="Search teams..."
      tableColumns={[]}
      getItemSubtitle={(team: any) => `${team.number_of_members} member${team.number_of_members > 1 ? 's' : ''}`}
      routes={[]}
    />
  );

};

