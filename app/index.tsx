import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card-content';
import { ScrollView, View } from 'react-native';
import { Timer, Droplets, Map, Cloud, Play, Square } from 'lucide-react-native';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);

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

  // Mock data - replace with real data from Firebase later
  const irrigationData = useMemo(() => {
    // Example: irrigation scheduled for 2 hours from now
    const now = new Date();
    const nextIrrigation = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const timeLeft = Math.floor((nextIrrigation.getTime() - now.getTime()) / (60 * 1000)); // minutes
    
    const hours = Math.floor(timeLeft / 60);
    const minutes = timeLeft % 60;
    
    return {
      duration: '15 min', // Defined irrigation time
      timeLeft: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`,
    };
  }, []);

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
      icon: Timer,
      value: irrigationData.duration,
      text: 'Para aproxima irrigação',
      color: 'purple-500',
      width: 'full',
      minHeight: 80,
      onPress: () => router.push('/schedule'),
    },
    {
      id: 'umidade',
      icon: Droplets,
      value: '75%',
      text: 'Umidade',
      color: 'water-blue',
      width: 'half',
      minHeight: 80,
      onPress: () => router.push('/humidity'),
    },
    {
      id: 'zones',
      icon: Map,
      value: 3,
      text: 'Zonas',
      color: 'garden-green',
      width: 'half',
      minHeight: 80,
      onPress: () => router.push('/zones'),
    },
    {
      id: 'forecast',
      icon: Cloud,
      value: 'Ensolarado',
      text: 'Previsão',
      color: 'warning-orange',
      width: 'full',
      minHeight: 80,
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
  ], [irrigationData, isRunning]);

  // TODO: Change the celebration message to a forecast message
  return (
    <ScrollView className="flex-1 bg-polar px-6 py-12">
      <View>
        <Text className="text-ink-light text-xl font-semibold">{timeBasedGreeting()},</Text>
        <Text className="text-garden-green text-3xl font-nunito-bold">Dona Verônica</Text>
        {/* {celebrationMessage && (
          <Text className="text-ink-light text-base mt-4">{celebrationMessage}</Text>
        )} */}
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
              iconColor={`text-${card.color}`}
            />
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}

