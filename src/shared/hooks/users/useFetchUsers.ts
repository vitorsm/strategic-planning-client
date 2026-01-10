import { useCallback, useState } from "react";
import { User } from "../../models/user";
import { APIClient } from "../../api";


interface UseFetchUsersProps {
    workspaceId: string;
}

export function useFetchUsers({ workspaceId }: UseFetchUsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (workspaceId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = new APIClient();
            const response = await client.get<User[]>(`/api/workspaces/${workspaceId}/users`);
            setUsers(response);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch entities';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { fetchUsers, users, isLoading, error };
}