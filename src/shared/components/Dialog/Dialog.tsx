import React from 'react';

import {
  Overlay,
  DialogContainer,
  IconWrapper,
  Title,
  Description,
  ButtonGroup,
  OkButton,
  CancelButton,
} from './styles';

export type DialogProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onOkAction: () => void;
  onCancelAction?: () => void;
  okLabel?: string;
  cancelLabel?: string;
};

export const Dialog = ({
  title,
  description,
  icon,
  onOkAction,
  onCancelAction,
  okLabel = 'OK',
  cancelLabel = 'Cancel',
}: DialogProps) => {
  return (
    <Overlay>
      <DialogContainer role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <Title id="dialog-title">{title}</Title>
        <Description id="dialog-description">{description}</Description>
        <ButtonGroup>
          {onCancelAction && (
            <CancelButton onClick={onCancelAction}>{cancelLabel}</CancelButton>
          )}
          <OkButton onClick={onOkAction}>{okLabel}</OkButton>
        </ButtonGroup>
      </DialogContainer>
    </Overlay>
  );
};

