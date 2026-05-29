import {View, Text} from 'react-native';

import {portfolio} from '@/core/data';
import {formatCurrency} from '@/core/utils';

/** Available balance display backed by the mock portfolio total value. */
export const BalanceCard = () => (
  <View className="gap-4 items-center">
    <View className="flex-row items-center gap-2">
      <Text className="text-neutral-100 font-light text-xl">
        Available balance
      </Text>
    </View>

    <Text className="text-white text-4xl font-semibold">
      ${formatCurrency(portfolio.totalValue)}
    </Text>
  </View>
);