import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';
import {router} from 'expo-router';

import {DynamicRoutes} from '@/core/constants';
import {formatCurrency} from '@/core/utils';
import {TrendPill} from '@/components';
import type {StockProps} from '@/core/interfaces';

interface StockResultRowProps {
  stock: StockProps;
}

export const StockResultRow = ({stock}: StockResultRowProps) => {
  return (
    <Pressable
      onPress={() => router.push(DynamicRoutes.stock(stock.symbol))}
      className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
    >
      <Image
        source={{uri: stock.logo}}
        style={{width: 36, height: 36, borderRadius: 50}}
      />

      <View className="ml-3 flex-1">
        <Text className="text-neutral-200 text-base font-medium">
          {stock.symbol}
        </Text>

        <Text className="text-neutral-500 text-xs" numberOfLines={1}>
          {stock.name} · {stock.exchange}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-white font-medium">
          ${formatCurrency(stock.price)}
        </Text>

        <TrendPill
          value={stock.changePercent}
          iconSize={14}
          textClassName="text-xs font-medium"
        />
      </View>
    </Pressable>
  );
};
