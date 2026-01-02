import React from 'react';
import { Providers } from './app/providers';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthenticatedPage, UnauthenticatedPage } from './features/components';

const navItems = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    href: '/dashbord',
    active: true,
  }, {
    icon: 'person',
    label: 'Users',
    href: '/users',
    active: false,
  }
];

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<UnauthenticatedPage />} />
          <Route path="*" element={<AuthenticatedPage userName="John Doe" userRole="Admin" navItems={navItems} />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
