import {useMemo} from 'react';
import {LineChart} from 'react-native-gifted-charts';

import {Colors, trendAlpha} from '@/core/constants';

import {buildTrendSeries} from '../charts';

interface SparklineProps {
  seed: string;
  changePercent: number;
  width?: number;
  height?: number;
  points?: number;
}

export const Sparkline = ({
  seed,
  changePercent,
  width = 70,
  height = 34,
  points = 18,
}: SparklineProps) => {
  const data = useMemo(
    () => buildTrendSeries(seed, changePercent, points),
    [seed, changePercent, points],
  );

  const isPositive = changePercent >= 0;
  const lineColor = isPositive ? Colors.up : Colors.down;
  const fillStart = isPositive ? trendAlpha.up(0.3) : trendAlpha.down(0.3);
  const fillEnd = isPositive ? trendAlpha.up(0) : trendAlpha.down(0);

  const values = data.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.2 || 1;

  return (
    <LineChart
      data={data}
      width={width}
      height={height}
      initialSpacing={0}
      endSpacing={0}
      spacing={width / (data.length - 1)}
      thickness={1.5}
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
      disableScroll
    />
  );
};