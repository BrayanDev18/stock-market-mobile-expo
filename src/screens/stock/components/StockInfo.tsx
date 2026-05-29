import {View, Text} from 'react-native';
import {Image} from 'expo-image';

import {TrendPill} from '@/components';
import {formatCurrency} from '@/core/utils';
import type {StockProps} from '@/core/interfaces';

interface StockInfoProps {
  stock: StockProps;
}

export const StockInfo = ({stock}: StockInfoProps) => {
  const isPositive = stock.changePercent >= 0;

  return (
    <View className="px-5 gap-2">
      <View className="flex-row items-center gap-3">
        <Image
          source={{uri: stock.logo}}
          style={{width: 40, height: 40, borderRadius: 10}}
        />

        <View className="flex-1">
          <Text className="text-neutral-200 text-base font-medium" numberOfLines={1}>
            {stock.name}
          </Text>
          <Text className="text-neutral-500 text-xs">
            {stock.exchange} · {stock.sector}
          </Text>
        </View>
      </View>

      <Text className="text-white text-4xl font-semibold mt-3">
        ${formatCurrency(stock.price)}
      </Text>

      <View className="flex-row items-center gap-2">
        <TrendPill
          value={stock.changePercent}
          iconSize={18}
          textClassName="text-base font-medium"
          gapClassName="gap-2"
          text={`${isPositive ? '+' : ''}$${formatCurrency(Math.abs(stock.change))} (${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}%)`}
        />
        <Text className="text-neutral-500 text-sm">Today</Text>
      </View>
    </View>
  );
};
