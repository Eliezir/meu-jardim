import { cn } from '@/lib/utils';
import { Platform, Pressable, View, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabButton({
  isFocused,
  options,
  onPress,
  onLongPress,
  activeColor,
  inactiveColor,
}: {
  route: BottomTabBarProps['state']['routes'][number];
  index: number;
  isFocused: boolean;
  options: BottomTabBarProps['descriptors'][string]['options'];
  onPress: () => void;
  onLongPress: () => void;
  activeColor: string;
  inactiveColor: string;
}) {
  const translateY = useSharedValue(0);
  const borderBottomWidth = useSharedValue(4);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      borderBottomWidth: borderBottomWidth.value,
    };
  });

  const handlePressIn = () => {
    translateY.value = withTiming(2, { duration: 200 });
    borderBottomWidth.value = withTiming(0, { duration: 200 });
  };

  const handlePressOut = () => {
    translateY.value = withTiming(0, { duration: 200 });
    borderBottomWidth.value = withTiming(4, { duration: 200 });
  };

  const Icon = options.tabBarIcon
    ? options.tabBarIcon({
        focused: isFocused,
        color: isFocused ? activeColor : inactiveColor,
        size: 32,
      })
    : null;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="flex-1 items-center justify-center">
      <Animated.View
        className={cn(
          'bg-white rounded-[15px] border',
          Platform.select({ web: 'cursor-pointer' }),
          'px-3 py-2 flex-1 items-center justify-center min-h-[44px]'
        )}
        style={[
          animatedStyle,
          {
            borderColor: isFocused ? activeColor : 'transparent',
            borderBottomColor: isFocused ? activeColor : 'transparent',
          },
        ]}>
        {Icon && <View>{Icon}</View>}
      </Animated.View>
    </AnimatedPressable>
  );
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const activeColor = '#58CC02'; // garden-green
  const inactiveColor = '#777777'; // ink-light

  return (
    <View
      className="bg-snow border-t border-silver flex-row justify-center items-center"
      style={{
        paddingBottom: 8,
        paddingTop: 8,
        paddingHorizontal: 8,
        height: 60,
        gap: 0,
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            route={route}
            index={index}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
            onLongPress={onLongPress}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
          />
        );
      })}
    </View>
  );
}

