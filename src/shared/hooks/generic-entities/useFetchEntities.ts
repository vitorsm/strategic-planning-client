import { useState, useCallback, useEffect } from 'react';
import { APIClient, DEFAULT_WORKSPACE_ID } from '../../api';
import { GenericEntity } from '../../models/generic-entity';


interface UseFetchEntitiesResult<T extends GenericEntity> {
  fetchEntities: (workspaceId: string) => Promise<T[] | null>;
  entities: T[];
  isLoading: boolean;
  error: string | null;
}

export function useFetchEntities<T extends GenericEntity>(endpoint: string): UseFetchEntitiesResult<T> {
  const [entities, setEntities] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = useCallback(async (workspaceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const client = new APIClient();
      const response = await client.get<T[]>(`${endpoint}?workspace_id=${workspaceId}`);
      setEntities(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch entities';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchEntities, entities, isLoading, error };
}

