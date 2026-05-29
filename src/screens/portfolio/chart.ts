import {mulberry32, seedFromString} from '@/core/utils';
import type {ChartPointProps} from '@/core/interfaces';

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export interface TimeframeOptionProps {
  id: Timeframe;
  label: string;
}

export const TIMEFRAMES: TimeframeOptionProps[] = [
  {id: '1D', label: '1D'},
  {id: '1W', label: '1W'},
  {id: '1M', label: '1M'},
  {id: '3M', label: '3M'},
  {id: '1Y', label: '1Y'},
  {id: 'ALL', label: 'ALL'},
];

/**
 * Builds a deterministic portfolio line per timeframe.
 *
 * - 1D → 24 points (hourly-ish) with very tight range
 * - 1W → 7 sessions
 * - 1M → 30 sessions
 * - 3M → 66 sessions
 * - 1Y → 52 weeks
 * - ALL → 80 points
 *
 * The line always ends at `portfolio.totalValue`, and the starting value is
 * derived from `portfolio.dayChangePercent` (for 1D) or a broader drift for
 * longer timeframes, so the curve visually matches the displayed %.
 */
export const TIMEFRAME_CONFIG: Record<
  Timeframe,
  {count: number; driftPct: number; volPct: number}
> = {
  '1D': {count: 24, driftPct: 0.011, volPct: 0.004},
  '1W': {count: 7, driftPct: 0.025, volPct: 0.009},
  '1M': {count: 30, driftPct: 0.045, volPct: 0.012},
  '3M': {count: 66, driftPct: 0.08, volPct: 0.016},
  '1Y': {count: 52, driftPct: 0.165, volPct: 0.022},
  'ALL': {count: 80, driftPct: 0.26, volPct: 0.028},
};

export const buildPortfolioSeries = (
  tf: Timeframe,
  endValue: number,
): ChartPointProps[] => {
  const {count, driftPct, volPct} = TIMEFRAME_CONFIG[tf];
  const rand = mulberry32(seedFromString(`portfolio-${tf}`));

  const startValue = endValue * (1 - driftPct);
  const volatility = endValue * volPct;

  const points: ChartPointProps[] = [];
  let value = startValue;

  for (let i = 0; i < count - 1; i++) {
    const progress = i / (count - 1);
    const target = startValue + (endValue - startValue) * progress;
    const jitter = (rand() - 0.5) * volatility;
    value = target + jitter;
    points.push({value: parseFloat(value.toFixed(2))});
  }
  points.push({value: endValue});

  return points;
};
