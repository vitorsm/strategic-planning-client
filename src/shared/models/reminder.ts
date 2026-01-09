import { GenericEntity } from "./generic-entity";
import { Team } from "./team";
import { User } from "./user";


export enum ReminderStatus {
    PENDING = 'PENDING',
    DONE = 'DONE'
}

export interface Reminder extends GenericEntity {
    status: ReminderStatus;
    description: string | null;
    to_user: User;
    related_user: User | null;
    related_team: Team | null;
}