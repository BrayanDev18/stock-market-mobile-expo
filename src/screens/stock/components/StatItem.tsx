import {View, Text} from 'react-native';

interface StatItemProps {
  label: string;
  value: string;
}

export const StatItem = ({label, value}: StatItemProps) => (
  <View className="flex-1 gap-1">
    <Text className="text-neutral-500 text-xs">{label}</Text>
    <Text className="text-white text-sm font-medium">{value}</Text>
  </View>
);
