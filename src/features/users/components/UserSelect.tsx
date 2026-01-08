import { useCallback, useEffect, useState } from "react";
import { Icon, PrimaryButton, SearchInput } from "../../../shared";
import { SearchWrapper, UserNotFoundCard, UserNotFoundContent, UserNotFoundDescription, UserNotFoundText, UserNotFoundTitle } from "../styles";
import { VisualUser } from "../types";
import { useSearchUserByLogin } from "../../teams/hooks";
import { UserList } from "./UserList";
import { getVisualUser } from "../../../shared/utils/user_utils";
import { ENTITY_NOT_FOUND_ERROR } from "../../../shared/hooks/generic-entities/useFetchEntity";


interface UserSelectProps {
    users: VisualUser[];
    onSelectUser: (user: VisualUser) => void;
    onRemoveUser: (user: VisualUser) => void;
}

export const UserSelect: React.FC<UserSelectProps> = ({ users, onSelectUser, onRemoveUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserNotFoundCard, setShowUserNotFoundCard] = useState(false);
    const { searchUser, isLoading: isSearching, error: userSearchError } = useSearchUserByLogin();


    useEffect(() => {
        setShowUserNotFoundCard(userSearchError === ENTITY_NOT_FOUND_ERROR);
    }, [userSearchError]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowUserNotFoundCard(false);
    }, []);

    const handleSearchOkPress = useCallback(async () => {
        if (!searchQuery.trim() || isSearching) return;

        const user = await searchUser(searchQuery);

        if (user) {
            // Check if user is already in the members list
            const isAlreadyMember = users.some((member) => member.id === user.id);
            if (isAlreadyMember) {
                return;
            }
            
            onSelectUser(getVisualUser(user));
            setSearchQuery('');
        }
    }, [searchQuery, isSearching, searchUser, users]);

    return (
        <>
            <SearchWrapper>
                <SearchInput
                    placeholder="Find users by name or email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onOkPress={handleSearchOkPress}
                />
            </SearchWrapper>

            {showUserNotFoundCard && (
                <UserNotFoundCard>
                    <UserNotFoundContent>
                        <Icon name="person_off" style={{ color: "#f59e0b", fontSize: "24px" }} />
                        <UserNotFoundText>
                            <UserNotFoundTitle>User not found</UserNotFoundTitle>
                            <UserNotFoundDescription>
                                No user with login "{searchQuery}" exists.
                            </UserNotFoundDescription>
                        </UserNotFoundText>
                    </UserNotFoundContent>
                    <PrimaryButton
                        icon="person_add"
                        style={{ backgroundColor: "#f59e0b" }}
                        onClick={() => console.log('Create user:', searchQuery)}
                    >
                        Create User
                    </PrimaryButton>
                </UserNotFoundCard>
            )}

            <UserList
                users={users}
                onRemoveUser={onRemoveUser}
            />
        </>
    );
};