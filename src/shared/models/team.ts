import { User } from "../auth/authStorage";
import { GenericEntity } from "./generic-entity";


export interface Team extends GenericEntity {
    description: string | null;
    members: Partial<User>[];
}
