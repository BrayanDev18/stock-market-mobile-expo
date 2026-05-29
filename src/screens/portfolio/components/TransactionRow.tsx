import {View, Text, Pressable} from 'react-native';
import {router} from 'expo-router';
import {
  IconArrowDownRight,
  IconArrowUpRight,
} from '@tabler/icons-react-native';

import {formatCurrency} from '@/core/utils';
import {Colors, DynamicRoutes} from '@/core/constants';
import type {StockProps, TransactionProps} from '@/core/interfaces';

interface TransactionRowProps {
  tx: TransactionProps;
  stock?: StockProps;
}

/** Single row in the Recent Transactions list. */
export const TransactionRow = ({tx, stock}: TransactionRowProps) => {
  const isBuy = tx.type === 'buy';

  return (
    <Pressable
      onPress={() => router.push(DynamicRoutes.transaction(tx.id))}
      className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${isBuy ? 'bg-green-400/10' : 'bg-red-400/10'}`}
      >
        {isBuy ? (
          <IconArrowDownRight size={18} color={Colors.up} />
        ) : (
          <IconArrowUpRight size={18} color={Colors.down} />
        )}
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-neutral-200 text-base font-medium">
          {isBuy ? 'Buy' : 'Sell'} {tx.symbol}
        </Text>

        <Text className="text-neutral-500 text-xs" numberOfLines={1}>
          {stock?.name ?? tx.symbol} · {tx.date}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-white font-medium">
          ${formatCurrency(tx.shares * tx.price)}
        </Text>

        <Text className="text-neutral-500 text-xs">
          {tx.shares} @ ${formatCurrency(tx.price)}
        </Text>
      </View>
    </Pressable>
  );
};