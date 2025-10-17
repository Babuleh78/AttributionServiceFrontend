import { useAnalysisContext } from "../context/AnalysesContext";

export const useAnalysis = (id: number | null) => {
  const { state, dispatch } = useAnalysisContext();

  const analysis = id ? state.analyses[id] : null;

  const deleteAnalysis = () => {
    if (id) {
      dispatch({ type: 'DELETE_ANALYSIS', id });
    }
  };

  const addComposer = (composerId: number) => {
    if (id) {
      dispatch({ type: 'ADD_COMPOSER', analysisId: id, composerId });
    }
  };

  const createNewAnalysis = (composerIds: number[]) => {
    dispatch({ type: 'CREATE_ANALYSIS', composerIds });
    return state.nextId; // ID нового анализа
  };

  return {
    analysis,
    deleteAnalysis,
    addComposer,
    createNewAnalysis,
    allAnalyses: state.analyses,
  };
};