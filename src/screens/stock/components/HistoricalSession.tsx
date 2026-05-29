import {View, Text} from 'react-native';
import {IconActivity} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {formatCurrency} from '@/core/utils';
import type {HistoricalPointProps} from '@/core/interfaces';
import {StatItem} from './StatItem';
import {VolumeChart} from './VolumeChart';

interface HistoricalSessionProps {
  historicalSlice: HistoricalPointProps[];
}

export const HistoricalSession = ({historicalSlice}: HistoricalSessionProps) => {
  const latest = historicalSlice[historicalSlice.length - 1];

  return (
    <>
      {/* OHLC summary card (latest session) */}
      <View className="mt-8 gap-4 px-5">
        <View className="flex-row items-center gap-2">
          <IconActivity size={18} color={Colors.accentLight}/>
          <Text className="text-white text-lg font-medium">Latest Session</Text>
          <Text className="text-neutral-500 text-xs ml-auto">
            {latest.date}
          </Text>
        </View>

        <View className="bg-surface-light rounded-2xl p-4 flex-row">
          <StatItem label="Open" value={`$${formatCurrency(latest.open)}`}/>
          <StatItem label="High" value={`$${formatCurrency(latest.high)}`}/>
          <StatItem label="Low" value={`$${formatCurrency(latest.low)}`}/>
          <StatItem label="Close" value={`$${formatCurrency(latest.close)}`}/>
        </View>
      </View>

      {/* Volume bar chart */}
      <VolumeChart historicalSlice={historicalSlice}/>
    </>
  );
};
