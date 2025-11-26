import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getWeatherData } from '@/lib/weather';

/**
 * Hook to prefetch weather data during app initialization
 * Call this in the layout to start fetching weather data early
 */
export function usePrefetchWeather() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
    const latitude = process.env.EXPO_PUBLIC_WEATHER_LAT ? parseFloat(process.env.EXPO_PUBLIC_WEATHER_LAT) : undefined;
    const longitude = process.env.EXPO_PUBLIC_WEATHER_LON ? parseFloat(process.env.EXPO_PUBLIC_WEATHER_LON) : undefined;
    const city = process.env.EXPO_PUBLIC_WEATHER_CITY;

    if (apiKey) {
      // Prefetch weather data during animation
      queryClient.prefetchQuery({
        queryKey: ['weather', latitude, longitude, city],
        queryFn: () => getWeatherData(apiKey, latitude, longitude, city),
        staleTime: 1000 * 60 * 10, // 10 minutes
      });
    }
  }, [queryClient]);
}

