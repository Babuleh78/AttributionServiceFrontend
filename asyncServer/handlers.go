package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

type AnalysisHandler struct {
	djangoClient *DjangoClient
	calculator   *CoincidenceCalculator
	mu           sync.Mutex
	processing   map[int64]bool
}

func NewAnalysisHandler(djangoClient *DjangoClient, calculator *CoincidenceCalculator) *AnalysisHandler {
	return &AnalysisHandler{
		djangoClient: djangoClient,
		calculator:   calculator,
		processing:   make(map[int64]bool),
	}
}

// CalculateCoincidenceHandler обработчик для расчета совпадения
func (h *AnalysisHandler) CalculateCoincidenceHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("🚀 [HTTP] Received request: %s %s", r.Method, r.URL.Path)
	log.Printf("📦 [HTTP] Headers: %+v", r.Header)

	if r.Method != http.MethodPost {
		log.Printf("❌ [HTTP] Method not allowed: %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ComposerAnalysisRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("❌ [HTTP] Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("📋 [HTTP] Request data: %+v", req)

	// Проверяем, не обрабатывается ли уже этот анализ
	h.mu.Lock()
	if h.processing[req.ComposerAnalysisID] {
		h.mu.Unlock()
		log.Printf("⚠️ [HTTP] Analysis %d is already being processed", req.ComposerAnalysisID)
		http.Error(w, "Analysis already being processed", http.StatusConflict)
		return
	}
	h.processing[req.ComposerAnalysisID] = true
	h.mu.Unlock()

	// Асинхронная обработка
	go h.processComposerAnalysis(req)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	response := map[string]string{
		"status":  "accepted",
		"message": "Coincidence calculation started",
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("❌ [HTTP] Failed to send response: %v", err)
	} else {
		log.Printf("✅ [HTTP] Request accepted for processing: %+v", req)
	}
}

// processComposerAnalysis асинхронно обрабатывает расчет совпадения
func (h *AnalysisHandler) processComposerAnalysis(req ComposerAnalysisRequest) {
	log.Printf("🔍 [PROCESS] Starting processing for ComposerAnalysis ID: %d", req.ComposerAnalysisID)
	log.Printf("🔍 [PROCESS] Full request: %+v", req)

	defer func() {
		h.mu.Lock()
		delete(h.processing, req.ComposerAnalysisID)
		h.mu.Unlock()
		log.Printf("🧹 [PROCESS] Cleaned up processing state for ID: %d", req.ComposerAnalysisID)
	}()

	// Получаем данные связи м-м (передаем все ID)
	log.Printf("📥 [PROCESS] Fetching composer analysis data for ID: %d", req.ComposerAnalysisID)
	composerAnalysis, err := h.djangoClient.GetComposerAnalysis(req.ComposerAnalysisID, req.AnalysisID, req.ComposerID)
	if err != nil {
		log.Printf("❌ [PROCESS] Failed to get composer analysis %d: %v", req.ComposerAnalysisID, err)
		return
	}

	log.Printf("📊 [PROCESS] ComposerAnalysis data: %+v", composerAnalysis)

	// Получаем данные композитора
	log.Printf("📥 [PROCESS] Fetching composer data for ID: %d", req.ComposerID)
	composer, err := h.djangoClient.GetComposer(req.ComposerID)
	if err != nil {
		log.Printf("❌ [PROCESS] Failed to get composer %d: %v", req.ComposerID, err)
		return
	}

	log.Printf("🎵 [PROCESS] Composer data: %+v", composer)

	// Рассчитываем совпадение
	log.Printf("🧮 [PROCESS] Starting coincidence calculation...")
	coincidence := h.calculator.CalculatePotentialCoincidence(composer, composerAnalysis)
	log.Printf("📈 [PROCESS] Calculated coincidence: %.2f%%", coincidence)

	// Обновляем значение в Django (передаем все ID)
	log.Printf("💾 [PROCESS] Updating database with coincidence value...")
	if err := h.djangoClient.UpdateComposerAnalysis(req.ComposerAnalysisID, req.AnalysisID, req.ComposerID, coincidence); err != nil {
		log.Printf("❌ [PROCESS] Failed to update potential coincidence for %d: %v", req.ComposerAnalysisID, err)
		return
	}

	log.Printf("🎉 [PROCESS] Successfully completed processing for ComposerAnalysis ID: %d, final value: %.2f%%",
		req.ComposerAnalysisID, coincidence)
}
