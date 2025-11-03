// hooks/useAttributionAnalyses.ts
export const useAttributionAnalyses = () => {
  const sendAttributionDraft = async (draftAnalysisId: string) => {
    const response = await fetch('http://localhost:8000/api/attributionAnalyses/attributionDraft/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draftAnalysisId })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  return { sendAttributionDraft };
};