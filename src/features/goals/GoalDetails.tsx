import { useNavigate, useParams } from "react-router-dom";
import { EntityDetailsPage } from "../components/EntityCRUD";
import { GenericCreateUpdateEntityPageProps } from "../components/EntityCRUD/pages/RoutePage";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useFetchEntity } from "../../shared/hooks/generic-entities/useFetchEntity";
import { Goal, GoalStatus, GoalType } from "../../shared/models/goal";
import { Icon } from "../../shared/components/Icon";
import {
    GoalDetailsContainer,
    GoalHeaderCard,
    GoalHeaderContent,
    GoalHeaderTop,
    GoalHeaderLeft,
    GoalTypeBadge,
    GoalTitle,
    GoalDescription,
    GoalMetadataGrid,
    MetadataItem,
    MetadataIconWrapper,
    MetadataContent,
    MetadataLabel,
    MetadataValue,
    StatusBadge,
    ChildGoalsSection,
    VerticalLine,
    ChildGoalCard,
    ChildGoalCardInner,
    ChildGoalHeader,
    ChildGoalLeft,
    ExpandButton,
    ChildGoalContent,
    ChildGoalName,
    ChildGoalMeta,
    ChildGoalRight,
    AssigneeAvatar,
    SubGoalsContainer,
    EmptyState,
} from "./styles";

