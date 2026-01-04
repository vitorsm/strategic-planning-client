import React, { useEffect } from 'react';
import { ContentWrap } from './styles';
import { EntityCRUDProps } from './types';
import { ListEntities } from './ListEntities';

export const EntityCRUD: React.FC<EntityCRUDProps> = ({
  title,
  subtitle,
  items,
  setPageTitle,
  setPageSubtitle,
  tableColumns,
  onCreateClick,
  setPrimaryActionButton,
  setSecondaryActionButton,
  secondaryActionButton,
  isLoading = false,
  searchPlaceholder = 'Search...',
  createButtonLabel = 'New Item',
  pageSize = 10,
}) => {

  useEffect(() => {
    if (onCreateClick && createButtonLabel) {
      setPrimaryActionButton({
        label: createButtonLabel,
        onClick: onCreateClick,
        icon: 'add',
      });
    }

    if (secondaryActionButton && setSecondaryActionButton) {
      setSecondaryActionButton(secondaryActionButton);
    }
  }, []);

  useEffect(() => {
    setPageTitle(title);

    if (subtitle) {
      setPageSubtitle(subtitle);
    }
  }, [title, subtitle]);

  return (
    <ContentWrap>
      <ListEntities 
        items={items} 
        columns={tableColumns}
        isLoading={isLoading} 
        searchPlaceholder={searchPlaceholder} 
        pageSize={pageSize} />
    </ContentWrap>
  );
};
