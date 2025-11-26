
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex?: number;
}

export interface ForecastDay {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
  chanceOfRain: number;
}

export interface WeatherResponse {
  current: WeatherData;
  forecast: ForecastDay[];
  location: {
    name: string;
    country: string;
  };
}

export async function getWeatherData(
  apiKey: string,
  lat?: number,
  lon?: number,
  city?: string
): Promise<WeatherResponse> {
  if (!apiKey) {
    throw new Error('OpenWeather API key is required');
  }

  // Build location query
  let locationQuery = '';
  if (lat !== undefined && lon !== undefined) {
    locationQuery = `lat=${lat}&lon=${lon}`;
  } else if (city) {
    locationQuery = `q=${encodeURIComponent(city)}`;
  } else {
    // Default to a common location (you can change this)
    locationQuery = 'lat=-23.5505&lon=-46.6333'; // São Paulo, Brazil
  }

  // Fetch current weather
  const currentWeatherUrl = `${OPENWEATHER_API_URL}/weather?${locationQuery}&appid=${apiKey}&units=metric&lang=pt_br`;
  const currentResponse = await fetch(currentWeatherUrl);
  
  if (!currentResponse.ok) {
    throw new Error(`Failed to fetch current weather: ${currentResponse.statusText}`);
  }
  
  const currentData = await currentResponse.json();

  // Fetch 5-day forecast
  const forecastUrl = `${OPENWEATHER_API_URL}/forecast?${locationQuery}&appid=${apiKey}&units=metric&lang=pt_br`;
  const forecastResponse = await fetch(forecastUrl);
  
  if (!forecastResponse.ok) {
    throw new Error(`Failed to fetch forecast: ${forecastResponse.statusText}`);
  }
  
  const forecastData = await forecastResponse.json();

  // Process current weather
  const current: WeatherData = {
    temp: Math.round(currentData.main.temp),
    feelsLike: Math.round(currentData.main.feels_like),
    humidity: currentData.main.humidity,
    pressure: currentData.main.pressure,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
    windSpeed: currentData.wind?.speed || 0,
    windDirection: currentData.wind?.deg || 0,
    visibility: (currentData.visibility || 0) / 1000, // Convert to km
  };

  // Process forecast (group by day, take first forecast of each day)
  const forecastMap = new Map<string, any>();
  
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!forecastMap.has(dateKey)) {
      forecastMap.set(dateKey, {
        date: dateKey,
        temp: { min: item.main.temp_min, max: item.main.temp_max },
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        chanceOfRain: item.pop ? Math.round(item.pop * 100) : 0,
      });
    } else {
      const existing = forecastMap.get(dateKey);
      existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
      existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
    }
  });

  const forecast: ForecastDay[] = Array.from(forecastMap.values())
    .slice(0, 5)
    .map((item) => ({
      ...item,
      temp: {
        min: Math.round(item.temp.min),
        max: Math.round(item.temp.max),
      },
    }));

  return {
    current,
    forecast,
    location: {
      name: currentData.name,
      country: currentData.sys.country,
    },
  };
}

