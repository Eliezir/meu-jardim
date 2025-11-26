import '@/global.css';

import AnimationScreen from '@/components/AnimationScreen';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Home, Cloud, Droplets, Timer, Map } from 'lucide-react-native';
import { TabBar } from '@/components/ui/tab-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { View, ActivityIndicator } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';
import { usePrefetchFirebase } from '@/lib/hooks/usePrefetchFirebase';
import '@/lib/firebase/config';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const tabs = [
  {
    name: 'index',
    title: 'Início',
    icon: Home,
  },
  {
    name: 'schedule',
    title: 'Agenda',
    icon: Timer,
  },
  {
    name: 'humidity',
    title: 'Umidade',
    icon: Droplets,
  },
  {
    name: 'zones',
    title: 'Zonas',
    icon: Map,
  },
  {
    name: 'forecast',
    title: 'Previsão',
    icon: Cloud,
  },
];

function AppContent({ 
  showAnimation, 
  setShowAnimation,
  fontsLoaded 
}: { 
  showAnimation: boolean; 
  setShowAnimation: Dispatch<SetStateAction<boolean>>;
  fontsLoaded: boolean;
}) {
  const { isConnected } = useNetworkStatus();
  usePrefetchFirebase();

  if (showAnimation) {
    return <AnimationScreen setShowAnimation={setShowAnimation} />;
  }

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-polar">
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME['light']}>
        <SafeAreaView edges={['top', 'bottom']} className="flex-1">
          <StatusBar style="dark" />
          {isConnected ? (
            <>
              <Tabs
                tabBar={(props) => <TabBar {...props} />}
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: '#58CC02',
                  tabBarInactiveTintColor: '#777777',
                }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tabs.Screen
                      key={tab.name}
                      name={tab.name}
                      options={{
                        title: tab.title,
                        tabBarIcon: ({ color, size }) => <Icon size={size} color={color} />,
                      }}
                    />
                  );
                })}
              </Tabs>
              <PortalHost />
            </>
          ) : (
            <OfflineIndicator />
          )}
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [ showAnimation, setShowAnimation] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent 
        showAnimation={showAnimation} 
        setShowAnimation={setShowAnimation}
        fontsLoaded={fontsLoaded}
      />
    </QueryClientProvider>
  );
}
