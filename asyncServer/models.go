package main

// ComposerAnalysisRequest запрос на расчет совпадения
type ComposerAnalysisRequest struct {
	ComposerAnalysisID int64 `json:"composer_analysis_id"`
	ComposerID         int64 `json:"composer_id"`
	AnalysisID         int64 `json:"analysis_id"`
}

// ComposerAnalysisUpdate запрос на обновление совпадения
type ComposerAnalysisUpdate struct {
	PotentialCoincidence float64 `json:"potential_coincidence"`
}

// ComposerAnalysis представляет связь м-м
type ComposerAnalysis struct {
	ID                     int64   `json:"id"`
	ComposerID             int64   `json:"composer_id"`
	AnalysisID             int64   `json:"analysis_id"`
	AnonUnisonsSecondsFreq *string `json:"anon_unisons_seconds_freq"`
	AnonThirdsFreq         *string `json:"anon_thirds_freq"`
	AnonFourthsFifthsFreq  *string `json:"anon_fourths_fifths_freq"`
	AnonSixthsSeventhsFreq *string `json:"anon_sixths_sevenths_freq"`
	AnonOctavesFreq        *string `json:"anon_octaves_freq"`
	PotentialCoincidence   string  `json:"potential_coincidence"`
}

// Composer представляет модель композитора

type Composer struct {
	ID                 int64   `json:"id"`
	UnisonsSecondsFreq *string `json:"unisons_seconds_freq"`
	ThirdsFreq         *string `json:"thirds_freq"`
	FourthsFifthsFreq  *string `json:"fourths_fifths_freq"`
	SixthsSeventhsFreq *string `json:"sixths_sevenths_freq"`
	OctavesFreq        *string `json:"octaves_freq"`
}
