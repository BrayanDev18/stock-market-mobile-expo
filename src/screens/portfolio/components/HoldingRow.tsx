import {View, Text, Pressable} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';

import {TrendPill} from '@/components';
import {formatCurrency} from '@/core/utils';
import {DynamicRoutes} from '@/core/constants';
import type {PortfolioHoldingProps, StockProps} from '@/core/interfaces';

interface HoldingRowProps {
  holding: PortfolioHoldingProps;
  stock: StockProps;
}

/** Single holding row in the Holdings list. */
export const HoldingRow = ({holding, stock}: HoldingRowProps) => {
  const totalCost = holding.shares * holding.avgCost;
  const totalCurrent = holding.shares * holding.currentPrice;
  const pnl = totalCurrent - totalCost;
  const pnlPercent = (pnl / totalCost) * 100;
  const isPositive = pnl >= 0;

  return (
    <Pressable
      onPress={() => router.push(DynamicRoutes.stock(holding.symbol))}
      className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
    >
      <Image
        source={{uri: stock.logo}}
        style={{width: 36, height: 36, borderRadius: 50}}
      />

      <View className="ml-3 flex-1">
        <Text className="text-neutral-200 text-base font-medium">
          {holding.symbol}
        </Text>

        <Text className="text-neutral-500 text-xs" numberOfLines={1}>
          {holding.shares} shares · ${formatCurrency(holding.avgCost)}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-white font-medium">
          ${formatCurrency(totalCurrent)}
        </Text>

        <TrendPill
          value={pnlPercent}
          iconSize={14}
          textClassName="text-xs font-medium"
          text={`${isPositive ? '+' : ''}${pnlPercent.toFixed(2)}%`}
        />
      </View>
    </Pressable>
  );
};
