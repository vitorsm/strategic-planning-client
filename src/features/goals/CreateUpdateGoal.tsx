import { useCallback, useState, useEffect } from "react";
import { Goal, GoalType, GoalStatus } from "../../shared/models/goal";
import { CreateUpdateEntityPage } from "../components/EntityCRUD";
import { ActionButtonProps } from "../components/EntityCRUD";
import { Card, DEFAULT_WORKSPACE_ID, Icon, InfoCard, PrimaryButton, SecondaryButton, TextInput, useIsMobile, DatePicker, Dropdown, IconRadioGroup } from "../../shared";
import type { IconRadioOption } from "../../shared";
import { 
    ActionCardText, 
    ButtonGroup, 
    FormGroup, 
    LeftColumn, 
    RightColumn,
    HelperText,
    ThreeColumnGrid,
    Divider,
    ParentGoalWrapper,
    HierarchyPreviewContainer,
    PreviewLabel
} from "./styles";
import { User } from "../../shared/models/user";
import { VisualUser } from "../users/types";
import { Team } from "../../shared/models/team";
import { useFetchEntities } from "../../shared/hooks/generic-entities/useFetchEntities";
import { getVisualUser } from "../../shared/utils/user_utils";
import { HierarchyTree } from "../../shared/components/HierarchyTree.tsx";
import { useFetchUsers } from "../../shared/hooks/users/useFetchUsers";
import { useSearchParams } from "react-router-dom";


interface CreateUpdateGoalProps {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
}

