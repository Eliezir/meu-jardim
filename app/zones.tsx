import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TimePicker } from '@/components/ui/time-picker';
import { useState, useEffect, useRef } from 'react';
import { useZonesQuery } from '@/lib/firebase/queries';
import { useUpdateZones } from '@/lib/firebase/mutations';

export default function ZonesScreen() {
  const { data: zones } = useZonesQuery();
  const updateZonesMutation = useUpdateZones();
  const [zone1Time, setZone1Time] = useState('00:00');
  const [zone2Time, setZone2Time] = useState('00:00');
  const isInitialMount = useRef(true);
  const lastZonesRef = useRef<string>('');
  const isMutatingRef = useRef(false);

  useEffect(() => {
    if (isMutatingRef.current) {
      isMutatingRef.current = false;
      return;
    }
    
    if (zones && zones.zona1 && zones.zona2) {
      const zonesKey = `${zones.zona1}-${zones.zona2}`;
      if (isInitialMount.current || zonesKey !== lastZonesRef.current) {
        if (zones.zona1 !== '00:00' || zones.zona2 !== '00:00' || isInitialMount.current) {
          setZone1Time(zones.zona1);
          setZone2Time(zones.zona2);
          lastZonesRef.current = zonesKey;
          isInitialMount.current = false;
        }
      }
    }
  }, [zones]);

  const handleZone1Change = (time: string) => {
    if (!time || time === '00:00') return;
    setZone1Time(time);
    const currentZone2 = zone2Time !== '00:00' ? zone2Time : (zones?.zona2 || '00:00');
    if (currentZone2 !== '00:00') {
      isMutatingRef.current = true;
      updateZonesMutation.mutate({ 
        zona1: time, 
        zona2: currentZone2 
      });
    }
  };

  const handleZone2Change = (time: string) => {
    if (!time || time === '00:00') return;
    setZone2Time(time);
    const currentZone1 = zone1Time !== '00:00' ? zone1Time : (zones?.zona1 || '00:00');
    if (currentZone1 !== '00:00') {
      isMutatingRef.current = true;
      updateZonesMutation.mutate({ 
        zona1: currentZone1, 
        zona2: time 
      });
    }
  };

  return (
    <>
      <ScreenHeader title="Zonas de Irrigação" />
      <ScrollView className="flex-1 bg-polar px-6">
        <View className="mt-6">
          <Text className="text-ink-light text-sm mb-4">
            Configure a duração da irrigação para cada zona do seu jardim. Cada zona pode ter um tempo de irrigação diferente dependendo do tamanho e tipo de vegetação.
          </Text>
        </View>

        <View className="mt-6">
          <View className="bg-water-blue-light rounded-2xl px-6 py-6 border-2 border-water-blue">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-4 h-4 rounded-full bg-water-blue" />
              <Text className="text-ink text-lg font-nunito-semibold">
                Zona 1
              </Text>
            </View>
            <Text className="text-ink-light text-sm mb-4">
              Defina por quanto tempo a irrigação ficará ativa nesta zona. O tempo é medido em minutos e segundos.
            </Text>
            <TimePicker
              mode="minute-second"
              value={zone1Time}
              onChange={handleZone1Change}
              color="blue"
            />
            <View className="mt-4 p-3 bg-white/50 rounded-lg">
              <Text className="text-ink text-sm">
                <Text className="font-nunito-semibold">Duração configurada:</Text> {zone1Time.split(':')[0]} minutos e {zone1Time.split(':')[1]} segundos
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6 mb-6">
          <View className="bg-garden-green-light rounded-2xl px-6 py-6 border-2 border-garden-green">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-4 h-4 rounded-full bg-garden-green" />
              <Text className="text-ink text-lg font-nunito-semibold">
                Zona 2
              </Text>
            </View>
            <Text className="text-ink-light text-sm mb-4">
              Defina por quanto tempo a irrigação ficará ativa nesta zona. O tempo é medido em minutos e segundos.
            </Text>
            <TimePicker
              mode="minute-second"
              value={zone2Time}
              onChange={handleZone2Change}
              color="green"
            />
            <View className="mt-4 p-3 bg-white/50 rounded-lg">
              <Text className="text-ink text-sm">
                <Text className="font-nunito-semibold">Duração configurada:</Text> {zone2Time.split(':')[0]} minutos e {zone2Time.split(':')[1]} segundos
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <View className="bg-snow rounded-2xl px-4 py-4 border border-silver">
            <Text className="text-ink text-base font-nunito-semibold mb-2">
              💡 Como funciona
            </Text>
            <Text className="text-ink-light text-sm leading-5 mb-3">
              Cada zona representa uma área específica do seu jardim com suas próprias necessidades de irrigação. Quando a irrigação for ativada (por horário agendado quando), cada zona será irrigada pelo tempo configurado.
            </Text>
            <Text className="text-ink-light text-sm leading-5">
              <Text className="font-nunito-semibold">Dica:</Text> Zonas maiores ou com plantas que precisam de mais água devem ter tempos de irrigação maiores. Ajuste os tempos conforme as necessidades específicas de cada área.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}


