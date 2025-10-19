import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ComposersHomePage from './pages/ComposersHomePage';
import ComposerPersonalPage from './pages/ComposerPersonalPage';
import AttributionDraftPage from './pages/AttributionDraftPage';
import { Container } from 'reactstrap';

const AppRouter: React.FC = () => {
  return (
    <>
      <Header />
      <Container className="pt-4">
        <Routes>
          <Route path="/composers" element={<ComposersHomePage />} />
          <Route path="/composers/:id" element={<ComposerPersonalPage />} />
          <Route path="/analysiss/:id" element={<AttributionDraftPage />} /> 
          <Route path="/" element={<ComposersHomePage />} />
      </Routes>
      </Container>
    </>
  );
};

export default AppRouter;