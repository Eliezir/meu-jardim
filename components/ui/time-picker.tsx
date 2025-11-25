import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ScrollView as ScrollViewType,
  type ViewStyle,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type TimePickerMode = 'hour-minute' | 'minute-second';

type TimePickerProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  mode?: TimePickerMode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  color?: 'blue' | 'green' | 'default';
};

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export function TimePicker({
  label,
  value,
  onChange,
  mode = 'hour-minute',
  className,
  style,
  color = 'default',
}: TimePickerProps) {
  const [visible, setVisible] = useState(false);
  const [tempFirst, setTempFirst] = useState('00');
  const [tempSecond, setTempSecond] = useState('00');

  const [firstLabel, secondLabel] = useMemo(
    () => (mode === 'hour-minute' ? ['Horas', 'Minutos'] : ['Minutos', 'Segundos']),
    [mode]
  );

  const openPicker = () => {
    const [first = '00', second = '00'] = value.split(':');
    setTempFirst(first.padStart(2, '0'));
    setTempSecond(second.padStart(2, '0'));
    setVisible(true);
  };

  useEffect(() => {
    onChange(tempFirst + ':' + tempSecond);
  }, [tempFirst, tempSecond]);




  const firstOptions = mode === 'hour-minute' ? HOURS : MINUTES_SECONDS;
  const secondOptions = MINUTES_SECONDS;

  const borderColorClass = 
    color === 'blue' ? 'border-water-blue' :
    color === 'green' ? 'border-garden-green' :
    'border-silver';

  const textColorClass = 
    color === 'blue' ? 'text-water-blue' :
    color === 'green' ? 'text-garden-green' :
    'text-ink';

  return (
    <View className={className} style={style}>
      {label && <Text className="text-ink text-base font-nunito-semibold mb-2">{label}</Text>}
      <Pressable
        onPress={openPicker}
        className="flex-row items-center justify-center gap-3"
        accessibilityRole="button"
      >
        <View className={cn("rounded-2xl bg-snow px-4 py-3 min-w-[80px] items-center flex-1 aspect-square justify-center border-2", borderColorClass)}>
          <Text className={cn("text-5xl leading-[60px] font-nunito-bold", textColorClass)}>{value.split(':')[0]}</Text>
        </View>
        <Text className={cn("text-5xl leading-[60px] font-nunito-bold", textColorClass)}>:</Text>
        <View className={cn("rounded-2xl bg-snow px-4 py-3 min-w-[80px] items-center flex-1 aspect-square justify-center border-2", borderColorClass)}>
          <Text className={cn("text-5xl leading-[60px] font-nunito-bold", textColorClass)}>{value.split(':')[1]}</Text>
        </View>
      </Pressable>

      <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent variant="bottom" className="bg-white p-6 gap-6">
          <View className="flex-row items-center gap-4 justify-center">
            <PickerColumn
              label={firstLabel}
              options={firstOptions}
              selectedValue={tempFirst}
              onSelect={setTempFirst}
              modalVisible={visible}
              color={color}
            />
            <Text className={cn("text-ink text-2xl font-nunito-bold mt-10", textColorClass)}>:</Text>
            <PickerColumn
              label={secondLabel}
              options={secondOptions}
              selectedValue={tempSecond}
              onSelect={setTempSecond}
              modalVisible={visible}
              color={color}
            />
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}

type PickerColumnProps = {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  modalVisible: boolean;
  color?: 'blue' | 'green' | 'default';
};

function PickerColumn({ label, options, selectedValue, onSelect, modalVisible, color = 'default' }: PickerColumnProps) {
  const scrollViewRef = useRef<ScrollViewType | null>(null);
  const containerHeightRef = useRef(0);
  const itemHeightRef = useRef(0);

  const scrollToSelected = useCallback(() => {
    const scrollView = scrollViewRef.current;
    const containerHeight = containerHeightRef.current;
    const itemHeight = itemHeightRef.current;

    if (!scrollView || !containerHeight || !itemHeight) {
      return;
    }

    const selectedIndex = options.findIndex(option => option === selectedValue);
    if (selectedIndex < 0) {
      return;
    }

    const target =
      selectedIndex * itemHeight - containerHeight / 2 + itemHeight / 2;

    scrollView.scrollTo({ y: Math.max(0, target), animated: true });
  }, [options, selectedValue]);

  useEffect(() => {
    if (!modalVisible) {
      return;
    }

    const frame = requestAnimationFrame(scrollToSelected);
    return () => cancelAnimationFrame(frame);
  }, [modalVisible, scrollToSelected]);

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height === containerHeightRef.current) {
      return;
    }
    containerHeightRef.current = height;

    if (modalVisible) {
      requestAnimationFrame(scrollToSelected);
    }
  };

  const handleItemLayout = (event: LayoutChangeEvent) => {
    if (itemHeightRef.current) {
      return;
    }
    itemHeightRef.current = event.nativeEvent.layout.height;

    if (modalVisible) {
      requestAnimationFrame(scrollToSelected);
    }
  };

  return (
    <View className="items-center gap-3">
      <Text className="text-ink-light font-nunito-semibold">{label}</Text>
      <ScrollView
        ref={scrollViewRef}
        className="h-64 w-20"
        onLayout={handleScrollViewLayout}
      >
        {options.map(option => {
          const selected = option === selectedValue;
          return (
            <Pressable
              id={`${label}-${option}`}
              key={`${label}-${option}`}
              onPress={() => onSelect(option)}
              onLayout={handleItemLayout}
              className={cn(
                'py-3 items-center',
                selected && cn(
                  'border border-b-4 rounded-lg mx-1 my-1',
                  color === 'blue' ? 'bg-water-blue border-water-blue-lip' :
                  color === 'green' ? 'bg-garden-green border-garden-green-lip' :
                  'bg-garden-green border-garden-green-lip'
                )
              )}
            >
              <Text
                className={cn(
                  'text-lg leading-[24px]  w-fullfont-nunito-semibold text-ink',
                  selected && 'text-white font-bold' 
                )}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