export const CreateUpdateGoal: React.FC<CreateUpdateGoalProps> = ({ 
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
}) => {
    const [goalId, setGoalId] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<GoalType>(GoalType.ORGANIZATIONAL);
    const [status, setStatus] = useState<GoalStatus>(GoalStatus.NOT_STARTED);
    const [dueDate, setDueDate] = useState('');
    const [user, setUser] = useState<VisualUser | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [parentGoal, setParentGoal] = useState<Goal | null>(null);
    const [hasChanged, setHasChanged] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [goBack, setGoBack] = useState<() => void>(() => {});
    const [handleSubmit, setHandleSubmit] = useState<() => void>(() => {});

    const isMobile = useIsMobile();
    const { entities: teams, fetchEntities: fetchTeams, isLoading: isLoadingTeams } = useFetchEntities<Team>('/api/teams');
    const { entities: goals, fetchEntities: fetchGoals, isLoading: isLoadingGoals } = useFetchEntities<Goal>('/api/goals');
    const { users, isLoading, error, fetchUsers } = useFetchUsers({ workspaceId: DEFAULT_WORKSPACE_ID });

    const [searchParams, setSearchParams] = useSearchParams();

    const parentId = searchParams.get('parent_id');

    // Status options for dropdown
    const statusOptions = [
        { id: GoalStatus.NOT_STARTED, name: 'Not Started', status: GoalStatus.NOT_STARTED },
        { id: GoalStatus.IN_PROGRESS, name: 'In Progress', status: GoalStatus.IN_PROGRESS },
        { id: GoalStatus.DONE, name: 'Done', status: GoalStatus.DONE },
        { id: GoalStatus.ARCHIVED, name: 'Archived', status: GoalStatus.ARCHIVED },
    ];

    const selectedStatusOption = statusOptions.find(opt => opt.status === status) || null;

    // Goal type options for IconRadioGroup
    const goalTypeOptions: IconRadioOption[] = [
        {
            value: GoalType.ORGANIZATIONAL,
            icon: 'domain',
            title: 'Organizational Goal',
            description: 'Contributes to company-wide strategic initiatives. Visible to everyone.',
        },
        {
            value: GoalType.PERSONAL,
            icon: 'person',
            title: 'Personal Goal',
            description: 'Focused on individual career growth and skill development.',
        },
    ];

    useEffect(() => {
        fetchTeams(DEFAULT_WORKSPACE_ID);
        fetchGoals(DEFAULT_WORKSPACE_ID);
        fetchUsers(DEFAULT_WORKSPACE_ID);
    }, [fetchTeams, fetchGoals, fetchUsers]);

    const findGoalInTree = useCallback((id: string, goals: Goal[]): Goal | null => {
        for (const goal of goals) {
            if (goal.id === id) {
                return goal;
            }
            const childGoal = findGoalInTree(id, goal.children);
            if (childGoal) {
                return childGoal;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        if (parentId) {
            const goal = findGoalInTree(parentId, goals);
            if (goal) {
                setParentGoal(goal);
            }
        }
    }, [parentId, goals]);

    const loadEntityDataStates = useCallback((entity: Goal | null) => {
        setName(entity?.name ?? '');
        setDescription(entity?.description ?? '');
        setType(entity?.type ?? GoalType.ORGANIZATIONAL);
        setStatus(entity?.status ?? GoalStatus.NOT_STARTED);
        setDueDate(entity?.due_date ? new Date(entity.due_date).toISOString().split('T')[0] : '');
        if (entity?.user) {
            setUser(getVisualUser(entity.user as User));
        }
        setTeam(entity?.team ?? null);
        setParentGoal(entity?.parent_goal ?? null);
    }, []);

    const getEntityFromStates = useCallback((): Goal => {
        return {
            workspace: { "id": DEFAULT_WORKSPACE_ID },
            name,
            description,
            type,
            status,
            due_date: new Date(dueDate),
            user: user as User | null,
            team: team,
            parent_goal: parentGoal,
            children: [],
            id: goalId,
        };
    }, [name, description, type, status, dueDate, user, team, parentGoal, goalId]);

    const isEntityValidToSubmit = useCallback((goal: Goal): boolean => {
        const isValid = goal.name.trim().length > 0 && goal.due_date !== null && goal.type != null && (!!goal.team || !!goal.user);
        return isValid && hasChanged;
    }, [hasChanged]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setHasChanged(true);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setHasChanged(true);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value as GoalType);
        setHasChanged(true);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as GoalStatus);
        setHasChanged(true);
    };

    const handleStatusSelect = useCallback((selectedOption: { id: string; name: string; status: GoalStatus } | null) => {
        if (selectedOption) {
            setStatus(selectedOption.status);
            setHasChanged(true);
        }
    }, []);

    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDueDate(e.target.value);
        setHasChanged(true);
    };

    const handleUserSelect = useCallback((selectedUser: VisualUser) => {
        setUser(selectedUser);
        setHasChanged(true);
    }, []);

    const handleUserRemove = useCallback(() => {
        setUser(null);
        setHasChanged(true);
    }, []);

    const handleUserDropdownSelect = useCallback((selectedUser: User | null) => {
        if (selectedUser) {
            setUser(getVisualUser(selectedUser));
        } else {
            setUser(null);
        }
        setHasChanged(true);
    }, []);

    // Find the current user in the users list for dropdown
    const selectedUserEntity = user ? (user as User) : null;

    const handleTeamSelect = useCallback((selectedTeam: Team | null) => {
        setTeam(selectedTeam);
        setHasChanged(true);
    }, []);

    const handleParentGoalSelect = useCallback((selectedGoal: Goal | null) => {
        setParentGoal(selectedGoal);
        setHasChanged(true);
    }, []);

    const getActionTitleText = () => {
      return isEditMode ? 'Persist changes' : 'Ready to create?';
    };
  
    const getActionDescriptionText = () => {
      return isEditMode ? 'The changes need to be persisted' : 'Once created, the goal will be tracked and can be linked to other goals.';
    };

    const getCancelButtonText = () => {
      return isEditMode ? 'Return' : 'Cancel';
    };

    const getSubmitButtonText = (): string => {
      return isEditMode ? 'Save' : 'Create Goal';
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
        <CreateUpdateEntityPage<Goal>
            entityEndpoint="api/goals"
            createButtonLabel="Create Goal"
            updateButtonLabel="Update Goal"
            isEntityValidToSubmit={isEntityValidToSubmit}
            setPageTitle={setPageTitle}
            setPrimaryActionButton={setPrimaryActionButton}
            setSecondaryActionButton={setSecondaryActionButton}
            setPageSubtitle={setPageSubtitle}
            loadEntityDataStates={loadEntityDataStates}
            getEntityFromStates={getEntityFromStates}
            pageTitle="Goal Details"
            pageSubtitle="Define objectives, hierarchies, and ownership."
            setIsEditModeCallback={setIsEditMode}
            setGoBackCallback={(fn) => setGoBack(() => fn)}
            setHandleSubmitCallback={(fn) => setHandleSubmit(() => fn)}
            setIsSubmittingCallback={(fn) => setIsSubmitting(() => fn)}
            showActionButtons={isMobile || isEditMode}
            setEntityIdCallback={(id) => setGoalId(id)}
            entityDisplayName="goal"
        >
            <>
                <LeftColumn>
                    <Card>
                        <FormGroup>
                            {/* Goal Type Selection */}
                            <div>
                                <IconRadioGroup
                                    name="goal_type"
                                    options={goalTypeOptions}
                                    selectedValue={type}
                                    onChange={(value) => {
                                        setType(value as GoalType);
                                        setHasChanged(true);
                                    }}
                                />
                            </div>

                            {/* Parent Goal Selection */}
                            <ParentGoalWrapper>
                                <Dropdown
                                    options={goals}
                                    selectedValue={parentGoal}
                                    onSelect={handleParentGoalSelect}
                                    getOptionLabel={(option) => option.name}
                                    getOptionKey={(option) => option.id!}
                                    getOptionChildren={(option) => option.children}
                                    label="Parent Goal"
                                    placeholder="Select a parent goal..."
                                    leftIcon="account_tree"
                                    required={false}
                                    clearable={true}
                                    defaultExpandAll={false}
                                    emptyMessage="No goals available"
                                />
                                <HelperText>
                                    Establishing the correct hierarchy ensures proper alignment visibility.
                                </HelperText>
                            </ParentGoalWrapper>

                            <HierarchyPreviewContainer>
                                <PreviewLabel>Preview Structure</PreviewLabel>
                                <HierarchyTree<Goal> 
                                    selectedEntity={getEntityFromStates()}
                                    selectedEntityParent={parentGoal} 
                                    parentEntityAttributeName="parent_goal" />
                            </HierarchyPreviewContainer>
                        </FormGroup>

                        <Divider />
                        
                        <FormGroup>
                            {/* Goal Name */}
                            <TextInput
                                label="Goal Name"
                                placeholder="e.g. Reduce average API latency by 20%"
                                value={name}
                                type="text"
                                onChange={handleNameChange}
                                required
                            />

                            {/* Description */}
                            <TextInput
                                label="Description"
                                placeholder="Describe the success criteria, key results, and scope of this goal..."
                                value={description}
                                type="textarea"
                                onChange={handleDescriptionChange}
                            />
                        </FormGroup>
                    </Card>

                    <Card title="When should this goal be completed?" subtitle="Set a specific, realistic deadline aligned with milestones, allowing buffer for uncertainty, clearly stating when success is evaluated">
                        <FormGroup>
                            <ThreeColumnGrid>
                                {/* Due Date */}
                                <DatePicker
                                    label="Due Date"
                                    value={dueDate}
                                    onChange={handleDueDateChange}
                                    required
                                />

                                {/* Status */}
                                <Dropdown
                                        options={statusOptions}
                                        selectedValue={selectedStatusOption}
                                        onSelect={handleStatusSelect}
                                        getOptionLabel={(option) => option.name}
                                        getOptionKey={(option) => option.id}
                                        getOptionChildren={() => []}
                                        label="Status"
                                        placeholder="Select status"
                                        showSearchIcon={false}
                                        required={false}
                                        clearable={false}
                                    />
                            </ThreeColumnGrid>
                        </FormGroup>
                    </Card>

                    <Card title="Who is responsible for this goal?" subtitle="This will help you track progress and ensure timely completion. You need to select at least one of the following:">
                        <FormGroup>
                            {/* Status, User, Team Grid */}
                            <ThreeColumnGrid>
                                {/* User */}
                                <Dropdown
                                    options={users}
                                    selectedValue={selectedUserEntity}
                                    onSelect={handleUserDropdownSelect}
                                    getOptionLabel={(option) => option.name}
                                    getOptionKey={(option) => option.id}
                                    getOptionChildren={() => []}
                                    label="User"
                                    placeholder="Unassigned"
                                    leftIcon="person"
                                    required={false}
                                    clearable={true}
                                />

                                {/* Team */}
                                <Dropdown
                                    options={teams}
                                    selectedValue={team}
                                    onSelect={handleTeamSelect}
                                    getOptionLabel={(option) => option.name}
                                    getOptionKey={(option) => option.id!}
                                    getOptionChildren={() => []}
                                    label="Team"
                                    placeholder="No Team"
                                    leftIcon="groups"
                                    required={false}
                                    clearable={true}
                                />
                            </ThreeColumnGrid>
                        </FormGroup>
                    </Card>
                </LeftColumn>

                <RightColumn>
                    {/* Info Card */}
                    <InfoCard
                        icon="lightbulb"
                        title="Pro Tip"
                        description="Goals can be hierarchical. Use parent goals to create a tree structure that reflects your organizational strategy. Personal goals are tracked per individual, while organizational goals belong to teams."
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
        </CreateUpdateEntityPage>
    );
}

