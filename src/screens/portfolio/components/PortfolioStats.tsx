import {View, Text} from 'react-native';

import {portfolio} from '@/core/data';
import {formatCurrency} from '@/core/utils';

/** Invested + Total P&L summary cards. */
export const PortfolioStats = () => {
  const isTotalPositive = portfolio.totalGainPercent >= 0;

  return (
    <View className="flex-row gap-3 mt-6">
      <View className="flex-1 bg-surface-light rounded-2xl p-4 gap-2">
        <Text className="text-neutral-400 text-xs">Invested</Text>
        <Text className="text-white text-lg font-semibold">
          ${formatCurrency(portfolio.totalCost)}
        </Text>
      </View>

      <View className="flex-1 bg-surface-light rounded-2xl p-4 gap-2">
        <Text className="text-neutral-400 text-xs">Total P&L</Text>
        <View className="flex-row items-center gap-1.5">
          <Text
            className={`text-lg font-semibold ${isTotalPositive ? 'text-green-400' : 'text-red-400'}`}
          >
            {isTotalPositive ? '+' : ''}
            {portfolio.totalGainPercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
};
