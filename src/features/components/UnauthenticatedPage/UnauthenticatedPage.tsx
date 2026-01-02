import React from 'react';
import { Footer } from './Footer';
import { Body, PageWrap } from './styles';
import { Navbar } from './Navbar';
import { Navigate, Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { LoginPage } from '../../auth';


export const UnauthenticatedPage = () => {
  return (
    <PageWrap>
      <Navbar />
      <Body>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Body>
      <Footer />
    </PageWrap>
  );
};

