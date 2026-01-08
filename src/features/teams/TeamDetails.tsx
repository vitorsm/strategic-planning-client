import { useCallback, useState } from "react";
import { Team } from "../../shared/models/team";
import { EntityDetailsPage } from "../components/EntityCRUD";
import { ActionButtonProps } from "../components/EntityCRUD";
import { Card, DEFAULT_WORKSPACE_ID, Icon, InfoCard, PrimaryButton, SecondaryButton, TextInput, useIsMobile } from "../../shared";
import { ActionCardText, ButtonGroup, FormGroup, LeftColumn, RightColumn } from "./styles";
import { User } from "../../shared/models/user";
import { VisualUser } from "../users/types";
import { UserSelect } from "../users";


interface TeamDetailsProps {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
}

export const TeamDetails: React.FC<TeamDetailsProps> = ({ 
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
}) => {
    const [teamId, setTeamId] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState<VisualUser[]>([]);
    const [hasChanged, setHasChanged] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [goBack, setGoBack] = useState<() => void>(() => {});
    const [handleSubmit, setHandleSubmit] = useState<() => void>(() => {});
    const [isEditModeCallback, setIsEditModeCallback] = useState<() => boolean>(() => false);

    const isMobile = useIsMobile();

    const loadEntityDataStates = useCallback((entity: Team | null) => {
        setName(entity?.name ?? '');
        setDescription(entity?.description ?? '');
        setMembers(entity?.members?.map((member) => ({ ...member as User, color: getColorForUser(member as User) })) ?? []);
    }, []);

    const getEntityFromStates = useCallback((): Team => {
        return {
            workspace: { "id": DEFAULT_WORKSPACE_ID },
            name,
            description,
            members,
            id: teamId,
        };
    }, [name, description, members]);

    const getColorForUser = useCallback((user: User) => {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];
        const userId = user.id ?? '';
        return colors[userId.charCodeAt(0) % colors.length];
    }, []);

    const isEntityValidToSubmit = useCallback((team: Team): boolean => {
        const isValid = team.name.trim().length > 0 && hasChanged;
        return isValid
    }, [name, hasChanged]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setHasChanged(true);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setHasChanged(true);
    };

    const handleRemoveMember = useCallback((user: VisualUser) => {
        setMembers((prev) => prev.filter((member) => member.id !== user.id));
        setHasChanged(true);
    }, []);

    const handleSelectUser = useCallback((user: VisualUser) => {
        setMembers((prev) => [...prev, user]);
        setHasChanged(true);
    }, []);

    const getActionTitleText = () => {
      return isEditMode ? 'Persist changes' : 'Ready to create?';
    };
  
    const getActionDescriptionText = () => {
      return isEditMode ? 'The changes need to be persistsed' : 'Once created, you can add more members.';
    };

    const getCancelButtonText = () => {
      return isEditMode ? 'Return' : 'Cancel';
    };

    const getSubmitButtonText = (): string => {
      return isEditMode ? 'Save' : 'Create Team';
    };

    const renderActionButtons = () => {
        return (
          <ButtonGroup>
            <SecondaryButton onClick={goBack}>
              {getCancelButtonText()}
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSubmit}
              disabled={isSubmitting || !isEntityValidToSubmit(getEntityFromStates())}
            >
              <span>{isSubmitting ? 'Loading...' : getSubmitButtonText()}</span>
              <Icon name="arrow_forward" />
            </PrimaryButton>
          </ButtonGroup>
        );
      };

    return (
        <EntityDetailsPage<Team>
            entityEndpoint="api/teams"
            createButtonLabel="Create Team"
            updateButtonLabel="Update Team"
            isEntityValidToSubmit={isEntityValidToSubmit}
            setPageTitle={setPageTitle}
            setPrimaryActionButton={setPrimaryActionButton}
            setSecondaryActionButton={setSecondaryActionButton}
            setPageSubtitle={setPageSubtitle}
            loadEntityDataStates={loadEntityDataStates}
            getEntityFromStates={getEntityFromStates}
            pageTitle="Team Details"
            setIsEditModeCallback={setIsEditMode}
            setGoBackCallback={(fn) => setGoBack(() => fn)}
            setHandleSubmitCallback={(fn) => setHandleSubmit(() => fn)}
            setIsSubmittingCallback={(fn) => setIsSubmitting(() => fn)}
            showActionButtons={isMobile || isEditMode}
            setEntityIdCallback={(id) => setTeamId(id)}
        >
            <>
                <LeftColumn>
                    {/* Team Details Card */}
                    <Card title="Team Details">
                        <FormGroup>

                            <TextInput
                                label="Team Name"
                                placeholder="e.g. Platform Infrastructure"
                                value={name}
                                type="text"
                                onChange={handleNameChange}
                            />

                            <TextInput
                                label="Mission Description"
                                placeholder="Describe the team's mission, strategic focus, and key responsibilities..."
                                value={description}
                                type="textarea"
                                onChange={handleDescriptionChange}
                            />

                        </FormGroup>
                    </Card>

                    {/* Team Members Card */}
                    <Card title="Team Members" subtitle="Add existing users to this team.">
                        <UserSelect
                            users={members}
                            onSelectUser={handleSelectUser}
                            onRemoveUser={handleRemoveMember}
                        />
                    </Card>
                </LeftColumn>

                <RightColumn>
                    {/* Info Card */}
                    <InfoCard
                        icon="lightbulb"
                        title="Pro Tip"
                        description="Teams with clear mission statements have a higher engagement. Be specific about what this team owns."
                    />

                    {/* Actions Card - Desktop only */}
                    {!isMobile && !isEditMode && (
                        <Card sticky title={getActionTitleText()}>
                            <ActionCardText>
                                {getActionDescriptionText()}
                            </ActionCardText>
                            {renderActionButtons()}
                        </Card>
                    )}
                </RightColumn>
            </>
        </EntityDetailsPage>
    );
}