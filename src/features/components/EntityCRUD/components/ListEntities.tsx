import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableColumn, SearchInput, SecondaryButton } from "../../../../shared";
import { ContentInner, FiltersWrap, SubtitleText, TitleContent, TitleText, TopRow } from "../styles";
import { EntityItem, ListEntitiesProps } from "../types";


export const ListEntities: React.FC<ListEntitiesProps> = ({
    items,
    columns,
    onItemClick,
    selectedItemId,
    isLoading,
    onRefresh,
    searchPlaceholder = 'Search...',
    pageSize=10,
    getItemSubtitle=(item: any) => ''
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [completeColumns, setCompleteColumns] = useState(columns);

    const titleColumn: TableColumn = {
        key: 'name',
        label: 'Name',
        width: '40%',
        render: (item: any) => {
            return (
                <TitleContent>
                    <TitleText>{item.name}</TitleText>
                    <SubtitleText>{getItemSubtitle(item)}</SubtitleText>
                </TitleContent>    
            );
        }
    }

    useEffect(() => {
        setCompleteColumns([titleColumn, ...columns]);
    }, [columns]);

    const filteredItems = useMemo(() => {
        if (!searchQuery?.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(
          (item) =>
            item.name?.toLowerCase().includes(query) ||
            item.subtitle?.toLowerCase().includes(query) ||
            item.children?.some((child) => child.name?.toLowerCase().includes(query))
        );
      }, [items, searchQuery]);

      const onPageChange = useCallback((page: number) => {
        setCurrentPage(page);
      }, []);

    return (
        <ContentInner>
            <TopRow>
                <FiltersWrap>
                    <SearchInput
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </FiltersWrap>

                <SecondaryButton onClick={onRefresh}>
                    <span className="material-symbols-outlined">refresh</span>
                </SecondaryButton>
            </TopRow>
            

            <Table
                columns={completeColumns}
                data={filteredItems}
                isLoading={isLoading}
                emptyIcon="inbox"
                emptyTitle="No items found"
                emptyText={
                    searchQuery
                        ? 'Try adjusting your search query'
                        : 'Create your first item to get started'
                }
                showPagination={true}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={onPageChange}
                getRowKey={(row) => row.id}
                onRowClick={(item, index) => onItemClick?.(item)}
            />
        </ContentInner>
    );
};