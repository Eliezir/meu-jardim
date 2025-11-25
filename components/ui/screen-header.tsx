import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Pressable, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export function ScreenHeader({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const canGoBack = pathname !== '/' && pathname !== '/index';

  if (!title && !canGoBack) {
    return null;
  }

  return (
    <View className="bg-polar px-6 pt-12 flex-row items-center">
      {canGoBack && (
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Icon as={ArrowLeft} className="text-ink" size={24} />
        </Pressable>
      )}
      {title && (
        <Text className="text-garden-green text-3xl font-nunito-bold flex-1">
          {title}
        </Text>
      )}
    </View>
  );
}

