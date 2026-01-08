import { Workspace } from "./workspace";


export interface GenericEntity {
    id?: string;
    name: string;
    workspace: Partial<Workspace>;
}
