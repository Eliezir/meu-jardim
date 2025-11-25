import '@/global.css';

import AnimationScreen from '@/components/AnimationScreen';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const [ showAnimation, setShowAnimation] = useState(true);
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <SafeAreaView edges={['top', 'bottom']} className="flex-1">
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen />
          </Stack>
          <PortalHost />
        </SafeAreaView>
        {showAnimation && (
          <View className="absolute inset-0 z-50">
            <AnimationScreen setShowAnimation={setShowAnimation} />
          </View>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
