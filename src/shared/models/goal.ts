import { GenericEntity } from "./generic-entity";
import { Team } from "./team";
import { User } from "./user";

export enum GoalType {
    PERSONAL = 'PERSONAL',
    ORGANIZATIONAL = 'ORGANIZATIONAL'
}

export enum GoalStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED'
}

export interface Goal extends GenericEntity {
    type: GoalType;
    status: GoalStatus;
    due_date: Date;
    description: string | null;
    user: User | null;
    team: Team | null;
    parent_goal: Goal | null;
    children: Goal[];
}
