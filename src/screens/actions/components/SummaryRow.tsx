import {View, Text} from 'react-native';

interface SummaryRowProps {
  label: string;
  value: string;
  /** Tailwind text-color class for the value (default `text-white`). */
  valueColor?: string;
}

/** Label↔value row used in the deposit/withdraw confirmation summaries. */
export const SummaryRow = ({
  label,
  value,
  valueColor = 'text-white',
}: SummaryRowProps) => (
  <View className="flex-row items-center justify-between">
    <Text className="text-neutral-400 text-sm">{label}</Text>
    <Text className={`text-sm font-medium ${valueColor}`}>{value}</Text>
  </View>
);