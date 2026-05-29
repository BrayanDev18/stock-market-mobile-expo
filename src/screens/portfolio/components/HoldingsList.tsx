import {View, Text, Pressable} from 'react-native';

import {portfolio, stocks} from '@/core/data';

import {HoldingRow} from './HoldingRow';

const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

/** Holdings section: header + the list of holding rows. */
export const HoldingsList = () => (
  <View className="mt-8 gap-4">
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-medium">Holdings</Text>

      <Pressable>
        <Text className="text-neutral-500 text-sm">Show All</Text>
      </Pressable>
    </View>

    <View className="gap-3">
      {portfolio.holdings.map((holding) => {
        const stock = stockMap.get(holding.symbol);
        if (!stock) return null;

        return (
          <HoldingRow key={holding.symbol} holding={holding} stock={stock} />
        );
      })}
    </View>
  </View>
);
