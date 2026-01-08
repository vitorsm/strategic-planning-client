import { useCallback, useEffect, useState } from "react";
import { TaskType } from "../../shared/models/task-type";
import { EntityDetailsPage } from "../components/EntityCRUD";
import { ActionButtonProps } from "../components/EntityCRUD";
import { Card, ColorPicker, DEFAULT_WORKSPACE_ID, Dropdown, Icon, IconPicker, InfoCard, PrimaryButton, SecondaryButton, TextInput, useIsMobile } from "../../shared";
import {
    ActionCardText,
    ButtonGroup,
    FormGroup,
    LeftColumn,
    RightColumn,
    FormSection,
    FormLabel,
    FormRow,
    FormColumn,
    IconSelectionRow,
    IconButton,
    AddIconButton,
    ColorSelectionRow,
    ColorButton,
    AddColorButton,
    FormDivider,
    SectionTitle,
    SectionDescription,
    HierarchyPreviewContainer,
    PreviewLabel,
    BestPracticesList,
    BestPracticeItem,
    SuccessIcon,
    WarningIcon,
} from "./styles";
import HierarchyTaskTypeTree from "./components/HierarchyTaskTypeTree";
import { useFetchTaskTypes } from "./hooks/useFetchTaskTypes";


interface TaskTypeDetailsProps {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
}

const AVAILABLE_ICONS = ['bug_report', 'rocket_launch', 'check_circle', 'group', 'code', 'lightbulb', 'schedule', 'star'];

const AVAILABLE_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Cyan', value: '#06b6d4' },
];

// Mock data for parent categories - in real app, this would come from API
const MOCK_ROOT_TYPES: (TaskType & { childCount: number })[] = [
    { id: '1', name: 'Product Development', color: '#8b5cf6', icon: 'folder', parent_type: null, children: [{ id: '2', name: 'Engineering Strategy', color: '#3b82f6', icon: 'folder', parent_type: null, children: [], workspace: {} }], workspace: {}, childCount: 5 },
    { id: '3', name: 'Incident / On-Call', color: '#ef4444', icon: 'folder', parent_type: null, children: [], workspace: {}, childCount: 2 },
    { id: '4', name: 'People Management', color: '#22c55e', icon: 'folder', parent_type: null, children: [], workspace: {}, childCount: 3 },
];

