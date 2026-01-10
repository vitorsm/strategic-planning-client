import { useEffect, useMemo, useCallback } from "react";
import { ActionButtonProps } from "../types";
import { useNavigate } from "react-router-dom";
import { DetailsPageWrap } from "../styles";


interface EntityDetailsPageProps {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
    pageTitle: string;
    pageSubtitle?: string;
    children: React.ReactNode;
    secondaryActionButton?: ActionButtonProps;
}

export const EntityDetailsPage: React.FC<EntityDetailsPageProps> = ({
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
    pageTitle,
    secondaryActionButton,
    children,
    pageSubtitle = '',
}) => {
    const navigate = useNavigate();

    // Memoize the edit button to prevent recreating on every render
    const editButton = useMemo(() => ({
        label: "Edit",
        onClick: () => navigate("edit"),
        icon: "edit" as const,
    }), [navigate]);

    // Set page metadata when it changes
    useEffect(() => {
        setPageTitle(pageTitle);
    }, [pageTitle, setPageTitle]);

    useEffect(() => {
        setPageSubtitle(pageSubtitle);
    }, [pageSubtitle, setPageSubtitle]);

    // Set buttons on mount and cleanup on unmount
    useEffect(() => {
        setPrimaryActionButton(editButton);
        setSecondaryActionButton(secondaryActionButton);

        return () => {
            setPrimaryActionButton(undefined);
            setSecondaryActionButton(undefined);
        };
    }, [editButton, secondaryActionButton, setPrimaryActionButton, setSecondaryActionButton]);

    return (
        <DetailsPageWrap $hasBottomMenu={false}>
            {children}
        </DetailsPageWrap>
    );
};