export interface StockProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  high52w: number;
  low52w: number;
  pe: number | null;
  eps: number | null;
  dividend: number | null;
  sector: string;
  exchange: string;
  logo: string;
  about: string;
}

export interface HistoricalPointProps {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItemProps {
  id: string;
  title: string;
  source: string;
  date: string;
  imageUrl: string;
  symbols: string[];
  summary: string;
}

export interface WatchlistGroupProps {
  id: string;
  name: string;
  symbols: string[];
}

export interface MarketIndexProps {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface SectorProps {
  name: string;
  change: number;
  marketCap: string;
}

export interface PortfolioHoldingProps {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}

export interface TransactionProps {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  date: string;
}

export interface PortfolioProps {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: PortfolioHoldingProps[];
  transactions: TransactionProps[];
}
