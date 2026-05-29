import {useMemo} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';

import {formatCurrency} from '@/core/utils';
import {Colors, trendAlpha} from '@/core/constants';
import type {MarketIndexProps, ChartPointProps} from '@/core/interfaces';

import {buildTrendSeries} from '../charts';
import {TIMEFRAME_POINTS, type Timeframe} from '../constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HERO_CHART_WIDTH = SCREEN_WIDTH - 72;
const HERO_CHART_HEIGHT = 160;

interface HeroChartProps {
  index: MarketIndexProps;
  timeframe: Timeframe;
}

export const HeroChart = ({index, timeframe}: HeroChartProps) => {
  const data = useMemo(
    () =>
      buildTrendSeries(
        `${index.symbol}-${timeframe}`,
        index.changePercent,
        TIMEFRAME_POINTS[timeframe],
        index.value,
      ),
    [index, timeframe],
  );

  const isPositive = index.changePercent >= 0;
  const lineColor = isPositive ? Colors.up : Colors.down;
  const fillStart = isPositive ? trendAlpha.up(0.35) : trendAlpha.down(0.35);
  const fillEnd = isPositive ? trendAlpha.up(0) : trendAlpha.down(0);

  const values = data.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.15 || 1;

  return (
    <LineChart
      data={data}
      width={HERO_CHART_WIDTH}
      height={HERO_CHART_HEIGHT}
      initialSpacing={0}
      endSpacing={0}
      spacing={HERO_CHART_WIDTH / (data.length - 1)}
      thickness={2.5}
      color={lineColor}
      curved
      areaChart
      startFillColor={fillStart}
      endFillColor={fillEnd}
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
        pointerStripHeight: HERO_CHART_HEIGHT,
        pointerStripColor: 'rgba(255,255,255,0.15)',
        pointerStripWidth: 1,
        pointerColor: lineColor,
        radius: 5,
        activatePointersOnLongPress: false,
        autoAdjustPointerLabelPosition: true,
        pointerLabelWidth: 90,
        pointerLabelHeight: 30,
        pointerLabelComponent: (items: ChartPointProps[]) => (
          <View className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1">
            <Text className="text-white text-xs font-semibold">
              {formatCurrency(items[0].value)}
            </Text>
          </View>
        ),
      }}
    />
  );
};
