import {View, Text} from 'react-native';
import {IconCopy} from '@tabler/icons-react-native';

interface DetailRowProps {
  label: string;
  value: string;
  valueClassName?: string;
  copyable?: boolean;
}

export const DetailRow = ({label, value, valueClassName = 'text-white', copyable = false}: DetailRowProps) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-neutral-400 text-sm">{label}</Text>
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-medium ${valueClassName}`}>{value}</Text>
      {copyable && <IconCopy size={14} color="#737373"/>}
    </View>
  </View>
);
