import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';

export default function UmidityScreen() {
  return (
    <>
      <ScreenHeader title="Umidade" />
      <ScrollView className="flex-1 bg-polar px-6 py-12">
        <View>
          <Text className="text-ink text-3xl font-nunito-bold">Umidade</Text>
          <Text className="text-ink-light text-base mt-4">
            Acompanhe os níveis de umidade do solo e histórico de irrigação.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

