import { View, Text, Image } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function OfflineIndicator() {

    return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0 z-50 bg-polar items-center justify-center px-6"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <View className="items-center justify-center">
        <Image
          source={require('@/assets/images/no-connection.png')}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
        <Text className="text-ink text-2xl font-nunito-bold mt-6 text-center">
          Sem conexão com a internet
        </Text>
        <Text className="text-ink-light text-base mt-3 text-center max-w-sm">
          Este aplicativo requer conexão com a internet para funcionar. Por favor, verifique sua conexão e tente novamente.
        </Text>
      </View>
    </Animated.View>
  );
}

