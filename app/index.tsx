import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card-content';
import { ScrollView, View } from 'react-native';
import { Timer, Droplets, Map, Cloud, Play, Square, Clock } from 'lucide-react-native';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSoilHumidityQuery, useIrrigationScheduleQuery, useIrrigationStatusQuery, useZonesQuery } from '@/lib/firebase/queries';
import { getNextScheduleTimeLeft } from '@/lib/utils/irrigation';
import { useQuery } from '@tanstack/react-query';
import { getWeatherData } from '@/lib/weather';
import { useIrrigationCountdown } from '@/lib/hooks/useIrrigationCountdown';

export default function HomeScreen() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const { displayValue, isConnected } = useSoilHumidityQuery();
  const { data: schedule } = useIrrigationScheduleQuery();
  const { data: zones } = useZonesQuery();
  const { data: irrigationStatus } = useIrrigationStatusQuery();
  const { isActive: isIrrigating, longestZoneRemaining } = useIrrigationCountdown(irrigationStatus, schedule, zones);

  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
  const latitude = process.env.EXPO_PUBLIC_WEATHER_LAT ? parseFloat(process.env.EXPO_PUBLIC_WEATHER_LAT) : undefined;
  const longitude = process.env.EXPO_PUBLIC_WEATHER_LON ? parseFloat(process.env.EXPO_PUBLIC_WEATHER_LON) : undefined;
  const city = process.env.EXPO_PUBLIC_WEATHER_CITY;

  const { data: weatherData } = useQuery({
    queryKey: ['weather', latitude, longitude, city],
    queryFn: () => getWeatherData(apiKey, latitude, longitude, city),
    enabled: !!apiKey,
    staleTime: 1000 * 60 * 10,
  });

  const timeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const timeUntilNextIrrigation = useMemo(() => {
    return getNextScheduleTimeLeft(schedule);
  }, [schedule]);

  // Determine what to show in the timer widget
  const timerDisplay = useMemo(() => {
    if (isIrrigating && longestZoneRemaining) {
      return {
        value: longestZoneRemaining.formatted,
        text: 'Tempo restante',
        icon: Clock,
        color: 'garden-green',
      };
    } else {
      return {
        value: timeUntilNextIrrigation,
        text: 'Para próxima irrigação',
        icon: Timer,
        color: 'yellow-500',
      };
    }
  }, [isIrrigating, longestZoneRemaining, timeUntilNextIrrigation]);

  type CardItem = {
    id: string;
    icon: typeof Timer;
    value: string | number;
    text: string;
    secondaryValue?: string | number;
    secondaryText?: string;
    color: string;
    variant?: 'card';
    width: 'full' | 'half';
    minHeight: number;
    onPress: () => void;
  };

  const cardItems: CardItem[] = useMemo(() => [
    {
      id: 'schedule',
      icon: timerDisplay.icon,
      value: timerDisplay.value,
      text: timerDisplay.text,
      color: timerDisplay.color,
      width: 'full',
      minHeight: 80,
      onPress: () => router.push('/schedule'),
    },
    {
      id: 'umidade',
      icon: Droplets,
      value: displayValue !== null ? `${displayValue}%` : 'N/A',
      text: isConnected ? 'Umidade' : 'ESP32 desconectado',
      color: isConnected ? 'water-blue' : 'alert-red',
      width: 'half',
      minHeight: 80,
      onPress: () => router.push('/humidity'),
    },
    {
      id: 'zones',
      icon: Map,
      value: 2,
      text: 'Zonas',
      color: 'garden-green',
      width: 'half',
      minHeight: 80,
      onPress: () => router.push('/zones'),
    },
    {
      id: 'forecast',
      icon: Cloud,
      value: weatherData?.current ? `${weatherData.current.temp}°` : '--',
      secondaryValue: weatherData?.current ? weatherData.current.description : undefined,
      secondaryText: weatherData?.current ? 'Condição' : undefined,
      text: 'Previsão',
      color: 'warning-orange',
      width: 'full',
      minHeight: 140,
      onPress: () => router.push('/forecast'),
    },
    {
      id: 'start-stop',
      icon: isRunning ? Square : Play,
      value: isRunning ? 'Pausar' : 'Iniciar',
      text: isRunning ? 'Irrigação em andamento' : 'Tudo pronto para regar seu jardim',
      color: isRunning ? 'alert-red' : 'garden-green',
      width: 'full',
      minHeight: 80,
      onPress: () => setIsRunning(!isRunning),
    },
  ], [timerDisplay, displayValue, isConnected, isRunning, weatherData]);

  return (
    <ScrollView className="flex-1 bg-polar px-6 py-12">
      <View>
        <Text className="text-ink-light text-xl font-semibold">{timeBasedGreeting()},</Text>
        <Text className="text-garden-green text-3xl font-nunito-bold">Dona Verônica</Text>
      </View>

      <View className="mt-8 gap-4 flex-row flex-wrap">
        {cardItems.map((card) => (
          <Button
            key={card.id}
            variant="card"
            className={cn('bg-snow rounded-2xl px-4 py-3', 
              card.width === 'half' ? 'w-[47.5%]' : 'w-full')}
            style={{ minHeight: card.minHeight,}}
            onPress={() => setTimeout(card.onPress, 200)}
          >
            <CardContent
              icon={card.icon}
              value={card.value}
              text={card.text}
              secondaryValue={card.secondaryValue}
              secondaryText={card.secondaryText}
              iconColor={`text-${card.color}`}
            />
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}

