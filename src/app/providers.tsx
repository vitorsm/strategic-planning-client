import React from 'react';

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Global providers wrapper for the application.
 * Add context providers (theme, auth, query client, etc.) here.
 */
export const Providers = ({ children }: ProvidersProps) => {
  return <>{children}</>;
};

