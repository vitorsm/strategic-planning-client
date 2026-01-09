import { useCallback, useState, useEffect } from "react";
import { Reminder, ReminderStatus } from "../../shared/models/reminder";
import { EntityDetailsPage } from "../components/EntityCRUD";
import { ActionButtonProps } from "../components/EntityCRUD";
import { Card, DEFAULT_WORKSPACE_ID, Icon, InfoCard, PrimaryButton, SecondaryButton, TextInput, useIsMobile, Dropdown } from "../../shared";
import { ActionCardText, ButtonGroup, FormGroup, LeftColumn, RightColumn } from "./styles";
import { User } from "../../shared/models/user";
import { VisualUser } from "../users/types";
import { UserSelect } from "../users";
import { Team } from "../../shared/models/team";
import { useFetchEntities } from "../../shared/hooks/generic-entities/useFetchEntities";
import { getVisualUser } from "../../shared/utils/user_utils";


interface ReminderDetailsProps {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
}

export const ReminderDetails: React.FC<ReminderDetailsProps> = ({ 
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
}) => {
    const [reminderId, setReminderId] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ReminderStatus>(ReminderStatus.PENDING);
    const [toUser, setToUser] = useState<VisualUser | null>(null);
    const [relatedUser, setRelatedUser] = useState<VisualUser | null>(null);
    const [relatedTeam, setRelatedTeam] = useState<Team | null>(null);
    const [hasChanged, setHasChanged] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [goBack, setGoBack] = useState<() => void>(() => {});
    const [handleSubmit, setHandleSubmit] = useState<() => void>(() => {});

    const isMobile = useIsMobile();
    const { entities: teams, fetchEntities: fetchTeams, isLoading: isLoadingTeams } = useFetchEntities<Team>('/api/teams');

    useEffect(() => {
        fetchTeams(DEFAULT_WORKSPACE_ID);
    }, [fetchTeams]);

    const loadEntityDataStates = useCallback((entity: Reminder | null) => {
        setName(entity?.name ?? '');
        setDescription(entity?.description ?? '');
        setStatus(entity?.status ?? ReminderStatus.PENDING);
        if (entity?.to_user) {
            setToUser(getVisualUser(entity.to_user as User));
        }
        if (entity?.related_user) {
            setRelatedUser(getVisualUser(entity.related_user as User));
        }
        setRelatedTeam(entity?.related_team ?? null);
    }, []);

    const getEntityFromStates = useCallback((): Reminder => {
        return {
            workspace: { "id": DEFAULT_WORKSPACE_ID },
            name,
            description,
            status,
            to_user: toUser as User,
            related_user: relatedUser as User | null,
            related_team: relatedTeam,
            id: reminderId,
        };
    }, [name, description, status, toUser, relatedUser, relatedTeam, reminderId]);

    const isEntityValidToSubmit = useCallback((reminder: Reminder): boolean => {
        const isValid = reminder.name.trim().length > 0 && reminder.to_user !== null && hasChanged;
        return isValid;
    }, [hasChanged]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setHasChanged(true);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setHasChanged(true);
    };

    const handleToUserSelect = useCallback((user: VisualUser) => {
        setToUser(user);
        setHasChanged(true);
    }, []);

    const handleToUserRemove = useCallback((user: VisualUser) => {
        setToUser(null);
        setHasChanged(true);
    }, []);

    const handleRelatedUserSelect = useCallback((user: VisualUser) => {
        setRelatedUser(user);
        setHasChanged(true);
    }, []);

    const handleRelatedUserRemove = useCallback((user: VisualUser) => {
        setRelatedUser(null);
        setHasChanged(true);
    }, []);

    const handleRelatedTeamSelect = useCallback((team: Team | null) => {
        setRelatedTeam(team);
        setHasChanged(true);
    }, []);

    const getActionTitleText = () => {
      return isEditMode ? 'Persist changes' : 'Ready to create?';
    };
  
    const getActionDescriptionText = () => {
      return isEditMode ? 'The changes need to be persisted' : 'Once created, the reminder will be sent to the user.';
    };

    const getCancelButtonText = () => {
      return isEditMode ? 'Return' : 'Cancel';
    };

    const getSubmitButtonText = (): string => {
      return isEditMode ? 'Save' : 'Create Reminder';
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
        <EntityDetailsPage<Reminder>
            entityEndpoint="api/reminders"
            createButtonLabel="Create Reminder"
            updateButtonLabel="Update Reminder"
            isEntityValidToSubmit={isEntityValidToSubmit}
            setPageTitle={setPageTitle}
            setPrimaryActionButton={setPrimaryActionButton}
            setSecondaryActionButton={setSecondaryActionButton}
            setPageSubtitle={setPageSubtitle}
            loadEntityDataStates={loadEntityDataStates}
            getEntityFromStates={getEntityFromStates}
            pageTitle="Reminder Details"
            setIsEditModeCallback={setIsEditMode}
            setGoBackCallback={(fn) => setGoBack(() => fn)}
            setHandleSubmitCallback={(fn) => setHandleSubmit(() => fn)}
            setIsSubmittingCallback={(fn) => setIsSubmitting(() => fn)}
            showActionButtons={isMobile || isEditMode}
            setEntityIdCallback={(id) => setReminderId(id)}
            entityDisplayName="reminder"
        >
            <>
                <LeftColumn>
                    {/* Reminder Details Card */}
                    <Card title="Reminder Details">
                        <FormGroup>
                            <TextInput
                                label="Reminder Title"
                                placeholder="e.g. Review quarterly goals"
                                value={name}
                                type="text"
                                onChange={handleNameChange}
                            />

                            <TextInput
                                label="Description"
                                placeholder="Provide additional context or instructions for this reminder..."
                                value={description}
                                type="textarea"
                                onChange={handleDescriptionChange}
                            />
                        </FormGroup>
                    </Card>

                    {/* Recipient Card */}
                    <Card title="Recipient" subtitle="Who should receive this reminder?">
                        <FormGroup>
                            <UserSelect 
                                users={toUser ? [toUser] : []}
                                onSelectUser={handleToUserSelect}
                                onRemoveUser={handleToUserRemove}
                            />
                        </FormGroup>
                    </Card>

                    {/* Related Context Card */}
                    <Card title="Related Context (Optional)" subtitle="Link this reminder to a user or team for context">
                        <FormGroup>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Related User</label>
                                <UserSelect 
                                    users={relatedUser ? [relatedUser] : []}
                                    onSelectUser={handleRelatedUserSelect}
                                    onRemoveUser={handleRelatedUserRemove}
                                />
                            </div>

                            <Dropdown
                                options={teams}
                                selectedValue={relatedTeam}
                                onSelect={handleRelatedTeamSelect}
                                getOptionLabel={(option) => option.name}
                                getOptionKey={(option) => option.id!}
                                getOptionChildren={() => []}
                                label="Related Team"
                                placeholder="Search for team..."
                                leftIcon={isLoadingTeams ? 'loading' : 'search'}
                            />
                        </FormGroup>
                    </Card>
                </LeftColumn>

                <RightColumn>
                    {/* Info Card */}
                    <InfoCard
                        icon="lightbulb"
                        title="Pro Tip"
                        description="Use reminders to keep your team aligned on important tasks and deadlines. Link them to users or teams for better context."
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
