// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysesContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AnalysisProvider>
  );
}

export default App;