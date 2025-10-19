// src/context/AnalysisContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Analysis, Composer } from '../modules/types';
import { ComposerMocks } from '../modules/mocks';

// Состояние
interface AnalysisState {
  analyses: Record<number, Analysis>;
  nextId: number;
  draftAnalysisId: number | null; // ID текущего черновика
}

// Действия
type AnalysisAction =
  | { type: 'CREATE_ANALYSIS'; composerIds: number[] }
  | { type: 'DELETE_ANALYSIS'; id: number }
  | { type: 'ADD_COMPOSER'; analysisId: number; composerId: number }
  | { type: 'REMOVE_COMPOSER'; analysisId: number; composerId: number }
  | { type: 'SET_DRAFT_ANALYSIS'; id: number } // Устанавливаем ID черновика
  | { type: 'CLEAR_DRAFT_ANALYSIS' }; // Очищаем черновик

// Редьюсер
const analysisReducer = (state: AnalysisState, action: AnalysisAction): AnalysisState => {
  switch (action.type) {
    case 'CREATE_ANALYSIS': {
      const composers = action.composerIds
        .map(id => ComposerMocks.find(c => c.id === id))
        .filter(Boolean) as Composer[];

      const newAnalysis: Analysis = {
        id: state.nextId,
        composers,
        createdAt: new Date(),
      };

      return {
        ...state,
        analyses: { ...state.analyses, [state.nextId]: newAnalysis },
        nextId: state.nextId + 1,
      };
    }

    case 'DELETE_ANALYSIS': {
      const newState = { ...state };
      delete newState.analyses[action.id];
      
      // Если удаляем черновик, сбрасываем draftAnalysisId
      if (state.draftAnalysisId === action.id) {
        newState.draftAnalysisId = null;
      }
      
      return newState;
    }

    case 'ADD_COMPOSER': {
      const analysis = state.analyses[action.analysisId];
      if (!analysis) return state;

      const composer = ComposerMocks.find(c => c.id === action.composerId);
      if (!composer) return state;

      // Проверяем, нет ли уже такого композитора
      if (analysis.composers.some(c => c.id === composer.id)) return state;

      const updatedAnalysis = {
        ...analysis,
        composers: [...analysis.composers, composer],
      };

      return {
        ...state,
        analyses: { ...state.analyses, [action.analysisId]: updatedAnalysis },
      };
    }

    case 'REMOVE_COMPOSER': {
      const analysis = state.analyses[action.analysisId];
      if (!analysis) return state;

      const updatedAnalysis = {
        ...analysis,
        composers: analysis.composers.filter(c => c.id !== action.composerId),
      };

      return {
        ...state,
        analyses: { ...state.analyses, [action.analysisId]: updatedAnalysis },
      };
    }

    case 'SET_DRAFT_ANALYSIS': {
      return {
        ...state,
        draftAnalysisId: action.id,
      };
    }

    case 'CLEAR_DRAFT_ANALYSIS': {
      if (state.draftAnalysisId) {
        const newState = { ...state };
        delete newState.analyses[state.draftAnalysisId];
        newState.draftAnalysisId = null;
        return newState;
      }
      return state;
    }

    default:
      return state;
  }
};

// Инициализация
const getInitialState = (): AnalysisState => {
  const saved = localStorage.getItem('analyses');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Восстанавливаем даты
      const analyses: Record<number, Analysis> = {};
      for (const [id, analysis] of Object.entries(parsed.analyses)) {
        analyses[Number(id)] = {
          ...(analysis as Analysis),
          createdAt: new Date((analysis as Analysis).createdAt),
        };
      }
      
      return { 
        analyses,
        draftAnalysisId: parsed.draftAnalysisId || null,
        nextId: parsed.nextId || 2 
      };
    } catch (e) {
      console.error('Failed to parse saved analyses', e);
    }
  }

  // Создаём первый анализ по умолчанию с 3 композиторами
  const defaultComposerIds = [1, 2, 3];
  const defaultComposers = defaultComposerIds
    .map(id => ComposerMocks.find(c => c.id === id))
    .filter(Boolean) as Composer[];

  return {
    analyses: {
      1: {
        id: 1,
        composers: defaultComposers,
        createdAt: new Date(),
      },
    },
    draftAnalysisId: null, // Изначально черновика нет
    nextId: 2,
  };
};

// Контекст
const AnalysisContext = createContext<{
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
} | null>(null);

// Провайдер
export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, getInitialState());

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem('analyses', JSON.stringify(state));
  }, [state]);

  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
};

// Хук для использования
export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within AnalysisProvider');
  }
  return context;
};