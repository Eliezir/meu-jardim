import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeToDatabase } from './realtime';

export function useUpdateHumidityLimit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (limit: number) => {
      await writeToDatabase('/config/umidade_limite', limit);
    },
    onMutate: async (newLimit) => {
      await queryClient.cancelQueries({ queryKey: ['firebase', 'config', 'umidade_limite'] });
      const previous = queryClient.getQueryData(['firebase', 'config', 'umidade_limite']);
      queryClient.setQueryData(['firebase', 'config', 'umidade_limite'], newLimit);
      return { previous };
    },
    onError: (err, newLimit, context) => {
      queryClient.setQueryData(['firebase', 'config', 'umidade_limite'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['firebase', 'config', 'umidade_limite'] });
    },
  });
}

export function useUpdateIrrigationSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: { time: string; weekDays: string[] }) => {
      await writeToDatabase('/config/agendamento', schedule);
    },
    onMutate: async (newSchedule) => {
      await queryClient.cancelQueries({ queryKey: ['firebase', 'config', 'agendamento'] });
      const previous = queryClient.getQueryData(['firebase', 'config', 'agendamento']);
      queryClient.setQueryData(['firebase', 'config', 'agendamento'], newSchedule);
      return { previous };
    },
    onError: (err, newSchedule, context) => {
      queryClient.setQueryData(['firebase', 'config', 'agendamento'], context?.previous);
    },
  });
}

export function useUpdateZones() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (zones: { zona1: string; zona2: string }) => {
      await writeToDatabase('/config/zonas', zones);
    },
    onMutate: async (newZones) => {
      await queryClient.cancelQueries({ queryKey: ['firebase', 'config', 'zonas'] });
      const previous = queryClient.getQueryData(['firebase', 'config', 'zonas']);
      queryClient.setQueryData(['firebase', 'config', 'zonas'], newZones);
      return { previous };
    },
    onError: (err, newZones, context) => {
      queryClient.setQueryData(['firebase', 'config', 'zonas'], context?.previous);
    },
  });
}

