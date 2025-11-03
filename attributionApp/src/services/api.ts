// api.ts
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? ''
  : 'http://localhost:8000';

import { ComposerMocks } from "../modules/mocks";
import type { Composer } from "../modules/types";

class ApiService {
  private async fetchWithFallback<T>(endpoint: string, mockData: T, options?: RequestInit): Promise<T> {
    try {
      const normalizedEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
      
      const url = import.meta.env.MODE === 'development' 
        ? normalizedEndpoint 
        : `${API_BASE_URL}${normalizedEndpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options, // Добавляем переданные опции
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Используем мок-данные для:', endpoint);
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData;
    }
  }

  async getComposers(): Promise<Composer[]> {
    return this.fetchWithFallback('/composers', ComposerMocks);
  }

  async getComposerById(id: number): Promise<Composer | null> {
    const composer = ComposerMocks.find(comp => comp.id === id);
    return this.fetchWithFallback(`/composers/${id}`, composer || null);
  }

  async searchComposers(query: string): Promise<Composer[]> {
    const filteredComposers = ComposerMocks.filter(comp =>
      comp.name?.toLowerCase().includes(query.toLowerCase()) ||
      comp.period?.toLowerCase().includes(query.toLowerCase())
    );
    return this.fetchWithFallback(`/composers/search?q=${encodeURIComponent(query)}`, filteredComposers);
  }

  async sendAttributionDraft(): Promise<any> {
    return this.fetchWithFallback(
      '/attributionAnalyses/attributionDraft/', 
     
      {
        method: 'GET' 
      }
    );
  }
}

export const apiService = new ApiService();