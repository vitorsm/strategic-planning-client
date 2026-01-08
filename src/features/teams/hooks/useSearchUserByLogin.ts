import { useFetchEntity } from '../../../shared/hooks/generic-entities/useFetchEntity';
import { User } from '../../../shared/models/user';

export function useSearchUserByLogin() {
  const { fetchEntity, entity, isLoading, error } = useFetchEntity<User>("api/users/login");
  return { user: entity, isLoading, error, searchUser: fetchEntity };
}

