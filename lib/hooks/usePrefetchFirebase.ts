import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSoilHumidity, readFromDatabase } from '@/lib/firebase/realtime';

export function usePrefetchFirebase() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['firebase', 'sensores', 'umidade_solo'],
      queryFn: () => getSoilHumidity(),
      staleTime: 0,
    });

    queryClient.prefetchQuery({
      queryKey: ['firebase', 'config', 'umidade_limite'],
      queryFn: async () => {
        const limit = await readFromDatabase<number>('/config/umidade_limite');
        return limit ?? 40;
      },
      staleTime: 1000 * 60 * 5,
    });

    queryClient.prefetchQuery({
      queryKey: ['firebase', 'config', 'agendamento'],
      queryFn: async () => {
        const schedule = await readFromDatabase<{ time: string; weekDays: Record<string, boolean> | string[] }>('/config/agendamento');
        if (!schedule) {
          return { time: '07:30', weekDays: [] };
        }
        
        let weekDaysArray: string[] = [];
        if (Array.isArray(schedule.weekDays)) {
          weekDaysArray = schedule.weekDays;
        } else if (typeof schedule.weekDays === 'object' && schedule.weekDays !== null) {
          const weekDaysObj = schedule.weekDays as Record<string, boolean>;
          weekDaysArray = Object.keys(weekDaysObj).filter((day) => weekDaysObj[day] === true);
        }
        
        return { time: schedule.time, weekDays: weekDaysArray };
      },
      staleTime: 1000 * 60 * 5,
    });

    queryClient.prefetchQuery({
      queryKey: ['firebase', 'config', 'zonas'],
      queryFn: async () => {
        const zones = await readFromDatabase<{ zona1: string; zona2: string }>('/config/zonas');
        return zones ?? { zona1: '15:00', zona2: '20:00' };
      },
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);
}

