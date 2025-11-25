import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function ForecastScreen() {
  return (
    <>
      <ScreenHeader title="Previsão" />
      <ScrollView className="flex-1 bg-polar px-6 py-12">
        <View>
          <Text className="text-ink text-3xl font-nunito-bold">Previsão do Tempo</Text>
          <Text className="text-ink-light text-base mt-4">
            Consulte a previsão do tempo para ajustar a irrigação do seu jardim.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}


