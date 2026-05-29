import Svg, {Polyline} from 'react-native-svg';

import {Colors} from '@/core/constants';

const generateSparkline = (isPositive: boolean): string => {
  const points: number[] = [];
  let value = 10 + Math.random() * 10;
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - (isPositive ? 0.35 : 0.65)) * 3;
    value = Math.max(2, Math.min(28, value));
    points.push(value);
  }
  return points.map((y, x) => `${(x / 19) * 60},${y}`).join(' ');
};

interface MiniChartProps {
  isPositive: boolean;
}

/** Tiny decorative SVG sparkline used in the home watchlist rows. */
export const MiniChart = ({isPositive}: MiniChartProps) => (
  <Svg width={60} height={30} viewBox="0 0 60 30">
    <Polyline
      points={generateSparkline(isPositive)}
      fill="none"
      stroke={isPositive ? Colors.up : Colors.down}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);