// src/hooks/useAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import type { Analysis, Composer } from '../modules/types';
import { ComposerMocks } from '../modules/mocks';

interface AnalysisState {
  analyses: Record<number, Analysis>;
  nextId: number;
  draftAnalysisId: number | null;
}

type AnalysisAction =
  | { type: 'CREATE_ANALYSIS'; composerIds: number[] }
  | { type: 'DELETE_ANALYSIS'; id: number }
  | { type: 'ADD_COMPOSER'; analysisId: number; composerId: number }
  | { type: 'REMOVE_COMPOSER'; analysisId: number; composerId: number }
  | { type: 'SET_DRAFT_ANALYSIS'; id: number }
  | { type: 'CLEAR_DRAFT_ANALYSIS' };


let globalState: AnalysisState | null = null;
let listeners: Array<(state: AnalysisState) => void> = [];

const setGlobalState = (newState: AnalysisState) => {
  globalState = newState;
  listeners.forEach(listener => listener(newState));
};

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

const getInitialState = (): AnalysisState => {
  const saved = localStorage.getItem('analyses');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
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

  const allComposerIds = ComposerMocks.map(c => c.id);
  const demoComposerIds = [];
  
  for (let i = 0; i < 3 && i < allComposerIds.length; i++) {
    const randomIndex = Math.floor(Math.random() * allComposerIds.length);
    demoComposerIds.push(allComposerIds[randomIndex]);
    allComposerIds.splice(randomIndex, 1);
  }

  const demoComposers = demoComposerIds
    .map(id => ComposerMocks.find(c => c.id === id))
    .filter(Boolean) as Composer[];

  const demoAnalysis: Analysis = {
    id: 1,
    composers: demoComposers,
    createdAt: new Date(),
  };

  return {
    analyses: {
      1: demoAnalysis,
    },
    draftAnalysisId: 1, // Устанавливаем демо-заявку как активную
    nextId: 2,
  };
};

export const useAnalysisState = () => {
  const [state, setState] = useState<AnalysisState>(() => 
    globalState || getInitialState()
  );

  useEffect(() => {
    // Сохраняем состояние в глобальную переменную при первом рендере
    if (!globalState) {
      globalState = state;
    }
  }, []);

  useEffect(() => {
    const listener = (newState: AnalysisState) => {
      setState(newState);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const dispatch = useCallback((action: AnalysisAction) => {
    const newState = analysisReducer(globalState || state, action);
    setGlobalState(newState);
    setState(newState);
  }, [state]);

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem('analyses', JSON.stringify(state));
  }, [state]);

  // Базовые действия
  const createAnalysis = useCallback((composerIds: number[]) => {
    dispatch({ type: 'CREATE_ANALYSIS', composerIds });
  }, [dispatch]);

  const deleteAnalysis = useCallback((id: number) => {
    dispatch({ type: 'DELETE_ANALYSIS', id });
  }, [dispatch]);

  const addComposer = useCallback((analysisId: number, composerId: number) => {
    dispatch({ type: 'ADD_COMPOSER', analysisId, composerId });
  }, [dispatch]);

  const removeComposer = useCallback((analysisId: number, composerId: number) => {
    dispatch({ type: 'REMOVE_COMPOSER', analysisId, composerId });
  }, [dispatch]);

  const setDraftAnalysis = useCallback((id: number) => {
    dispatch({ type: 'SET_DRAFT_ANALYSIS', id });
  }, [dispatch]);

  const clearDraftAnalysis = useCallback(() => {
    dispatch({ type: 'CLEAR_DRAFT_ANALYSIS' });
  }, [dispatch]);

  const getAnalysis = useCallback((id: number) => state.analyses[id], [state.analyses]);

  return {
    analyses: state.analyses,
    draftAnalysisId: state.draftAnalysisId,
    nextId: state.nextId,
    createAnalysis,
    deleteAnalysis,
    addComposer,
    removeComposer,
    setDraftAnalysis,
    clearDraftAnalysis,
    getAnalysis,
  };
};

// Тип возвращаемого значения хука для удобства использования
export type UseAnalysisReturn = ReturnType<typeof useAnalysisState>;