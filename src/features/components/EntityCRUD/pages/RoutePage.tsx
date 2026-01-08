import { Route, RouteProps, Routes, useLocation } from "react-router-dom";
import { ActionButtonProps, MainEntityPageProps } from "../types";
import { useFetchEntities } from "../../../../shared/hooks/generic-entities/useFetchEntities";
import { GenericEntity } from "../../../../shared/models/generic-entity";
import { useEffect } from "react";
import { DEFAULT_WORKSPACE_ID, TableColumn } from "../../../../shared";


export interface GenericEntityDetailsPageProps {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
}

interface RoutePageProps<T extends GenericEntity> {
    setPageTitle: (title: string) => void;
    setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
    setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
    setPageSubtitle: (subtitle: string) => void;
    apiEndpoint: string;
    rootPath: string;
    MainPageComponent: React.ComponentType<MainEntityPageProps>;
    DetailsPageComponent: React.ComponentType<GenericEntityDetailsPageProps>;
    mainPageTitle: string;
    mainPageSubtitle: string;
    createButtonLabel: string;
    searchPlaceholder: string;
    tableColumns: TableColumn[];
    getItemSubtitle: (item: T) => React.ReactNode;
    routes?: RouteProps[];
    // Tree-related props
    isTreeTable?: boolean;
    childrenKey?: string;
    defaultExpandedIds?: string[];
}

export const RoutePage = <T extends GenericEntity>({
    setPageTitle,
    setPrimaryActionButton,
    setSecondaryActionButton,
    setPageSubtitle,
    apiEndpoint,
    rootPath,
    MainPageComponent,
    DetailsPageComponent,
    mainPageTitle,
    mainPageSubtitle,
    createButtonLabel,
    searchPlaceholder,
    tableColumns,
    getItemSubtitle,
    routes,
    isTreeTable = false,
    childrenKey = 'children',
    defaultExpandedIds = [],
}: RoutePageProps<T>) => {
    const { entities, isLoading, error, fetchEntities } = useFetchEntities<T>(apiEndpoint);
    const location = useLocation();

    // Only run this effect when on the root teams page, not on child routes
    const isRootPage = location.pathname === rootPath || location.pathname === `${rootPath}/`;

    // Refresh data when navigating back with refresh state
    useEffect(() => {
        if (!isRootPage && entities.length > 0) return;

        const state = location.state as { refresh?: boolean } | null;
        if (state?.refresh || entities.length === 0) {
            // Clear the state to prevent re-fetching on subsequent renders
            window.history.replaceState({}, document.title);
            fetchEntities(DEFAULT_WORKSPACE_ID);
        }
    }, [location.state, isRootPage, fetchEntities]);

    useEffect(() => {
        if (!isRootPage) return;
        setSecondaryActionButton(undefined);
    }, [location.pathname, isRootPage]);

    const renderRoutes = () => {
        return routes?.map((route) => {
            return <Route key={route.path} path={route.path} element={route.element} />
        });
    };

    return (
        <Routes>
            <Route path="/" element={
                <MainPageComponent
                    title={mainPageTitle}
                    subtitle={mainPageSubtitle}
                    items={entities}
                    tableColumns={tableColumns}
                    setPageTitle={setPageTitle}
                    setPageSubtitle={setPageSubtitle}
                    createButtonLabel={createButtonLabel}
                    searchPlaceholder={searchPlaceholder}
                    setPrimaryActionButton={setPrimaryActionButton}
                    isLoading={isLoading}
                    getItemSubtitle={getItemSubtitle}
                    onRefresh={() => fetchEntities(DEFAULT_WORKSPACE_ID)}
                    isTreeTable={isTreeTable}
                    childrenKey={childrenKey}
                    defaultExpandedIds={defaultExpandedIds}
                    />
            } />
            <Route path="/new" element={
                <DetailsPageComponent
                    setPageSubtitle={setPageSubtitle} 
                    setPrimaryActionButton={setPrimaryActionButton} 
                    setPageTitle={setPageTitle} 
                    setSecondaryActionButton={setSecondaryActionButton}
                    />
                } />
            <Route path="/:entity_id" element={
                <DetailsPageComponent 
                    setPageSubtitle={setPageSubtitle} 
                    setPrimaryActionButton={setPrimaryActionButton} 
                    setPageTitle={setPageTitle} 
                    setSecondaryActionButton={setSecondaryActionButton} />
                }
            />
            {renderRoutes()}
        </Routes>
    );
};