import { useState, useCallback } from 'react';
import { APIClient } from '../../api';
import { GenericEntity } from '../../models/generic-entity';

export interface UseWriteEntityResult<T extends GenericEntity> {
  writeEntity: (entity: T) => Promise<T | null | boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useWriteEntity<T extends GenericEntity>(endpoint: string, type: 'create' | 'update' | 'delete'): UseWriteEntityResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writeEntity = useCallback(async (entity: T): Promise<T | null | boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const client = new APIClient();
      const path = type === 'create' ? endpoint : `${endpoint}/${entity.id}`;
      let response = null;
      if (type === 'update') {
        response = await client.put<T>(path, entity);
      } else if (type === 'create') { 
        response = await client.post<T>(endpoint, entity);
      } else if (type === 'delete') {
        await client.delete<T>(path);
        response = true;
      }

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create entity';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { writeEntity, isLoading, error };
}
