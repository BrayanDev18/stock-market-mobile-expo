import {mulberry32, seedFromString} from '@/core/utils';
import type {ChartPointProps} from '@/core/interfaces';

/**
 * Builds a trend-aware synthetic sparkline. The final value is biased by
 * `changePercent` so gainers end higher than they started, and losers end
 * lower — without that the sparkline would just look like noise.
 */
export const buildTrendSeries = (
  seed: string,
  changePercent: number,
  count: number,
  baseValue = 100,
): ChartPointProps[] => {
  const rand = mulberry32(seedFromString(seed));
  const drift = (changePercent / 100) * baseValue * 0.18;
  const volatility = baseValue * 0.012;

  const points: ChartPointProps[] = [];
  let value = baseValue - drift * (0.5 + rand() * 0.4);

  for (let i = 0; i < count - 1; i++) {
    const jitter = (rand() - 0.5) * volatility * 2;
    value += jitter + drift / count;
    points.push({value: parseFloat(value.toFixed(2))});
  }
  points.push({value: parseFloat((baseValue + (rand() - 0.5) * volatility).toFixed(2))});

  return points;
};
