// hooks/useComposers.ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Composer } from '../modules/types';

const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const keysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => keysToCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = keysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

const transformComposerData = (data: any): Composer => {
  const camelData = keysToCamelCase(data);
  
  
  // Если данные уже в формате моков (имеют поля частот), возвращаем как есть
  if (camelData.unisonsSecondsFreq !== undefined || 
      camelData.thirdsFreq !== undefined || 
      camelData.fourthsFifthsFreq !== undefined) {
    return {
      ...camelData,
      portraitUrl: camelData.portraitUrl || camelData.image || null,
      status: camelData.status || 1,
      deleted: camelData.deleted || false,
    };
  }
  
  // Если данные пришли с бэкенда в формате intervalStats
  if (camelData.intervalStats && Array.isArray(camelData.intervalStats)) {

    const stats = camelData.intervalStats;
    
    // Ищем в camelCase формате (после преобразования keysToCamelCase)
    const unisonsSeconds = stats.find((s: any) => 
      s.intervalGroup === "Унисоны и секунды" || s.IntervalGroup === "Унисоны и секунды"
    );
    const thirds = stats.find((s: any) => 
      s.intervalGroup === "Терции" || s.IntervalGroup === "Терции"
    );
    const fourthsFifths = stats.find((s: any) => 
      s.intervalGroup === "Кварты и квинты" || s.IntervalGroup === "Кварты и квинты"
    );
    const sixthsSevenths = stats.find((s: any) => 
      s.intervalGroup === "Сексты и септимы" || s.IntervalGroup === "Сексты и септимы"
    );
    const octaves = stats.find((s: any) => 
      s.intervalGroup === "Октавы" || s.IntervalGroup === "Октавы"
    );
    
   
    
    return {
      ...camelData,
      portraitUrl: camelData.portraitUrl || camelData.image || null,
      analyzedWorks: camelData.analyzedWorks || null,
      totalIntervals: camelData.totalIntervals || null,
      period: camelData.period || null,
      polyphonyType: camelData.polyphonyType || null,
      
      // Используем оба возможных варианта названий полей
      unisonsSecondsFreq: unisonsSeconds?.frequency || unisonsSeconds?.Frequency || null,
      unisonsSecondsStddev: unisonsSeconds?.stdDev || unisonsSeconds?.StdDev || null,
      
      thirdsFreq: thirds?.frequency || thirds?.Frequency || null,
      thirdsStddev: thirds?.stdDev || thirds?.StdDev || null,
      
      fourthsFifthsFreq: fourthsFifths?.frequency || fourthsFifths?.Frequency || null,
      fourthsFifthsStddev: fourthsFifths?.stdDev || fourthsFifths?.StdDev || null,
      
      sixthsSeventhsFreq: sixthsSevenths?.frequency || sixthsSevenths?.Frequency || null,
      sixthsSeventhsStddev: sixthsSevenths?.stdDev || sixthsSevenths?.StdDev || null,
      
      octavesFreq: octaves?.frequency || octaves?.Frequency || null,
      octavesStddev: octaves?.stdDev || octaves?.StdDev || null,
      
      status: camelData.status || 1,
      deleted: camelData.deleted || false,
    };
  }
  return {
    ...camelData,
    portraitUrl: camelData.portraitUrl || camelData.image || null,
    status: camelData.status || 1,
    deleted: camelData.deleted || false,
    unisonsSecondsFreq: null,
    unisonsSecondsStddev: null,
    thirdsFreq: null,
    thirdsStddev: null,
    fourthsFifthsFreq: null,
    fourthsFifthsStddev: null,
    sixthsSeventhsFreq: null,
    sixthsSeventhsStddev: null,
    octavesFreq: null,
    octavesStddev: null,
  };
};

export const useComposers = () => {
  const [composers, setComposers] = useState<Composer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComposers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getComposers();
      const transformedData = data.map(transformComposerData);
      setComposers(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch composers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComposers();
  }, []);

  return { composers, loading, error, refetch: fetchComposers };
};

export const useComposer = (id: number) => {
  const [composer, setComposer] = useState<Composer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComposer = async (composerId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getComposerById(composerId);
      const transformedData = data ? transformComposerData(data) : null;
      setComposer(transformedData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch composer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComposer(id);
    }
  }, [id]);

  return { composer, loading, error, refetch: () => fetchComposer(id) };
};