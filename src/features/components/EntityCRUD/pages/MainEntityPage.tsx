import React, { useEffect, useState } from 'react';
import { ContentWrap } from '../styles';
import { MainEntityPageProps } from '../types';
import { ListEntities } from '../components/ListEntities';
import { useLocation, useNavigate } from 'react-router-dom';

export const MainEntityPage: React.FC<MainEntityPageProps> = ({
  title,
  subtitle,
  items,
  setPageTitle,
  setPageSubtitle,
  tableColumns,
  setPrimaryActionButton,
  setSecondaryActionButton,
  secondaryActionButton,
  getItemSubtitle,
  onRefresh,
  isLoading = false,
  searchPlaceholder = 'Search...',
  createButtonLabel = 'New Item',
  pageSize = 10,
  isTreeTable = false,
  childrenKey = 'children',
  defaultExpandedIds = [],
}) => {

  const navigate = useNavigate();
  const path = useLocation().pathname;

  const onCreateClickInternal = () => {
    navigate(`${path}/new`);
  };

  const onItemClick = (item: any) => {
    navigate(`${path}/${item.id}`);
  };

  useEffect(() => {
    if (createButtonLabel) {
      setPrimaryActionButton({
        label: createButtonLabel,
        onClick: onCreateClickInternal,
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
        onItemClick={onItemClick}
        items={items}
        columns={tableColumns}
        isLoading={isLoading}
        searchPlaceholder={searchPlaceholder} 
        pageSize={pageSize}
        getItemSubtitle={getItemSubtitle}
        onRefresh={onRefresh}
        isTreeTable={isTreeTable}
        childrenKey={childrenKey}
        defaultExpandedIds={defaultExpandedIds}
      />
    </ContentWrap>
  );
};
