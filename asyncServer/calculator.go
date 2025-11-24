package main

import (
	"log"
	"math"
	"math/rand"
	"strconv"
	"time"
)

type CoincidenceCalculator struct {
	random *rand.Rand
}

func NewCoincidenceCalculator() *CoincidenceCalculator {
	return &CoincidenceCalculator{
		random: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// CalculatePotentialCoincidence рассчитывает вероятность совпадения
func (c *CoincidenceCalculator) CalculatePotentialCoincidence(composer *Composer, analysis *ComposerAnalysis) float64 {
	// Имитация задержки 5-10 секунд
	delay := 5 + c.random.Float64()*5
	log.Printf("⏳ [CALC] Simulating delay of %.2f seconds...", delay)
	time.Sleep(time.Duration(delay * float64(time.Second)))
	log.Printf("✅ [CALC] Delay completed")

	// Расчет на основе анонимных статистик
	var totalWeight float64
	var totalScore float64

	log.Printf("📊 [CALC] Starting calculation with data:")

	// Функция для конвертации string в float64
	parseFloat := func(s *string) *float64 {
		if s == nil {
			return nil
		}
		if f, err := strconv.ParseFloat(*s, 64); err == nil {
			return &f
		}
		return nil
	}

	// Унисоны и секунды
	if freq := parseFloat(analysis.AnonUnisonsSecondsFreq); freq != nil {
		weight := 0.25
		score := math.Min(*freq/100.0, 1.0)
		totalScore += score * weight
		totalWeight += weight
		log.Printf("🎯 [CALC] Unisons: weight=%.2f, score=%.2f, totalScore=%.2f", weight, score, totalScore)
	}

	// Терции
	if freq := parseFloat(analysis.AnonThirdsFreq); freq != nil {
		weight := 0.20
		score := math.Min(*freq/100.0, 1.0)
		totalScore += score * weight
		totalWeight += weight
		log.Printf("🎯 [CALC] Thirds: weight=%.2f, score=%.2f, totalScore=%.2f", weight, score, totalScore)
	}

	// Кварты и квинты
	if freq := parseFloat(analysis.AnonFourthsFifthsFreq); freq != nil {
		weight := 0.20
		score := math.Min(*freq/100.0, 1.0)
		totalScore += score * weight
		totalWeight += weight
		log.Printf("🎯 [CALC] Fourths/Fifths: weight=%.2f, score=%.2f, totalScore=%.2f", weight, score, totalScore)
	}

	// Сексты и септимы
	if freq := parseFloat(analysis.AnonSixthsSeventhsFreq); freq != nil {
		weight := 0.20
		score := math.Min(*freq/100.0, 1.0)
		totalScore += score * weight
		totalWeight += weight
		log.Printf("🎯 [CALC] Sixths/Sevenths: weight=%.2f, score=%.2f, totalScore=%.2f", weight, score, totalScore)
	}

	// Октавы
	if freq := parseFloat(analysis.AnonOctavesFreq); freq != nil {
		weight := 0.15
		score := math.Min(*freq/100.0, 1.0)
		totalScore += score * weight
		totalWeight += weight
		log.Printf("🎯 [CALC] Octaves: weight=%.2f, score=%.2f, totalScore=%.2f", weight, score, totalScore)
	}

	log.Printf("📐 [CALC] Total weight: %.2f, Total score: %.2f", totalWeight, totalScore)

	var result float64
	if totalWeight > 0 {
		result = (totalScore / totalWeight) * 100
		log.Printf("📐 [CALC] Normalized result: %.2f%%", result)
	} else {
		// Если данных нет, используем случайное значение
		result = 30 + c.random.Float64()*40
		log.Printf("🎲 [CALC] No data, using random result: %.2f%%", result)
	}

	// Ограничение и округление
	result = math.Max(0, math.Min(100, result))
	finalResult := math.Round(result*100) / 100
	log.Printf("✅ [CALC] Final calculated coincidence: %.2f%%", finalResult)

	return finalResult
}
