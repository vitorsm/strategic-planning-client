import { useState, useCallback, useEffect } from 'react';
import { APIClient, APIClientError, DEFAULT_WORKSPACE_ID } from '../../api';
import { GenericEntity } from '../../models/generic-entity';
import { User } from '../../models/user';


export const ENTITY_NOT_FOUND_ERROR = 'Entity not found';


interface UseFetchEntityResult<T extends GenericEntity | User> {
  fetchEntity: (entityId: string) => Promise<T | null>;
  entity: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetchEntity<T extends GenericEntity | User>(endpoint: string): UseFetchEntityResult<T> {
  const [entity, setEntity] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntity = useCallback(async (entityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const client = new APIClient();
      const response = await client.get<T>(`${endpoint}/${entityId}`);
      setEntity(response);
      return response;
    } catch (err) {
      if (err instanceof APIClientError) {
        if (err.status === 404) {
          setError(ENTITY_NOT_FOUND_ERROR);
          return null;
        }
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch entities';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchEntity, entity, isLoading, error };
}

