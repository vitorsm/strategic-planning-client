import React from 'react';
import { Footer } from './Footer';
import { Body, PageWrap } from './styles';
import { Navbar } from './Navbar';

export type UnauthenticatedPageProps = {
  children: React.ReactNode;
};

export const UnauthenticatedPage = ({ children }: UnauthenticatedPageProps) => {
  return (
    <PageWrap>
      <Navbar />
      <Body>{children}</Body>
      <Footer />
    </PageWrap>
  );
};


