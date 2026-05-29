import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '@/core/constants';
import {
  marketIndices,
  stocks,
  portfolio,
  historicalDataAAPL,
  sectors,
  topGainers,
  topLosers,
} from '@/core/data';
import {mulberry32} from '@/core/utils';

export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const CARD_WIDTH = SCREEN_WIDTH * 0.78;

export const CHART_VIEW_W = 260;
export const CHART_VIEW_H = 90;

// ---------------------------------------------------------------------------
// Real data pulled from @/core/data so the preview mock-ups stay coherent with the
// rest of the app (same AAPL price, indices and holdings shown elsewhere).
// ---------------------------------------------------------------------------

export const aapl = stocks.find((s) => s.symbol === 'AAPL') ?? stocks[0];
export const aaplSession = historicalDataAAPL[historicalDataAAPL.length - 1];
export const aaplVwap =
  historicalDataAAPL.reduce((sum, p) => sum + ((p.high + p.low + p.close) / 3) * p.volume, 0) /
  historicalDataAAPL.reduce((sum, p) => sum + p.volume, 0);

export const spIndex = marketIndices.find((i) => i.symbol === '^GSPC') ?? marketIndices[0];
export const dowIndex = marketIndices.find((i) => i.symbol === '^DJI') ?? marketIndices[1];
export const nasdaqIndex = marketIndices.find((i) => i.symbol === '^IXIC') ?? marketIndices[2];
export const techSector = sectors.find((s) => s.name === 'Technology') ?? sectors[0];
export const topMover = topGainers[0];

export const AVATAR_PALETTE = ['#fbbf24', '#4ade80', '#60a5fa', '#a855f7', '#f87171'];

// Top 3 holdings by market value, with live gain % — for the Portfolio preview.
export const previewHoldings = [...portfolio.holdings]
  .map((h) => {
    const stock = stocks.find((s) => s.symbol === h.symbol) ?? stocks[0];
    return {
      symbol: h.symbol,
      name: stock.name,
      value: h.shares * h.currentPrice,
      gainPercent: ((h.currentPrice - h.avgCost) / h.avgCost) * 100,
    };
  })
  .sort((a, b) => b.value - a.value)
  .slice(0, 3);

// Biggest movers: top 3 gainers + the single biggest loser — for the Market preview.
export const previewMovers = [...topGainers.slice(0, 3), topLosers[0]];

export const AAPL_CHART_POINTS = [
  18, 22, 19, 25, 14, 28, 16, 24, 12, 20,
  17, 26, 15, 23, 18, 21, 13, 27, 16, 25,
  19, 29, 15, 24, 18, 22, 14, 26, 17, 21,
  15, 23, 19, 27, 14, 25, 18, 22, 16, 24,
];

export const PORTFOLIO_CHART_POINTS = [
  38, 35, 37, 32, 34, 30, 31, 28, 29, 25,
  27, 23, 24, 21, 22, 19, 20, 16, 17, 14,
  15, 12, 13, 11, 12, 9, 10, 8, 9, 7,
  8, 6, 7, 5, 6, 4, 5, 3, 4, 2,
];

export const buildChartPointsString = (values: number[], width: number) =>
  values
    .map((y, x) => `${(x / (values.length - 1)) * width},${y + 5}`)
    .join(' ');

// Seeded PRNG (from @/core/utils/chart-helpers) keeps decorative sparklines stable.
export const generateSparklinePoints = (rising: boolean, seed: number): string => {
  const rand = mulberry32(seed);
  const points: number[] = [];
  let value = 10 + rand() * 6;
  for (let i = 0; i < 20; i++) {
    value += (rand() - (rising ? 0.3 : 0.7)) * 3;
    value = Math.max(3, Math.min(18, value));
    points.push(value);
  }
  return points.map((y, x) => `${(x / 19) * 70},${y}`).join(' ');
};

export const previewStyles = StyleSheet.create({
  phoneCard: {
    shadowColor: Colors.accentLight,
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
  floatingCard: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaShadow: {
    shadowColor: Colors.accentLight,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
});