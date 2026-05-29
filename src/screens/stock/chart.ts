import {historicalDataAAPL} from '@/core/data';
import {mulberry32, seedFromString} from '@/core/utils';
import type {HistoricalPointProps, StockProps, ChartPointProps} from '@/core/interfaces';

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

export const POINT_COUNTS: Record<Timeframe, number> = {
  '1D': 26,
  '1W': 28,
  '1M': 30,
  '3M': 45,
  '1Y': 52,
  'ALL': 60,
};

// For AAPL, select a slice of real historical data based on timeframe.
// Intraday timeframes (1D/1W) don't have true intraday data, so we
// fall back to the last 5/10 daily closes.
const TIMEFRAME_SLICES: Record<Timeframe, number> = {
  '1D': 5,
  '1W': 10,
  '1M': 22,
  '3M': 22,
  '1Y': 22,
  'ALL': 22,
};

export const getHistoricalSlice = (tf: Timeframe): HistoricalPointProps[] => {
  const count = Math.min(TIMEFRAME_SLICES[tf], historicalDataAAPL.length);
  return historicalDataAAPL.slice(-count);
};

export const buildChartData = (stock: StockProps, tf: Timeframe): ChartPointProps[] => {
  // Real historical data path — only AAPL has it mocked in the dataset.
  if (stock.symbol === 'AAPL') {
    return getHistoricalSlice(tf).map((p) => ({
      value: p.close,
      date: p.date,
    }));
  }

  // Synthetic, deterministic generator for other symbols
  const count = POINT_COUNTS[tf];
  const rand = mulberry32(seedFromString(stock.symbol + tf));

  const range = stock.high52w - stock.low52w;
  const volatility = range * 0.035;
  const drift = (stock.changePercent / 100) * (range * 0.15);

  const points: ChartPointProps[] = [];
  let value = stock.price * (0.92 + rand() * 0.06);

  for (let i = 0; i < count - 1; i++) {
    const bias = (rand() - 0.5) * volatility + drift / count;
    value += bias;
    value = Math.max(stock.low52w * 0.98, Math.min(stock.high52w * 1.02, value));
    points.push({value: parseFloat(value.toFixed(2))});
  }
  points.push({value: stock.price});

  return points;
};
