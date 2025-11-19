// src/hooks/useAnalysis.ts
import { useCallback, useMemo } from 'react';
import { ComposerMocks } from '../modules/mocks';
import {  useAnalysisState } from './useAnalysisState';

export const useAnalysis = (analysisId?: number | null) => {
  const {
    analyses,
    draftAnalysisId,
    createAnalysis,
    deleteAnalysis: deleteAnalysisAction,
    addComposer,
    removeComposer,
    setDraftAnalysis,
    clearDraftAnalysis: clearDraftAnalysisAction,
    getAnalysis,
    nextId,
  } = useAnalysisState();

  const analysis = analysisId ? getAnalysis(analysisId) : undefined;
  
  const draftAnalysis = useMemo(() => {
    return draftAnalysisId ? analyses[draftAnalysisId] : null;
  }, [draftAnalysisId, analyses]);

  const addToDraftAnalysis = useCallback((composerId: number) => {
   

    if (!draftAnalysisId) {
      const composer = ComposerMocks.find(c => c.id === composerId);
      if (!composer) {
        console.log('Composer not found:', composerId);
        return;
      }

      
      createAnalysis([composerId]);
      
      const newAnalysisId = nextId;
      
      setDraftAnalysis(newAnalysisId);
      
    } else {
      addComposer(draftAnalysisId, composerId);
    }
  }, [draftAnalysisId, createAnalysis, setDraftAnalysis, nextId, addComposer, analyses]);

  const removeFromDraftAnalysis = useCallback((composerId: number) => {
    if (draftAnalysisId) {
      removeComposer(draftAnalysisId, composerId);
    }
  }, [draftAnalysisId, removeComposer]);

  const clearDraftAnalysis = useCallback(() => {
    clearDraftAnalysisAction();
  }, [clearDraftAnalysisAction]);

  const isComposerInDraft = useCallback((composerId: number): boolean => {
    return draftAnalysis?.composers.some(c => c.id === composerId) || false;
  }, [draftAnalysis]);

  const createNewAnalysis = useCallback((composerIds: number[]) => {
    createAnalysis(composerIds);
    return nextId; // Возвращаем ID созданного анализа
  }, [createAnalysis, nextId]);

  const deleteAnalysis = useCallback((id?: number) => {
    const analysisIdToDelete = id || analysisId;
    if (analysisIdToDelete) {
      deleteAnalysisAction(analysisIdToDelete);
    }
  }, [analysisId, deleteAnalysisAction]);

  const getAnalysisFromUrl = useCallback((id: string) => {
    const analysisId = parseInt(id);
    return getAnalysis(analysisId);
  }, [getAnalysis]);

  return {
    analyses: useMemo(() => Object.values(analyses), [analyses]),
    draftAnalysis,
    analysis,
    draftAnalysisId,
    addToDraftAnalysis,
    removeFromDraftAnalysis,
    clearDraftAnalysis,
    isComposerInDraft,
    createNewAnalysis,
    deleteAnalysis,
    getNextId: useCallback(() => nextId, [nextId]),
    getAnalysis,
    getAnalysisFromUrl
  };
};