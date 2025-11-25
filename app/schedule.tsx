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
  return (
    <>
      <ScreenHeader title="Próxima Irrigação" />
      <ScrollView className="flex-1 bg-polar px-6">
      <Text className="text-ink-light text-base my-2">
      Configure e visualize os horários de irrigação do seu jardim.
          </Text>
        <TimePicker mode="hour-minute" value={time} onChange={setTime} label="Horário de irrigação"/>
        <View>
        <ToggleGroup value={selectedWeekDays} onValueChange={setSelectedWeekDays} variant='depth' type='multiple'
        className='gap-1 mt-4 flex flex-wrap'
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


