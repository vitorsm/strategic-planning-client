import { Icon } from "../../../shared/components/Icon";
import { TaskType } from "../../../shared/models/task-type";
import { HierarchyBranch, HierarchyConnector, HierarchyHorizontalLine, HierarchyItem, HierarchyNewItem, HierarchyTree, NewBadge, NewTaskTypeName, NewTaskTypePreview } from "../styles";

interface HierarchyTaskTypeTreeProps {
    taskType: TaskType;
    taskTypes: TaskType[];
    parentTaskType: TaskType | null;
}

// Recursively collect all ancestors from root to immediate parent
const getAncestorChain = (taskType: TaskType | null): TaskType[] => {
    if (!taskType) return [];
    const parentChain = getAncestorChain(taskType.parent_type);
    return [...parentChain, taskType];
};

// Recursive component to render nested hierarchy
const RenderAncestorBranch = ({
    ancestors,
    currentIndex,
    taskType
}: {
    ancestors: TaskType[];
    currentIndex: number;
    taskType: TaskType;
}) => {
    const isLastAncestor = currentIndex === ancestors.length - 1;
    const currentAncestor = ancestors[currentIndex];

    if (isLastAncestor) {
        // Last ancestor - render with the new task type as child
        return (
            <>
                <HierarchyItem>
                    <Icon name="folder_open" />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{currentAncestor.name}</span>
                </HierarchyItem>
                <HierarchyBranch>
                    <HierarchyConnector />
                    <HierarchyNewItem>
                        <HierarchyHorizontalLine />
                        <div style={{ paddingLeft: '24px', width: '100%' }}>
                            <NewTaskTypePreview $color={taskType.color}>
                                <Icon name={taskType.icon || 'help_outline'} />
                                <NewTaskTypeName>
                                    {taskType.name || '[New Task Type Name]'}
                                </NewTaskTypeName>
                                <NewBadge>New</NewBadge>
                            </NewTaskTypePreview>
                        </div>
                    </HierarchyNewItem>
                </HierarchyBranch>
            </>
        );
    }

    // Not the last ancestor - render with next ancestor as nested child
    return (
        <>
            <HierarchyItem>
                <Icon name="folder_open" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{currentAncestor.name}</span>
            </HierarchyItem>
            <HierarchyBranch>
                <HierarchyConnector />
                <HierarchyNewItem>
                    <HierarchyHorizontalLine />
                    <div style={{ paddingLeft: '24px', width: '100%' }}>
                        <RenderAncestorBranch
                            ancestors={ancestors}
                            currentIndex={currentIndex + 1}
                            taskType={taskType}
                        />
                    </div>
                </HierarchyNewItem>
            </HierarchyBranch>
        </>
    );
};

const HierarchyTaskTypeTree = ({
    taskType,
    taskTypes,
    parentTaskType
}: HierarchyTaskTypeTreeProps) => {
    // Get full ancestor chain from root to immediate parent
    const ancestors = getAncestorChain(parentTaskType);

    return (
        <HierarchyTree>
            {ancestors.length > 0 ? (
                <RenderAncestorBranch
                    ancestors={ancestors}
                    currentIndex={0}
                    taskType={taskType}
                />
            ) : (
                <NewTaskTypePreview $color={taskType.color}>
                    <Icon name={taskType.icon || 'help_outline'} />
                    <NewTaskTypeName>
                        {taskType.name || '[New Task Type Name]'}
                    </NewTaskTypeName>
                    <NewBadge>New</NewBadge>
                </NewTaskTypePreview>
            )}
        </HierarchyTree>
    );
};

export default HierarchyTaskTypeTree;