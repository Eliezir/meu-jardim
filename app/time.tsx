import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function TimeScreen() {
  return (
    <>
      <ScreenHeader title="Tempo" />
      <ScrollView className="flex-1 bg-polar px-6 py-12">
        <View>
          <Text className="text-ink text-3xl font-nunito-bold">Tempo de Irrigação</Text>
          <Text className="text-ink-light text-base mt-4">
            Configure e visualize os horários de irrigação do seu jardim.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}