export const TaskTypeDetails: React.FC<TaskTypeDetailsProps> = ({ 
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
}) => {
    const [taskTypeId, setTaskTypeId] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('bug_report');
    const [color, setColor] = useState('#3b82f6');
    const [description, setDescription] = useState('');
    const [parentCategory, setParentCategory] = useState<TaskType | null>(null);
    const [hasChanged, setHasChanged] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [goBack, setGoBack] = useState<() => void>(() => { });
    const [handleSubmit, setHandleSubmit] = useState<() => void>(() => { });
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [availableIcons, setAvailableIcons] = useState(AVAILABLE_ICONS);
    const [availableColors, setAvailableColors] = useState(AVAILABLE_COLORS);
    const { taskTypes, isLoading: isLoadingTaskTypes, error, fetchTaskTypes } = useFetchTaskTypes();

    const isMobile = useIsMobile();

    useEffect(() => {
        fetchTaskTypes(DEFAULT_WORKSPACE_ID);
    }, [fetchTaskTypes]);

    const loadEntityDataStates = useCallback((entity: TaskType | null) => {
        setName(entity?.name ?? '');
        setIcon(entity?.icon ?? 'bug_report');
        setColor(entity?.color ?? '#3b82f6');
        setParentCategory(entity?.parent_type ?? null);
    }, []);

    const getEntityFromStates = useCallback((): TaskType => {
        return {
            workspace: { "id": DEFAULT_WORKSPACE_ID },
            name,
            icon,
            color,
            parent_type: parentCategory,
            children: [],
            id: taskTypeId,
        };
    }, [name, icon, color, taskTypeId, parentCategory]);

    const isEntityValidToSubmit = useCallback((taskType: TaskType): boolean => {
        const isValid = taskType.name.trim().length > 0 && taskType.icon.trim().length > 0 && taskType.color.trim().length > 0;
        return isValid && hasChanged;
    }, [hasChanged]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setHasChanged(true);
    };

    const handleIconSelect = (selectedIcon: string) => {
        setIcon(selectedIcon);
        setHasChanged(true);

        // Add selected icon to quick-access if not already there
        if (!availableIcons.includes(selectedIcon)) {
            setAvailableIcons(prev => [selectedIcon, ...prev.slice(0, -1)]);
        }
    };

    const handleColorSelect = (selectedColor: string) => {
        setColor(selectedColor);
        setHasChanged(true);
    };

    const handleColorPickerSelect = (colorOption: { name: string; value: string }) => {
        setColor(colorOption.value);
        setHasChanged(true);

        // Add selected color to quick-access if not already there
        if (!availableColors.some(c => c.value === colorOption.value)) {
            setAvailableColors(prev => [colorOption, ...prev.slice(0, -1)]);
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
        setHasChanged(true);
    };

    const handleParentCategorySelect = (category: TaskType | null) => {
        setParentCategory(category);
        setHasChanged(true);
    };

    const getActionTitleText = () => {
      return isEditMode ? 'Persist changes' : 'Ready to create?';
    };
  
    const getActionDescriptionText = () => {
      return isEditMode ? 'The changes need to be persisted' : 'Once created, you can customize further.';
    };

    const getCancelButtonText = () => {
      return isEditMode ? 'Return' : 'Cancel';
    };

    const getSubmitButtonText = (): string => {
      return isEditMode ? 'Save' : 'Create Task Type';
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
                    <Icon name="save" />
              <span>{isSubmitting ? 'Loading...' : getSubmitButtonText()}</span>
            </PrimaryButton>
          </ButtonGroup>
        );
      };

    return (
        <EntityDetailsPage<TaskType>
            entityEndpoint="api/task-types"
            createButtonLabel="Create Task Type"
            updateButtonLabel="Update Task Type"
            isEntityValidToSubmit={isEntityValidToSubmit}
            setPageTitle={setPageTitle}
            setPrimaryActionButton={setPrimaryActionButton}
            setSecondaryActionButton={setSecondaryActionButton}
            setPageSubtitle={setPageSubtitle}
            loadEntityDataStates={loadEntityDataStates}
            getEntityFromStates={getEntityFromStates}
            pageTitle="Define New Task Type"
            pageSubtitle="Create a new category to organize engineering work. Properly defined task types help visualize where effort is being spent across the organization."
            setIsEditModeCallback={setIsEditMode}
            setGoBackCallback={(fn) => setGoBack(() => fn)}
            setHandleSubmitCallback={(fn) => setHandleSubmit(() => fn)}
            setIsSubmittingCallback={(fn) => setIsSubmitting(() => fn)}
            showActionButtons={isMobile || isEditMode}
            setEntityIdCallback={(id) => setTaskTypeId(id)}
            entityDisplayName="task type"
        >
            <>
                <LeftColumn>
                    {/* Task Type Details Card */}
                    <Card>
                        <FormGroup>
                            {/* Task Type Name */}
                            <TextInput
                                label="Task Type Name"
                                placeholder="e.g., Incident Management"
                                value={name}
                                type="text"
                                onChange={handleNameChange}
                            />

                            {/* Icon and Color Selection Row */}
                            <FormRow>
                                <FormColumn>
                                    <FormSection>
                                        <FormLabel>Icon Representation</FormLabel>
                                        <IconSelectionRow>
                                            {availableIcons.map((iconName) => (
                                                <IconButton
                                                    key={iconName}
                                                    type="button"
                                                    $selected={icon === iconName}
                                                    onClick={() => handleIconSelect(iconName)}
                                                    aria-label={`Select ${iconName} icon`}
                                                >
                                                    <Icon name={iconName} />
                                                </IconButton>
                                            ))}
                                            <AddIconButton
                                                type="button"
                                                aria-label="More Icons"
                                                onClick={() => setIsIconPickerOpen(true)}
                                            >
                                                <Icon name="add" />
                                            </AddIconButton>
                                        </IconSelectionRow>
                                    </FormSection>
                                </FormColumn>
                                <FormColumn>
                                    <FormSection>
                                        <FormLabel>Color Tag</FormLabel>
                                        <ColorSelectionRow>
                                            {availableColors.map((colorOption) => (
                                                <ColorButton
                                                    key={colorOption.value}
                                                    type="button"
                                                    $color={colorOption.value}
                                                    $selected={color === colorOption.value}
                                                    onClick={() => handleColorSelect(colorOption.value)}
                                                    aria-label={colorOption.name}
                                                />
                                            ))}
                                            <AddColorButton
                                                type="button"
                                                aria-label="More Colors"
                                                onClick={() => setIsColorPickerOpen(true)}
                                            >
                                                <Icon name="add" />
                                            </AddColorButton>
                                        </ColorSelectionRow>
                                    </FormSection>
                                </FormColumn>
                            </FormRow>

                            {/* Definition / Scope */}
                            <TextInput
                                label="Definition / Scope"
                                placeholder="Describe what constitutes this task type and when it should be used. This helps EMs categorize work consistently."
                                value={description}
                                type="textarea"
                                onChange={handleDescriptionChange}
                            />

                            <FormDivider />

                            {/* Hierarchy Placement */}
                            <FormSection>
                                <SectionTitle>Hierarchy Placement</SectionTitle>
                                <SectionDescription>
                                    Select a parent category to nest this task type. Leave empty for a top-level category.
                                </SectionDescription>
                            </FormSection>

                            <Dropdown
                                options={taskTypes}
                                selectedValue={parentCategory}
                                onSelect={handleParentCategorySelect}
                                getOptionLabel={(option) => option.name}
                                getOptionKey={(option) => option.id!}
                                getOptionChildren={(option) => option.children}
                                label="Parent Category"
                                placeholder="Search for parent category..."
                                leftIcon={isLoadingTaskTypes ? 'loading' : 'search'}
                            />

                            {/* Preview Structure */}
                            <HierarchyPreviewContainer>
                                <PreviewLabel>Preview Structure</PreviewLabel>
                                <HierarchyTaskTypeTree taskType={getEntityFromStates()} taskTypes={MOCK_ROOT_TYPES} parentTaskType={parentCategory} />
                            </HierarchyPreviewContainer>
                        </FormGroup>
                    </Card>
                </LeftColumn>

                <RightColumn>
                    {/* Best Practices Info Card */}
                    <InfoCard
                        icon="lightbulb"
                        title="Best Practices"
                        description="">
                        <BestPracticesList>
                            <BestPracticeItem>
                                <SuccessIcon className="material-symbols-outlined">check_circle</SuccessIcon>
                                <span>Keep task types broad enough to capture meaningful buckets of time (e.g., &gt; 10% of a week).</span>
                            </BestPracticeItem>
                            <BestPracticeItem>
                                <SuccessIcon className="material-symbols-outlined">check_circle</SuccessIcon>
                                <span>Use nesting to group related activities (e.g., "Interviews" under "Hiring").</span>
                            </BestPracticeItem>
                            <BestPracticeItem>
                                <WarningIcon className="material-symbols-outlined">warning</WarningIcon>
                                <span>Avoid creating task types for specific one-off projects. Use "Project Work" instead.</span>
                            </BestPracticeItem>
                        </BestPracticesList>
                    </InfoCard>

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

                <IconPicker
                    isOpen={isIconPickerOpen}
                    onClose={() => setIsIconPickerOpen(false)}
                    onSelect={handleIconSelect}
                    selectedIcon={icon}
                    previewColor={color}
                />

                <ColorPicker
                    isOpen={isColorPickerOpen}
                    onClose={() => setIsColorPickerOpen(false)}
                    onSelect={handleColorPickerSelect}
                    selectedColor={color}
                />
            </>
        </EntityDetailsPage>
    );
}
