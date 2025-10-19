import { useAnalysisContext } from "../context/AnalysesContext";
import { ComposerMocks } from "../modules/mocks";
import type { Analysis } from "../modules/types";
export const useAnalysis = (analysisId?: number | null) => {
  const { state, dispatch } = useAnalysisContext();

  const analysis = analysisId ? state.analyses[analysisId] : undefined;
  
  const draftAnalysis = state.draftAnalysisId ? state.analyses[state.draftAnalysisId] : null;

  const addToDraftAnalysis = (composerId: number) => {
    if (!state.draftAnalysisId) {
      const composer = ComposerMocks.find(c => c.id === composerId);
      if (!composer) return;

      const newAnalysis: Analysis = {
        id: state.nextId,
        composers: [composer],
        createdAt: new Date(),
      };

      dispatch({ 
        type: 'CREATE_ANALYSIS', 
        composerIds: [composerId] 
      });
      dispatch({ 
        type: 'SET_DRAFT_ANALYSIS', 
        id: state.nextId 
      });
    } else {
      dispatch({ 
        type: 'ADD_COMPOSER', 
        analysisId: state.draftAnalysisId, 
        composerId 
      });
    }
  };

  const removeFromDraftAnalysis = (composerId: number) => {
    if (state.draftAnalysisId) {
      dispatch({ 
        type: 'REMOVE_COMPOSER', 
        analysisId: state.draftAnalysisId, 
        composerId 
      });
    }
  };

  const clearDraftAnalysis = () => {
    dispatch({ type: 'CLEAR_DRAFT_ANALYSIS' });
  };

  const isComposerInDraft = (composerId: number): boolean => {
    return draftAnalysis?.composers.some(c => c.id === composerId) || false;
  };

  const createNewAnalysis = (composerIds: number[]) => {
    dispatch({ type: 'CREATE_ANALYSIS', composerIds });
    return state.nextId - 1;
  };

  const deleteAnalysis = (id?: number) => {
    const analysisIdToDelete = id || analysisId;
    if (analysisIdToDelete) {
      dispatch({ type: 'DELETE_ANALYSIS', id: analysisIdToDelete });
    }
  };

  return {
    analyses: Object.values(state.analyses),
    draftAnalysis,
    analysis,
    draftAnalysisId: state.draftAnalysisId,
    addToDraftAnalysis,
    removeFromDraftAnalysis,
    clearDraftAnalysis,
    isComposerInDraft,
    createNewAnalysis,
    deleteAnalysis,
    getNextId: () => state.nextId,
  };
};