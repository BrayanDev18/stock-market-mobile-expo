import {View, Text} from 'react-native';

import {SummaryRow} from './SummaryRow';

interface SummaryItemProps {
  label: string;
  value: string;
  /** Tailwind text-color class for the value (default `text-white`). */
  valueColor?: string;
}

interface SummaryTotalProps {
  label: string;
  value: string;
  /** Tailwind text-color class for the bold total value (default `text-white`). */
  valueColor?: string;
}

interface SummaryCardProps {
  /** Section heading (default "Summary"). */
  title?: string;
  /** Standard label↔value rows, divider-separated. */
  rows: SummaryItemProps[];
  /** Bold emphasized total row at the bottom. */
  total: SummaryTotalProps;
}

const Divider = () => <View className="h-px bg-neutral-800" />;

/** "Summary" card: a list of SummaryRows + dividers ending in a bold total. */
export const SummaryCard = ({title = 'Summary', rows, total}: SummaryCardProps) => (
  <View className="mt-6 mx-5 gap-4">
    <Text className="text-white text-lg font-medium">{title}</Text>

    <View className="bg-surface-light rounded-2xl p-4 gap-3">
      {rows.map((row, index) => (
        <View key={row.label} className="gap-3">
          <SummaryRow
            label={row.label}
            value={row.value}
            valueColor={row.valueColor}
          />
          {index < rows.length && <Divider />}
        </View>
      ))}

      <View className="flex-row items-center justify-between">
        <Text className="text-white text-base font-semibold">{total.label}</Text>
        <Text className={`text-base font-semibold ${total.valueColor ?? 'text-white'}`}>
          {total.value}
        </Text>
      </View>
    </View>
  </View>
);
