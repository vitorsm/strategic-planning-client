import React from 'react';
import {
  StyledInfoCard,
  InfoCardContent,
  InfoIcon,
  InfoCardText,
  InfoCardTitle,
  InfoCardDescription,
} from './styles';

export interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  className,
  children,
}) => {
  return (
    <StyledInfoCard className={className}>
      <InfoCardContent>
        <InfoIcon>{icon}</InfoIcon>
        <InfoCardText>
          <InfoCardTitle>{title}</InfoCardTitle>
          <InfoCardDescription>{description}</InfoCardDescription>
        </InfoCardText>
      </InfoCardContent>
      {children}
    </StyledInfoCard>
  );
};

