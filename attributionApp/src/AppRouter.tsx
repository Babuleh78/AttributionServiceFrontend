// src/AppRouter.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BreadCrumbs from './components/BreadCrumbs';
import ComposersHomePage from './pages/ComposersHomePage';
import ComposerPersonalPage from './pages/ComposerPersonalPage';
import AttributionDraftPage from './pages/AttributionDraftPage';
import GuestPage from './pages/GuestPage';
import { Container } from 'react-bootstrap';
import { ConnectionInfo } from './components/ConnectionInfo';

const AppRouter: React.FC = () => {
 // const [isConnected] = React.useState<boolean | null>(null);

 
  const location = useLocation();
  const isGuestPage = location.pathname === '/';
  
  const showBreadcrumbs = 
    location.pathname.startsWith('/composers') || 
    location.pathname.startsWith('/analysiss');

  return (
    <>
      {!isGuestPage && <Header />}
      {!isGuestPage && showBreadcrumbs && <BreadCrumbs />}
      <Container className="pt-4">
        {/* Показываем информацию о подключении */}
      <ConnectionInfo />
      
      {/* {isConnected !== null && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: isConnected ? '#4CAF50' : '#f44336',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          {isConnected ? '✅ Подключено к API' : '❌ Нет подключения к API'}
        </div>
      )} */}
        <Routes>
          <Route path="/composers" element={<ComposersHomePage />} />
          <Route path="/composers/:id" element={<ComposerPersonalPage />} />
          <Route path="/analysiss/:id" element={<AttributionDraftPage />} />
          <Route path="/analysiss" element={<div>Список заявок</div>} />
          <Route path="/" element={<GuestPage />} />
        </Routes>
      </Container>
    </>
  );
};

export default AppRouter;