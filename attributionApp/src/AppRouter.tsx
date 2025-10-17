// src/AppRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ComposerHomePage from './pages/ComposersHomePage';
import ComposerPersonalPage from './pages/ComposerPersonalPage';
import AttributionDraftPage from './pages/AttributionDraftPage';
import { Container } from 'reactstrap';

const AppRouter: React.FC = () => {
  return (
    <>
      <Header />
      <Container className="pt-4">
        <Routes>
          <Route path="/composers" element={<ComposerHomePage />} />
          <Route path="/composers/:id" element={<ComposerPersonalPage />} />
          <Route path="/analysiss/:id" element={<AttributionDraftPage />} />
          <Route path="/" element={<Navigate to="/composers" replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default AppRouter;