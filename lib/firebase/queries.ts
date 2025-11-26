import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getSoilHumidity, listenToSoilHumidity, readFromDatabase } from './realtime';

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
    const unsubscribe = listenToSoilHumidity((humidity) => {
      queryClient.setQueryData(queryKey, humidity);
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient, queryKey]);
  
  return query;
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
  const { data: humidity } = useSoilHumidityQuery();
  return humidity ?? null;
}

