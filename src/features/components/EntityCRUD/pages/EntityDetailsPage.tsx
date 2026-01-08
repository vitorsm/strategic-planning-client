import React, { useState, useCallback, useEffect } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useWriteEntity, UseWriteEntityResult } from '../../../../shared/hooks/generic-entities/useWriteEntity';
import { GenericEntity } from '../../../../shared/models/generic-entity';
import { useFetchEntity } from '../../../../shared/hooks/generic-entities/useFetchEntity';
import { ButtonGroup, DetailsPageContainer, DetailsPageGrid, DetailsPageWrap, MobileFixedActionWrapper } from '../styles';
import { ActionButtonProps } from '../types';
import { Dialog, Icon, PrimaryButton, SecondaryButton, useIsMobile } from '../../../../shared';

export interface EntityDetailsPageProps<T extends GenericEntity> {
  children: React.ReactNode;
  setPageTitle: (title: string) => void;
  setPrimaryActionButton: (button: ActionButtonProps | undefined) => void;
  setSecondaryActionButton: (button: ActionButtonProps | undefined) => void;
  setPageSubtitle: (subtitle: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  entityEndpoint: string;
  loadEntityDataStates: (entity: T | null) => void;
  getEntityFromStates: () => T;
  createButtonLabel: string;
  updateButtonLabel?: string;
  isEntityValidToSubmit: (entity: T) => boolean;
  setIsEditModeCallback?: (isEditMode: boolean) => void;
  setGoBackCallback?: (goBack: () => void) => void;
  setHandleSubmitCallback?: (handleSubmit: () => void) => void;
  setIsSubmittingCallback?: (isSubmitting: boolean) => void;
  showActionButtons?: boolean;
  setEntityIdCallback?: (entityId: string | undefined) => void;
  entityDisplayName?: string;
}

export const EntityDetailsPage = <T extends GenericEntity>({
  children,
  setPageTitle,
  setPrimaryActionButton,
  setSecondaryActionButton,
  setPageSubtitle,
  pageTitle,
  entityEndpoint,
  loadEntityDataStates,
  getEntityFromStates,
  isEntityValidToSubmit,
  createButtonLabel,
  setIsEditModeCallback,
  setGoBackCallback,
  setHandleSubmitCallback,
  setIsSubmittingCallback,
  setEntityIdCallback,
  updateButtonLabel = 'Save',
  showActionButtons = true,
  pageSubtitle = '',
  entityDisplayName = 'entity'
}: EntityDetailsPageProps<T>) => {

  const { entity_id: entityId } = useParams<{ entity_id: string }>();

  const { writeEntity: createEntity, isLoading: isCreating } = useWriteEntity<T>(entityEndpoint, 'create');
  const { writeEntity: updateEntity, isLoading: isUpdating } = useWriteEntity<T>(entityEndpoint, 'update');
  const { fetchEntity, isLoading: isFetchingEntity } = useFetchEntity<T>(entityEndpoint);
  const { writeEntity: deleteEntity, isLoading: isDeleting } = useWriteEntity<T>(entityEndpoint, 'delete');

  const [isSubmitting, setIsSubmitting] = useState(isCreating || isUpdating);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isValidToSubmit, setIsValidToSubmit] = useState(false);

  const [isEditMode, setIsEditMode] = useState(!!entityId);


  const isMobile = useIsMobile();

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    setEntityIdCallback?.(entityId);
  }, [entityId, setEntityIdCallback]);

  useEffect(() => {
    setIsEditMode(!!entityId);
    setIsEditModeCallback?.(!!entityId);
  }, [entityId, setIsEditModeCallback]);

  useEffect(() => {
    setIsSubmitting(isCreating || isUpdating);
    setIsSubmittingCallback?.(isCreating || isUpdating);
  }, [isCreating, isUpdating]);

  useEffect(() => {
    const entity = getEntityFromStates();
    setIsValidToSubmit(isEntityValidToSubmit(entity));
  }, [getEntityFromStates, isEntityValidToSubmit]);

  useEffect(() => {
    if (!entityId) return;

    console.log("fetching entity", entityId)
    fetchEntity(entityId).then((entity) => {
      console.log("entity", entity)
      loadEntityDataStates(entity);
    });
  }, [entityId, fetchEntity]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    setGoBackCallback?.(goBack);
  }, [goBack, setGoBackCallback]);

  useEffect(() => {
    setPageTitle(pageTitle);
    setPageSubtitle(pageSubtitle);

    setPrimaryActionButton(undefined);
    setSecondaryActionButton(undefined);
  }, [isMobile, location.pathname, goBack]);

  const getBackAddress = useCallback(() => {
    return location.pathname.split('/').slice(0, -1).join('/');
  }, [location.pathname]);

  const handleSubmit = useCallback(async () => {
    const entity = getEntityFromStates();

    let result;
    if (isEditMode && entityId) {
      result = await updateEntity(entity);
    } else {
      result = await createEntity(entity);
    }

    if (result) {
      navigate(getBackAddress(), { state: { refresh: true } });
    }
  }, [getEntityFromStates, navigate, isEditMode, entityId, getBackAddress]);

  useEffect(() => {
    setHandleSubmitCallback?.(handleSubmit);
  }, [handleSubmit, setHandleSubmitCallback]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!entityId) return;
    const entity = getEntityFromStates();

    const success = await deleteEntity(entity);
    
    if (success) {
      navigate(getBackAddress(), { state: { refresh: true } });
    }
    setShowDeleteDialog(false);
  }, [getBackAddress, navigate, getEntityFromStates]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const getCancelButtonText = () => {
    return isEditMode ? 'Return' : 'Cancel';
  };

  const getSubmitButtonText = (): string => {
    return isEditMode ? updateButtonLabel : createButtonLabel;
  };

  const renderActionButtons = () => {
    return (
      <ButtonGroup>
        <SecondaryButton onClick={goBack}>
          {getCancelButtonText()}
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={!isValidToSubmit || isSubmitting}
        >
          <span>{isSubmitting ? 'Loading...' : getSubmitButtonText()}</span>
          <Icon name="arrow_forward" />
        </PrimaryButton>
      </ButtonGroup>
    );
  };

  return (
    <DetailsPageWrap $isMobile={isMobile as boolean}>
      <DetailsPageContainer $isMobile={isMobile as boolean}>
        <DetailsPageGrid>
          {children}
        </DetailsPageGrid>

        {isEditMode && (
          <div>
            <SecondaryButton
              icon={<div className="material-symbols-outlined">delete</div>}
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete ${entityDisplayName}`}
            </SecondaryButton>
          </div>
        )}

        {showActionButtons && (
          <MobileFixedActionWrapper>
            {renderActionButtons()}
          </MobileFixedActionWrapper>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <Dialog
            title={`Delete ${entityDisplayName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
            description={`Are you sure you want to delete this entity? This action cannot be undone.`}
            icon={<div className="material-symbols-outlined">warning</div>}
            onOkAction={handleDeleteConfirm}
            onCancelAction={handleDeleteCancel}
            okLabel="Delete"
            cancelLabel="Cancel"
          />
        )}

      </DetailsPageContainer>
    </DetailsPageWrap>
  );
};

