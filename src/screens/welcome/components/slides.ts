import type {FC} from 'react';

import {StockChartPreview} from './StockChartPreview';
import {PortfolioPreview} from './PortfolioPreview';
import {MoversPreview} from './MoversPreview';

export interface SlideProps {
  id: string;
  title: string;
  subtitle: string;
  Component: FC;
}

export const SLIDES: SlideProps[] = [
  {
    id: 'market',
    title: 'Stay Ahead with Fast,\nReal-Time Market Data',
    subtitle: 'Access powerful tools for beginners and pros to trade smarter and faster.',
    Component: StockChartPreview,
  },
  {
    id: 'portfolio',
    title: 'Track Your Portfolio\nin One Glance',
    subtitle: 'Monitor holdings, P&L, and performance with beautiful visual breakdowns.',
    Component: PortfolioPreview,
  },
  {
    id: 'movers',
    title: 'Discover Top Movers &\nMarket Trends',
    subtitle: 'Spot hot sectors, trending stocks, and market insights the moment they happen.',
    Component: MoversPreview,
  },
];