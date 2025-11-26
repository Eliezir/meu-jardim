import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {TimePicker} from '@/components/ui/time-picker';
import { useState, useEffect } from 'react';
import { useIrrigationScheduleQuery } from '@/lib/firebase/queries';
import { useUpdateIrrigationSchedule } from '@/lib/firebase/mutations';

export default function TimeScreen() {
  const { data: schedule } = useIrrigationScheduleQuery();
  const updateScheduleMutation = useUpdateIrrigationSchedule();
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [time, setTime] = useState('');

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (schedule) {
      setTime(schedule.time);
      setSelectedWeekDays(schedule.weekDays);
    }
  }, [schedule]);

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    updateScheduleMutation.mutate({ time: newTime, weekDays: selectedWeekDays });
  };

  const handleWeekDaysChange = (weekDays: string[]) => {
    setSelectedWeekDays(weekDays);
    updateScheduleMutation.mutate({ time, weekDays });
  };

  return (
    <>
      <ScreenHeader title="Próxima Irrigação" />
      <ScrollView className="flex-1 bg-polar px-6">
        <View className="mt-6">
          <Text className="text-ink text-lg font-nunito-semibold mb-2">
            Horário de Irrigação
          </Text>
          <Text className="text-ink-light text-sm mb-4">
            Selecione o horário em que a irrigação será executada automaticamente.
          </Text>
          <TimePicker 
            mode="hour-minute" 
            value={time} 
            onChange={handleTimeChange} 
          />
        </View>

        <View className="mt-6">
          <Text className="text-ink text-lg font-nunito-semibold mb-2">
            Dias da Semana
          </Text>
          <Text className="text-ink-light text-sm mb-4">
            Selecione os dias em que a irrigação deve ocorrer. Você pode escolher múltiplos dias.
          </Text>
          <ToggleGroup 
            value={selectedWeekDays} 
            onValueChange={handleWeekDaysChange} 
            variant='depth' 
            type='multiple'
            className='gap-1 flex flex-wrap'
          >
            {weekDays.map((day) => (
              <ToggleGroupItem key={day} value={day} className='rounded-lg'>
                <Text className="text-ink text-base font-nunito-semibold">{day}</Text>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </View>
      </ScrollView>
    </>
  );
}


