import {View, Text, Pressable, Dimensions} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';

import {Colors} from '@/core/constants';
import {formatCurrency} from '@/core/utils';
import type {ChartPointProps, StockProps} from '@/core/interfaces';
import {TIMEFRAMES, type Timeframe} from '../chart';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 10;
const CHART_HEIGHT = 220;

interface PriceChartProps {
  stock: StockProps;
  chartData: ChartPointProps[];
  activeTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

export const PriceChart = ({
  stock,
  chartData,
  activeTimeframe,
  onTimeframeChange,
}: PriceChartProps) => {
  const isPositive = stock.changePercent >= 0;
  const lineColor = isPositive ? Colors.up : Colors.down;

  const values = chartData.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.12 || 1;

  return (
    <>
      {/* Chart */}
      <View className="mt-6">
        <LineChart
          data={chartData}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          initialSpacing={0}
          endSpacing={0}
          spacing={CHART_WIDTH / (chartData.length - 1)}
          thickness={2}
          color={lineColor}
          curved
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
            pointerLabelHeight: 40,
            pointerLabelComponent: (items: ChartPointProps[]) => (
              <View className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
                <Text className="text-white text-xs font-semibold">
                  ${formatCurrency(items[0].value)}
                </Text>
                {items[0].date && (
                  <Text className="text-neutral-400 text-[10px]">
                    {items[0].date}
                  </Text>
                )}
              </View>
            ),
          }}
        />
      </View>

      {/* Timeframe Tabs */}
      <View className="flex-row mt-4 mx-5 p-1 bg-surface-light rounded-full border border-neutral-800/60">
        {TIMEFRAMES.map((tf) => {
          const isActive = tf.id === activeTimeframe;

          return (
            <Pressable
              key={tf.id}
              onPress={() => onTimeframeChange(tf.id)}
              className={`flex-1 py-2 rounded-full items-center ${isActive ? 'bg-neutral-700' : ''}`}
            >
              <Text
                className={`text-xs font-medium ${isActive ? 'text-white' : 'text-neutral-500'}`}
              >
                {tf.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};
