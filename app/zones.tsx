import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function ZonesScreen() {
  return (
    <>
      <ScreenHeader title="Zonas" />
      <ScrollView className="flex-1 bg-polar px-6 py-12">
        <View>
          <Text className="text-ink text-3xl font-nunito-bold">Zonas de Irrigação</Text>
          <Text className="text-ink-light text-base mt-4">
            Gerencie as diferentes zonas de irrigação do seu jardim.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}


