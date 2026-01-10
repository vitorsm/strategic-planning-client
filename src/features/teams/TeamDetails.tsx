import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EntityDetailsPage } from "../components/EntityCRUD";
import { GenericCreateUpdateEntityPageProps } from "../components/EntityCRUD/pages/RoutePage";


export const TeamDetails: React.FC<GenericCreateUpdateEntityPageProps> = ({
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
}) => {
    const navigate = useNavigate();

    // Memoize the secondary action button to prevent infinite loops
    const secondaryActionButton = useMemo(() => ({
        label: "add member",
        onClick: () => navigate("edit"),
        icon: "add" as const,
    }), [navigate]);

    return (
        <EntityDetailsPage
            setPageTitle={setPageTitle}
            setPrimaryActionButton={setPrimaryActionButton}
            setSecondaryActionButton={setSecondaryActionButton}
            setPageSubtitle={setPageSubtitle}
            pageTitle="Team Details"
            pageSubtitle="Team Details"
            secondaryActionButton={secondaryActionButton}
        >
            <h1>Team Details</h1>
        </EntityDetailsPage>
    );
};