import { GenericEntity } from "./generic-entity";


export interface TaskType extends GenericEntity {
    icon: string;
    color: string;
    parent_type: TaskType | null;
    children: TaskType[];
}
