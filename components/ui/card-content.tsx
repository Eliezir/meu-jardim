import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { View } from 'react-native';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';

type CardContentProps = {
  icon: LucideIcon;
  value: string | number;
  text: string;
  secondaryValue?: string | number;
  secondaryText?: string;
  iconColor?: string;
};

export function CardContent({
  icon,
  value,
  text,
  secondaryValue,
  secondaryText,
  iconColor = 'text-warning-orange',
}: CardContentProps) {
  return (
    <View className="flex-row gap-3 items-center flex-1">
      <Icon as={icon} className={cn(iconColor)} size={24} />
      <View className="flex-1">
        <Text className="text-ink text-xl font-nunito-bold">
          {value}
        </Text>
        <Text className="text-ink-light text-sm font-nunito mt-0.5">
          {text}
        </Text>
        {secondaryValue !== undefined && secondaryText && (
          <>
            <Text className="text-ink text-lg font-nunito-semibold mt-2">
              {secondaryValue}
            </Text>
            <Text className="text-ink-light text-sm font-nunito mt-0.5">
              {secondaryText}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

