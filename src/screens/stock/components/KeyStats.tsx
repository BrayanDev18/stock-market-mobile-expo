import {View, Text} from 'react-native';

import {formatCurrency} from '@/core/utils';
import type {HistoricalPointProps, StockProps} from '@/core/interfaces';
import {StatItem} from './StatItem';

interface KeyStatsProps {
  stock: StockProps;
  historicalSlice: HistoricalPointProps[] | null;
}

export const KeyStats = ({stock, historicalSlice}: KeyStatsProps) => {
  const openValue = historicalSlice
    ? historicalSlice[historicalSlice.length - 1].open
    : stock.price - stock.change;

  return (
    <View className="mt-8 gap-4 px-5">
      <Text className="text-white text-lg font-medium">Key Stats</Text>

      <View className="bg-surface-light rounded-2xl p-4 gap-4">
        <View className="flex-row">
          <StatItem label="Open" value={`$${formatCurrency(openValue)}`}/>
          <StatItem label="Volume" value={stock.volume}/>
          <StatItem label="Mkt Cap" value={stock.marketCap}/>
        </View>

        <View className="h-px bg-neutral-800"/>

        <View className="flex-row">
          <StatItem label="52W High" value={`$${formatCurrency(stock.high52w)}`}/>
          <StatItem label="52W Low" value={`$${formatCurrency(stock.low52w)}`}/>
          <StatItem label="P/E" value={stock.pe ? stock.pe.toFixed(2) : '—'}/>
        </View>

        <View className="h-px bg-neutral-800"/>

        <View className="flex-row">
          <StatItem label="EPS" value={stock.eps ? `$${stock.eps.toFixed(2)}` : '—'}/>
          <StatItem label="Dividend" value={stock.dividend ? `$${stock.dividend.toFixed(2)}` : '—'}/>
          <StatItem label="Exchange" value={stock.exchange}/>
        </View>
      </View>
    </View>
  );
};