export const GoalDetails: React.FC<GenericCreateUpdateEntityPageProps> = ({ 
    setPageTitle,
    setPrimaryActionButton,
    setPageSubtitle,
    setSecondaryActionButton,
}) => {
    const goalId = useParams<{ entity_id: string }>().entity_id;
    const navigate = useNavigate();
    const { fetchEntity, entity: goal, isLoading, error } = useFetchEntity<Goal>('/api/goals');
    const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (goalId) {
            fetchEntity(goalId);
        }
    }, [goalId, fetchEntity]);

    const toggleExpand = useCallback((id: string) => {
        setExpandedGoals(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    // Memoize the secondary action button to prevent infinite loops
    const secondaryActionButton = useMemo(() => ({
        label: "Add child goal",
        onClick: () => navigate("/goals/new?parent_id=" + goalId + "&return_page=" + encodeURIComponent(window.location.pathname)),
        icon: "add" as const,
    }), [navigate, goalId]);

    const getStatusColor = (status: GoalStatus): string => {
        switch (status) {
            case GoalStatus.DONE:
                return '#22c55e';
            case GoalStatus.IN_PROGRESS:
                return '#3b82f6';
            case GoalStatus.NOT_STARTED:
                return '#fbbf24';
            case GoalStatus.ARCHIVED:
                return '#64748b';
            default:
                return '#64748b';
        }
    };

    const getStatusVariant = (status: GoalStatus): 'success' | 'warning' | 'error' | 'info' => {
        switch (status) {
            case GoalStatus.DONE:
                return 'success';
            case GoalStatus.IN_PROGRESS:
                return 'info';
            case GoalStatus.NOT_STARTED:
                return 'warning';
            case GoalStatus.ARCHIVED:
                return 'error';
            default:
                return 'info';
        }
    };

    const getStatusIcon = (status: GoalStatus): string => {
        switch (status) {
            case GoalStatus.DONE:
                return 'check_circle';
            case GoalStatus.IN_PROGRESS:
                return 'progress_activity';
            case GoalStatus.NOT_STARTED:
                return 'schedule';
            case GoalStatus.ARCHIVED:
                return 'archive';
            default:
                return 'info';
        }
    };

    const getStatusLabel = (status: GoalStatus): string => {
        switch (status) {
            case GoalStatus.DONE:
                return 'Completed';
            case GoalStatus.IN_PROGRESS:
                return 'In Progress';
            case GoalStatus.NOT_STARTED:
                return 'Not Started';
            case GoalStatus.ARCHIVED:
                return 'Archived';
            default:
                return status;
        }
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return 'Not set';
        try {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return 'Invalid date';
        }
    };

    const getUserInitials = (name: string | undefined): string => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const renderChildGoal = (childGoal: Goal, level: number = 0): React.ReactNode => {
        const isExpanded = expandedGoals.has(childGoal.id || '');
        const hasChildren = childGoal.children && childGoal.children.length > 0;
        const statusColor = getStatusColor(childGoal.status);

        return (
            <ChildGoalCard
                key={childGoal.id}
                $isExpanded={isExpanded}
                onClick={() => {
                    // Navigate to the clicked child goal's detail page
                    if (childGoal.id) {
                        navigate(`/goals/${childGoal.id}`);
                    }
                }}
            >
                <ChildGoalCardInner $statusColor={statusColor}>
                    <ChildGoalHeader>
                        <ChildGoalLeft>
                            {hasChildren ? (
                                <ExpandButton onClick={(e) => { e.stopPropagation(); toggleExpand(childGoal.id || ''); }}>
                                    <Icon name={isExpanded ? 'expand_circle_down' : 'chevron_right'} />
                                </ExpandButton>
                            ) : (
                                <div style={{ width: '20px' }} />
                            )}
                            <ChildGoalContent>
                                <ChildGoalName>{childGoal.name}</ChildGoalName>
                                <ChildGoalMeta>
                                    <Icon name="calendar_month" size="small" />
                                    <span>Due {formatDate(childGoal.due_date)}</span>
                                </ChildGoalMeta>
                            </ChildGoalContent>
                        </ChildGoalLeft>
                        <ChildGoalRight>
                            <StatusBadge $variant={getStatusVariant(childGoal.status)}>
                                <Icon name={getStatusIcon(childGoal.status)} size="small" />
                                <span>{getStatusLabel(childGoal.status)}</span>
                            </StatusBadge>
                            <AssigneeAvatar title={childGoal.user?.name || 'Unassigned'}>
                                {childGoal.user ? getUserInitials(childGoal.user.name) : '?'}
                            </AssigneeAvatar>
                        </ChildGoalRight>
                    </ChildGoalHeader>
                </ChildGoalCardInner>

                {isExpanded && hasChildren && (
                    <SubGoalsContainer>
                        {childGoal.children.map((subGoal) => renderChildGoal(subGoal, level + 1))}
                    </SubGoalsContainer>
                )}
            </ChildGoalCard>
        );
    };

    const hasChildren = goal && goal.children && goal.children.length > 0;

    const renderDetailsContent = () => {
        if (isLoading) {
            return (
                <EmptyState>
                    <Icon name="progress_activity" size="large" />
                    <h3>Loading goal details...</h3>
                </EmptyState>
            );
        }

        if (error || !goal) {
            return (
                <EmptyState>
                    <Icon name="error" size="large" />
                    <h3>Goal not found</h3>
                    <p>{error || 'Unable to load goal details'}</p>
                </EmptyState>
            );
        }

        return (
            <GoalDetailsContainer>
                {/* Goal Header Card */}
                <GoalHeaderCard $statusColor={getStatusColor(goal.status)}>
                    <GoalHeaderContent>
                        <GoalHeaderTop>
                            <GoalHeaderLeft>
                                <GoalTypeBadge>
                                    {goal.type === GoalType.ORGANIZATIONAL ? 'ORGANIZATIONAL' : 'PERSONAL'}
                                </GoalTypeBadge>
                                <GoalTitle>{goal.name}</GoalTitle>
                            </GoalHeaderLeft>
                        </GoalHeaderTop>

                        {goal.description && (
                            <GoalDescription>{goal.description}</GoalDescription>
                        )}

                        <GoalMetadataGrid>
                            <MetadataItem>
                                <MetadataIconWrapper>
                                    <Icon name="person" size="small" />
                                </MetadataIconWrapper>
                                <MetadataContent>
                                    <MetadataLabel>Owner</MetadataLabel>
                                    <MetadataValue>{goal.user?.name || 'Unassigned'}</MetadataValue>
                                </MetadataContent>
                            </MetadataItem>

                            <MetadataItem>
                                <MetadataIconWrapper>
                                    <Icon name="groups" size="small" />
                                </MetadataIconWrapper>
                                <MetadataContent>
                                    <MetadataLabel>Team</MetadataLabel>
                                    <MetadataValue>{goal.team?.name || 'No team'}</MetadataValue>
                                </MetadataContent>
                            </MetadataItem>

                            <MetadataItem>
                                <MetadataIconWrapper>
                                    <Icon name="event" size="small" />
                                </MetadataIconWrapper>
                                <MetadataContent>
                                    <MetadataLabel>Due Date</MetadataLabel>
                                    <MetadataValue>{formatDate(goal.due_date)}</MetadataValue>
                                </MetadataContent>
                            </MetadataItem>

                            <MetadataItem>
                                <StatusBadge $variant={getStatusVariant(goal.status)}>
                                    <Icon name={getStatusIcon(goal.status)} size="small" />
                                    <span>{getStatusLabel(goal.status)}</span>
                                </StatusBadge>
                            </MetadataItem>
                        </GoalMetadataGrid>
                    </GoalHeaderContent>
                </GoalHeaderCard>

                {/* Child Goals Section */}
                {hasChildren && (
                    <ChildGoalsSection>
                        <VerticalLine />
                        {goal.children.map((child) => renderChildGoal(child, 0))}
                    </ChildGoalsSection>
                )}

                {!hasChildren && (
                    <EmptyState>
                        <Icon name="account_tree" size="large" />
                        <h3>No child goals yet</h3>
                        <p>Create child goals to break down this goal into smaller, manageable tasks</p>
                    </EmptyState>
                )}
            </GoalDetailsContainer>
        );
        
    };
    
    return (
        <EntityDetailsPage
            setPageTitle={setPageTitle}
            setPrimaryActionButton={setPrimaryActionButton}
            setPageSubtitle={setPageSubtitle}
            setSecondaryActionButton={setSecondaryActionButton}
            pageTitle={"Goals Management"}
            pageSubtitle={"Manage the goals"}
            secondaryActionButton={secondaryActionButton}
        >
            {renderDetailsContent()}    
        </EntityDetailsPage>
    );
};