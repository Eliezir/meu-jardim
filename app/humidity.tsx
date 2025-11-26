import { ScrollView, View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useState, useRef, useEffect } from 'react';
import { useSoilHumidityQuery, useHumidityLimitQuery } from '@/lib/firebase/queries';
import { useUpdateHumidityLimit } from '@/lib/firebase/mutations';

export default function UmidityScreen() {
  const { data: currentHumidity } = useSoilHumidityQuery();
  const { data: limitHumidityData } = useHumidityLimitQuery();
  const updateLimitMutation = useUpdateHumidityLimit();
  const [limitHumidity, setLimitHumidity] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (limitHumidityData !== undefined) {
      setLimitHumidity(String(limitHumidityData));
    }
  }, [limitHumidityData]);

  const handleLimitChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setLimitHumidity('');
      return;
    }
    
    const numValue = parseInt(numericValue, 10);
    if (numValue >= 0 && numValue <= 100) {
      setLimitHumidity(numericValue);
      updateLimitMutation.mutate(numValue);
    }
  };

  const handlePress = () => {
    inputRef.current?.focus();
    setTimeout(() => {
      inputRef.current?.setNativeProps({ selection: { start: 0, end: 0 } });
    }, 100);
  };

  return (
    <>
      <ScreenHeader title="Umidade" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          className="flex-1 bg-polar px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
        <View className="mt-6">
          <Text className="text-ink text-lg font-nunito-semibold mb-2">
            Umidade Atual
          </Text>
          <Text className="text-ink-light text-sm mb-4">
            Nível de umidade atual do solo no seu jardim.
          </Text>
          <View className="bg-snow rounded-2xl px-6 py-8 items-center border border-silver">
            <Text className="text-ink-light text-base mb-2">Umidade do Solo</Text>
            <Text className="text-water-blue text-6xl leading-[72px] font-nunito-bold">{currentHumidity ?? '--'}%</Text>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-ink text-lg font-nunito-semibold mb-2">
            Limite de Umidade
          </Text>
          <Text className="text-ink-light text-sm mb-4">
            Defina o nível mínimo de umidade. Quando a umidade estiver abaixo deste valor, a irrigação será ativada automaticamente.
          </Text>
          <Pressable onPress={handlePress}>
            <View className="bg-snow rounded-2xl px-6 py-4 border border-silver flex-row items-center justify-center gap-2 min-h-[120px]" >
              <TextInput
                ref={inputRef}
                value={limitHumidity}
                onChangeText={handleLimitChange}
                keyboardType="numeric"
                maxLength={3}
                className="text-ink text-5xl leading-[60px]"
                placeholder="40"
                placeholderTextColor="#777777"
              />
              <Text className="text-ink text-3xl font-nunito-bold leading-[60px] w-[36px] text-center">%</Text>
            </View>
          </Pressable>
        </View>

        <View className="mt-6 mb-6">
          <View className="bg-snow rounded-2xl px-4 py-4 border border-silver">
            <Text className="text-ink text-base font-nunito-semibold mb-2">
              💡 Informações sobre Umidade
            </Text>
            <Text className="text-ink-light text-sm leading-5 mb-3">
              A umidade ideal do solo para grama varia entre 40% e 60%. Abaixo de 40%, a grama pode começar a murchar e ficar amarelada.
            </Text>
            <Text className="text-ink-light text-sm leading-5 mb-3">
              <Text className="font-nunito-semibold">Recomendação:</Text> Mantenha o limite entre 35% e 45% para garantir que a irrigação seja ativada antes que a grama sofra danos.
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

