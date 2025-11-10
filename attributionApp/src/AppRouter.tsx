// src/AppRouter.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BreadCrumbs from './components/BreadCrumbs';
import ComposersHomePage from './pages/ComposersHomePage';
import ComposerPersonalPage from './pages/ComposerPersonalPage';
import AttributionDraftPage from './pages/AttributionDraftPage';
import GuestPage from './pages/GuestPage';

const AppRouter: React.FC = () => {
  const location = useLocation();
  const isGuestPage = location.pathname === '/';
  
  const showBreadcrumbs = 
    location.pathname.startsWith('/composers') || 
    location.pathname.startsWith('/analysiss');

  return (
    <>
      {!isGuestPage && <Header />}
      {!isGuestPage && showBreadcrumbs && <BreadCrumbs />}
        <Routes>
          <Route path="/composers" element={<ComposersHomePage />} />
          <Route path="/composers/:id" element={<ComposerPersonalPage />} />
          <Route path="/analysiss/:id" element={<AttributionDraftPage />} />
          <Route path="/analysiss" element={<div>Список заявок</div>} />
          <Route path="/" element={<GuestPage />} />
        </Routes>
    </>
  );
};

export default AppRouter;