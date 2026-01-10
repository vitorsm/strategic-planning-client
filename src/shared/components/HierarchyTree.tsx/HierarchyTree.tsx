import { useCallback } from "react";
import { Icon } from "../Icon";
import { HierarchyBranch, HierarchyConnector, HierarchyHorizontalLine, HierarchyItem, HierarchyNewItem, HierarchyTree, NewBadge, NewTaskTypeName, NewTaskTypePreview } from "./styles";

type GenericTypeEntity = {
    [key: string]: any;
};

interface HierarchyTaskTypeTreeProps<T extends GenericTypeEntity> {
    selectedEntity: T;
    selectedEntityParent: T | null;
    parentEntityAttributeName: string;
    nameAttributeName?: string;
    iconAttributeName?: string;
    colorAttributeName?: string;
}

interface RenderAncestorBranchProps<T extends GenericTypeEntity> {
    ancestors: T[];
    currentIndex: number;
    selectedEntity: T;
    parentEntityAttributeName: string;
    nameAttributeName?: string;
    iconAttributeName?: string;
    colorAttributeName?: string;
}

// Recursively collect all ancestors from root to immediate parent
const getAncestorChain = <T extends GenericTypeEntity>(entity: T | null, parentEntityAttributeName: string): any[] => {
    if (!entity) return [];
    
    const parentChain = getAncestorChain(entity[parentEntityAttributeName] as T, parentEntityAttributeName);
    return [...parentChain, entity];
}

// Recursive component to render nested hierarchy
const RenderAncestorBranch = <T extends GenericTypeEntity>({
    ancestors,
    currentIndex,
    selectedEntity,
    parentEntityAttributeName,
    nameAttributeName='name',
    iconAttributeName='icon',
    colorAttributeName='black'
}: RenderAncestorBranchProps<T>) => {
    const isLastAncestor = currentIndex === ancestors.length - 1;
    const currentAncestor = ancestors[currentIndex];

    if (isLastAncestor) {
        // Last ancestor - render with the new task type as child
        return (
            <>
                <HierarchyItem>
                    <Icon name="folder_open" />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{currentAncestor[nameAttributeName]}</span>
                </HierarchyItem>
                <HierarchyBranch>
                    <HierarchyConnector />
                    <HierarchyNewItem>
                        <HierarchyHorizontalLine />
                        <div style={{ paddingLeft: '24px', width: '100%' }}>
                            <NewTaskTypePreview $color={selectedEntity[colorAttributeName]}>
                                <Icon name={selectedEntity[iconAttributeName] || 'help_outline'} />
                                <NewTaskTypeName>
                                    {selectedEntity[nameAttributeName] || '[New Item]'}
                                </NewTaskTypeName>
                                <NewBadge>Selected</NewBadge>
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
                            selectedEntity={selectedEntity}
                            parentEntityAttributeName={parentEntityAttributeName}
                            nameAttributeName={nameAttributeName}
                            iconAttributeName={iconAttributeName}
                            colorAttributeName={colorAttributeName}
                        />
                    </div>
                </HierarchyNewItem>
            </HierarchyBranch>
        </>
    );
};

const HierarchyTreeComponent = <T extends GenericTypeEntity>({
    selectedEntity,
    selectedEntityParent,
    parentEntityAttributeName,
    nameAttributeName='name',
    iconAttributeName='icon',
    colorAttributeName='black'
}: HierarchyTaskTypeTreeProps<T>) => {
    // Get full ancestor chain from root to immediate parent
    const ancestors = getAncestorChain<T>(selectedEntityParent, parentEntityAttributeName);

    return (
        <HierarchyTree>
            {ancestors.length > 0 ? (
                <RenderAncestorBranch
                    ancestors={ancestors}
                    currentIndex={0}
                    selectedEntity={selectedEntity}
                    parentEntityAttributeName={parentEntityAttributeName}
                    nameAttributeName={nameAttributeName}
                    iconAttributeName={iconAttributeName}
                    colorAttributeName={colorAttributeName}
                />
            ) : (
                <NewTaskTypePreview $color={selectedEntity[colorAttributeName]}>
                    <Icon name={selectedEntity[iconAttributeName] || 'help_outline'} />
                    <NewTaskTypeName>
                        {selectedEntity[nameAttributeName] || '[New Item]'}
                    </NewTaskTypeName>
                    <NewBadge>New</NewBadge>
                </NewTaskTypePreview>
            )}
        </HierarchyTree>
    );
};

export default HierarchyTreeComponent;