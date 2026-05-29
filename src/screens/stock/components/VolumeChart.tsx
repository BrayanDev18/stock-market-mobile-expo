import {View, Text, Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';

import {trendAlpha} from '@/core/constants';
import type {HistoricalPointProps} from '@/core/interfaces';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 10;

interface VolumeChartProps {
  historicalSlice: HistoricalPointProps[];
}

export const VolumeChart = ({historicalSlice}: VolumeChartProps) => (
  <View className="mt-8 gap-4 px-5">
    <View className="flex-row items-baseline justify-between">
      <Text className="text-white text-lg font-medium">Volume</Text>
      <Text className="text-neutral-500 text-xs">
        {historicalSlice.length} sessions
      </Text>
    </View>

    <View className="bg-surface-light rounded-2xl p-4">
      <BarChart
        data={historicalSlice.map((p, i) => ({
          value: p.volume / 1_000_000,
          frontColor:
            i === historicalSlice.length - 1
              ? trendAlpha.up(0.65)
              : p.close >= p.open
                ? trendAlpha.up(0.22)
                : trendAlpha.down(0.22),
        }))}
        width={CHART_WIDTH - 16}
        height={110}
        barWidth={Math.max(6, (CHART_WIDTH - 16) / historicalSlice.length - 6)}
        spacing={4}
        initialSpacing={0}
        hideRules
        hideYAxisText
        xAxisColor="transparent"
        yAxisColor="transparent"
        barBorderRadius={2}
        disableScroll
      />
      <Text className="text-neutral-500 text-[10px] mt-2">
        Volume in millions · green bars = up days
      </Text>
    </View>
  </View>
);
