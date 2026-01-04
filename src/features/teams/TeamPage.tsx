import React, { useState, useCallback, useEffect } from 'react';
import { EntityCRUD, EntityItem } from '../components/EntityCRUD';
import { ActionButtonProps } from '../components/EntityCRUD/types';

// Sample team data for demonstration
const SAMPLE_TEAMS = [
  {
    id: '1',
    name: 'Engineering',
    subtitle: '12 members',
  },
  {
    id: '2',
    name: 'Product',
    subtitle: '8 members'
  },
  {
    id: '3',
    name: 'Design',
    subtitle: '5 members'
  },
];

export interface TeamPageProps {
  setPageTitle: (title: string) => void;
  setPrimaryActionButton: (button: ActionButtonProps) => void;
  setSecondaryActionButton: (button: ActionButtonProps) => void;
  setPageSubtitle: (subtitle: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ setPageTitle, setPrimaryActionButton, setSecondaryActionButton, setPageSubtitle }) => {
  const [teams] = useState(SAMPLE_TEAMS);

  useEffect(() => {
    setSecondaryActionButton({
      label: 'Download',
      onClick: handleCreateClick,
      icon: 'download',
    });
  }, []);

  const handleCreateClick = useCallback(() => {
    // TODO: Implement create team functionality
    console.log('Create team clicked');
  }, []);

  return (
    <EntityCRUD
      title="Teams Management"
      subtitle="Manage your teams"
      items={teams}
      tableColumns={[]}
      setPageTitle={setPageTitle}
      setPageSubtitle={setPageSubtitle}
      onCreateClick={handleCreateClick}
      createButtonLabel="New Team"
      searchPlaceholder="Search teams..."
      setPrimaryActionButton={setPrimaryActionButton}
    />
  );
};

