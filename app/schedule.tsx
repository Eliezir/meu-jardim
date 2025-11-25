import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {TimePicker} from '@/components/ui/time-picker';
import { useState } from 'react';

export default function TimeScreen() {
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [time, setTime] = useState('07:30');

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];


const handleTimeChange = (time: string) => {
  setTime(time);
};

const handleWeekDaysChange = (weekDays: string[]) => {
  setSelectedWeekDays(weekDays);
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


