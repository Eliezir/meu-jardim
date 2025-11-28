import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { getSoilHumidity, listenToSoilHumidity, readFromDatabase, HumidityData } from './realtime';

function isESP32Connected(humidityData: HumidityData | null): boolean {
  if (!humidityData || !humidityData.updatedAt || humidityData.updatedAt.trim() === '') {
    return false;
  }
  
  const updatedAt = new Date(humidityData.updatedAt);
  
  if (isNaN(updatedAt.getTime())) {
    return false;
  }
  
  const now = new Date();
  const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
  
  return diffMinutes <= 10;
}

export function useSoilHumidityQuery() {
  const queryClient = useQueryClient();
  const queryKey = ['firebase', 'sensores', 'umidade_solo'];
  
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      return getSoilHumidity();
    },
    staleTime: 0,
  });
  
  useEffect(() => {
    const unsubscribe = listenToSoilHumidity((data) => {
      queryClient.setQueryData(queryKey, data);
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient, queryKey]);
  
  const isConnected = useMemo(() => {
    return isESP32Connected(query.data ?? null);
  }, [query.data]);
  
  const displayValue = useMemo(() => {
    if (!isConnected || !query.data) {
      return null;
    }
    return query.data.value;
  }, [isConnected, query.data]);
  
  return {
    ...query,
    data: query.data,
    isConnected,
    displayValue,
  };
}

export function useHumidityLimitQuery() {
  return useQuery({
    queryKey: ['firebase', 'config', 'umidade_limite'],
    queryFn: async () => {
      const limit = await readFromDatabase<number>('/config/umidade_limite');
      return limit ?? 40;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useIrrigationScheduleQuery() {
  return useQuery({
    queryKey: ['firebase', 'config', 'agendamento'],
    queryFn: async () => {
      const schedule = await readFromDatabase<{ time: string; weekDays: string[] }>('/config/agendamento');
      return schedule ?? { time: '07:30', weekDays: [] };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useZonesQuery() {
  return useQuery({
    queryKey: ['firebase', 'config', 'zonas'],
    queryFn: async () => {
      const zones = await readFromDatabase<{ zona1: string; zona2: string }>('/config/zonas');
      return zones ?? { zona1: '15:00', zona2: '20:00' };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSoilHumidity(): number | null {
  const { displayValue } = useSoilHumidityQuery();
  return displayValue;
}

