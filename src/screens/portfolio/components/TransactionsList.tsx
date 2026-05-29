import {View, Text, Pressable} from 'react-native';

import {portfolio, stocks} from '@/core/data';

import {TransactionRow} from './TransactionRow';

const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

/** Recent Transactions section: header + the list of transaction rows. */
export const TransactionsList = () => {
  const recentTransactions = portfolio.transactions.slice(-5).reverse();

  return (
    <View className="mt-8 gap-4 mb-32">
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-medium">
          Recent Transactions
        </Text>

        <Pressable>
          <Text className="text-neutral-500 text-sm">Show All</Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {recentTransactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} stock={stockMap.get(tx.symbol)} />
        ))}
      </View>
    </View>
  );
};
