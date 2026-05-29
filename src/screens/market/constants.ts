export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y';

interface TimeframeOptionProps {
  id: Timeframe;
  label: string;
}

export const TIMEFRAMES: TimeframeOptionProps[] = [
  {id: '1D', label: '1D'},
  {id: '1W', label: '1W'},
  {id: '1M', label: '1M'},
  {id: '3M', label: '3M'},
  {id: '1Y', label: '1Y'},
];

export const TIMEFRAME_POINTS: Record<Timeframe, number> = {
  '1D': 24,
  '1W': 28,
  '1M': 32,
  '3M': 45,
  '1Y': 52,
};

export type MoverTab = 'gainers' | 'losers' | 'active';

interface MoverTabOptionProps {
  id: MoverTab;
  label: string;
}

export const MOVER_TABS: MoverTabOptionProps[] = [
  {id: 'gainers', label: 'Gainers'},
  {id: 'losers', label: 'Losers'},
  {id: 'active', label: 'Most Active'},
];
