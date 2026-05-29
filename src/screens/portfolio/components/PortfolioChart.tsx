import {View, Text, Dimensions} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';

import {formatCurrency} from '@/core/utils';
import {Colors, trendAlpha} from '@/core/constants';
import type {ChartPointProps} from '@/core/interfaces';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 180;

interface PortfolioChartProps {
  chartData: ChartPointProps[];
  isPeriodPositive: boolean;
}

/** Portfolio area LineChart with its pointer/tooltip config. */
export const PortfolioChart = ({
  chartData,
  isPeriodPositive,
}: PortfolioChartProps) => {
  const lineColor = isPeriodPositive ? Colors.up : Colors.down;
  const startFillColor = isPeriodPositive
    ? trendAlpha.up(0.35)
    : trendAlpha.down(0.35);
  const endFillColor = isPeriodPositive ? trendAlpha.up(0) : trendAlpha.down(0);

  const values = chartData.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.15 || 1;

  return (
    <View className="mt-4 -ml-2">
      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        initialSpacing={0}
        endSpacing={0}
        spacing={CHART_WIDTH / (chartData.length - 1)}
        thickness={2.5}
        color={lineColor}
        curved
        areaChart
        startFillColor={startFillColor}
        endFillColor={endFillColor}
        startOpacity={1}
        endOpacity={0}
        hideDataPoints
        hideRules
        hideAxesAndRules
        hideYAxisText
        xAxisColor="transparent"
        yAxisColor="transparent"
        yAxisOffset={minValue - padding}
        maxValue={maxValue - minValue + padding * 2}
        pointerConfig={{
          pointerStripHeight: CHART_HEIGHT,
          pointerStripColor: 'rgba(255,255,255,0.15)',
          pointerStripWidth: 1,
          pointerColor: lineColor,
          radius: 5,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelWidth: 100,
          pointerLabelHeight: 34,
          pointerLabelComponent: (items: ChartPointProps[]) => (
            <View className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
              <Text className="text-white text-xs font-semibold">
                ${formatCurrency(items[0].value)}
              </Text>
            </View>
          ),
        }}
      />
    </View>
  );
};
