import React from 'react';
import { Providers } from './app/providers';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthenticatedPage, UnauthenticatedPage } from './features/components';


export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path={"/login/*"} element={<UnauthenticatedPage />} />
          <Route path="*" element={<AuthenticatedPage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
