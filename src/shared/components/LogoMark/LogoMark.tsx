import React from 'react';
import { IconWrap } from './styles';

export type LogoMarkProps = {
  className?: string;
  size?: number;
  title?: string;
};

export const LogoMark = ({ className, size = 32, title = 'EM Strategy' }: LogoMarkProps) => {
  return (
    <IconWrap className={className} style={{ width: size, height: size }} aria-label={title}>
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" role="img" aria-hidden="true">
        <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
      </svg>
    </IconWrap>
  );
};

