// src/App.tsx
import { AnalysisProvider } from './context/AnalysesContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <AnalysisProvider>
        <AppRouter />
    </AnalysisProvider>
  );
}

export default App;