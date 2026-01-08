import { useFetchEntities } from "../../../shared/hooks/generic-entities/useFetchEntities";
import { TaskType } from "../../../shared/models/task-type";


export function useFetchTaskTypes() {
    const { fetchEntities, entities, isLoading, error } = useFetchEntities<TaskType>("api/task-types");
    return { taskTypes: entities, isLoading, error, fetchTaskTypes: fetchEntities };
}
