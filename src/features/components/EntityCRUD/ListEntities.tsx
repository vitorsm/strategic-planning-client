import { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableColumn } from "../../../shared";
import { ContentInner, FiltersWrap, SearchInput, SearchInputWrap, SubtitleText, TitleContent, TitleText } from "./styles";
import { ListEntitiesProps } from "./types";


export const ListEntities: React.FC<ListEntitiesProps> = ({
    items,
    columns,
    onItemClick,
    selectedItemId,
    isLoading,
    searchPlaceholder = 'Search...',
    pageSize=10
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [totalItems, setTotalItems] = useState(items.length);
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
                    <SubtitleText>{item.subtitle}</SubtitleText>
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
            <FiltersWrap>
                <SearchInputWrap>
                    <span className="material-symbols-outlined">search</span>
                    <SearchInput
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchInputWrap>
            </FiltersWrap>

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
                totalItems={totalItems}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={onPageChange}
                getRowKey={(row) => row.id}
            />
        </ContentInner>
    );
};