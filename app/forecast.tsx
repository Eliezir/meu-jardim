import { ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useQuery } from '@tanstack/react-query';
import { getWeatherData } from '@/lib/weather';
import { Cloud, Droplet, Wind, Eye } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { useIrrigationScheduleQuery } from '@/lib/firebase/queries';
import { getNextIrrigationDate } from '@/lib/utils/irrigation';

interface WeatherCardProps {
  temp: number | { max: number; min: number };
  description: string;
  icon: string;
  humidity: number;
  chanceOfRain?: number;
  windSpeed?: number;
  windDirection?: number;
  visibility?: number;
  feelsLike?: number;
}

function WeatherCard({ 
  temp, 
  description, 
  icon, 
  humidity, 
  chanceOfRain, 
  windSpeed, 
  windDirection, 
  visibility,
  feelsLike 
}: WeatherCardProps) {
  const getWindDirection = (deg: number): string => {
    const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getWeatherEmoji = (iconStr: string) => {
    if (iconStr.includes('01d')) return '☀️';
    if (iconStr.includes('01n')) return '🌙';
    if (iconStr.includes('02')) return '⛅';
    if (iconStr.includes('03') || iconStr.includes('04')) return '☁️';
    if (iconStr.includes('09') || iconStr.includes('10')) return '🌧️';
    if (iconStr.includes('11')) return '⛈️';
    if (iconStr.includes('13')) return '❄️';
    if (iconStr.includes('50')) return '🌫️';
    return '🌤️';
  };

  const isTempRange = typeof temp === 'object';

  return (
    <View className="bg-snow rounded-2xl px-6 py-6 border border-silver">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-ink-light text-sm mb-1">Temperatura</Text>
          <Text className="text-ink text-5xl font-nunito-bold leading-[60px]">
            {isTempRange ? `${temp.max}° / ${temp.min}°` : `${temp}°`}
          </Text>
          {feelsLike && (
            <Text className="text-ink-light text-sm mt-1">
              Sensação: {feelsLike}°
            </Text>
          )}
          {!feelsLike && (
            <Text className="text-ink-light text-sm mt-1 capitalize">
              {description}
            </Text>
          )}
        </View>
        <View className="items-center">
          <View className="w-24 h-24 items-center justify-center">
            <Text className="text-6xl leading-[90px]">
              {getWeatherEmoji(icon)}
            </Text>
          </View>
          {feelsLike && (
            <Text className="text-ink text-sm font-nunito-semibold capitalize">
              {description}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row flex-wrap gap-4 mt-4">
        <View className="flex-row items-center gap-2">
          <Droplet size={18} color="#1CB0F6" />
          <Text className="text-ink-light text-sm">{humidity}%</Text>
        </View>
        {chanceOfRain !== undefined && chanceOfRain > 0 && (
          <View className="flex-row items-center gap-2">
            <Cloud size={18} color="#777777" />
            <Text className="text-ink-light text-sm">{chanceOfRain}% chuva</Text>
          </View>
        )}
        {windSpeed !== undefined && windDirection !== undefined && (
          <View className="flex-row items-center gap-2">
            <Wind size={18} color="#777777" />
            <Text className="text-ink-light text-sm">
              {windSpeed.toFixed(1)} m/s {getWindDirection(windDirection)}
            </Text>
          </View>
        )}
        {visibility !== undefined && (
          <View className="flex-row items-center gap-2">
            <Eye size={18} color="#777777" />
            <Text className="text-ink-light text-sm">{visibility.toFixed(1)} km</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function ForecastScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: schedule } = useIrrigationScheduleQuery();
  
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
  const latitude = process.env.EXPO_PUBLIC_WEATHER_LAT ? parseFloat(process.env.EXPO_PUBLIC_WEATHER_LAT) : undefined;
  const longitude = process.env.EXPO_PUBLIC_WEATHER_LON ? parseFloat(process.env.EXPO_PUBLIC_WEATHER_LON) : undefined;
  const city = process.env.EXPO_PUBLIC_WEATHER_CITY;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', latitude, longitude, city],
    queryFn: () => getWeatherData(apiKey, latitude, longitude, city),
    enabled: !!apiKey,
    staleTime: 1000 * 60 * 10,
  });

  const nextIrrigationDate = useMemo(() => {
    return getNextIrrigationDate(schedule);
  }, [schedule]);

  const irrigationForecast = useMemo(() => {
    if (!data || !nextIrrigationDate) {
      return null;
    }

    const irrigationDateStr = nextIrrigationDate.toISOString().split('T')[0];
    const irrigationForecastDay = data.forecast.find(day => day.date === irrigationDateStr);
    
    return irrigationForecastDay || null;
  }, [data, nextIrrigationDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!apiKey) {
    return (
      <>
        <ScreenHeader title="Previsão" />
        <ScrollView className="flex-1 bg-polar px-6">
          <View className="mt-6 bg-alert-red/10 rounded-2xl px-4 py-4 border border-alert-red">
            <Text className="text-ink text-base font-nunito-semibold mb-2">
              ⚠️ Configuração Necessária
            </Text>
            <Text className="text-ink-light text-sm leading-5">
              Para usar a previsão do tempo, você precisa configurar a chave da API do OpenWeather.
              Adicione <Text className="font-nunito-semibold">EXPO_PUBLIC_OPENWEATHER_API_KEY</Text> no seu arquivo .env
            </Text>
          </View>
        </ScrollView>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <ScreenHeader title="Previsão" />
        <View className="flex-1 bg-polar items-center justify-center">
          <ActivityIndicator size="large" color="#58CC02" />
          <Text className="text-ink-light text-sm mt-4">Carregando previsão do tempo...</Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ScreenHeader title="Previsão" />
        <ScrollView className="flex-1 bg-polar px-6">
          <View className="mt-6 bg-alert-red/10 rounded-2xl px-4 py-4 border border-alert-red">
            <Text className="text-ink text-base font-nunito-semibold mb-2">
              Erro ao carregar previsão
            </Text>
            <Text className="text-ink-light text-sm">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </Text>
          </View>
        </ScrollView>
      </>
    );
  }

  if (!data) {
    return null;
  }

  const { current  } = data;

  return (
    <>
      <ScreenHeader title="Previsão do Tempo" />
      <ScrollView 
        className="flex-1 bg-polar px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />
        }>

        <View className="mt-6">
          <Text className="text-ink text-lg font-nunito-semibold mb-4">
            Condições Atuais
          </Text>
          <WeatherCard
            temp={current.temp}
            description={current.description}
            icon={current.icon}
            humidity={current.humidity}
            windSpeed={current.windSpeed}
            windDirection={current.windDirection}
            visibility={current.visibility}
            feelsLike={current.feelsLike}
          />
        </View>

        {irrigationForecast && nextIrrigationDate ? (
          <View className="mt-6">
            <Text className="text-ink text-lg font-nunito-semibold mb-2">
              Previsão para Próxima Irrigação
            </Text>
            <Text className="text-ink-light text-sm mb-4">
              {nextIrrigationDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            <WeatherCard
              temp={irrigationForecast.temp}
              description={irrigationForecast.description}
              icon={irrigationForecast.icon}
              humidity={irrigationForecast.humidity}
              chanceOfRain={irrigationForecast.chanceOfRain}
            />
          </View>
        ) : (
          <View className="mt-6">
            <View className="bg-snow rounded-2xl px-4 py-4 border border-silver">
              <Text className="text-ink text-base font-nunito-semibold mb-2">
                Nenhuma irrigação agendada
              </Text>
              <Text className="text-ink-light text-sm leading-5">
                Configure um horário de irrigação na tela de agendamento para ver a previsão do tempo.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}


