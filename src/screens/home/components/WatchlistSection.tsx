import {View, Text, Pressable} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';

import {TrendPill} from '@/components';
import {stocks, watchlists} from '@/core/data';
import {DynamicRoutes} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

import {MiniChart} from './MiniChart';

/** "My Watchlists" list of stock rows with sparklines. */
export const WatchlistSection = () => (
  <View className="mt-8 gap-4 mb-32">
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-medium">My Watchlists</Text>

      <Pressable>
        <Text className="text-neutral-500 text-sm">Show All</Text>
      </Pressable>
    </View>

    <View className="gap-3">
      {watchlists[0].symbols.map((symbol) => {
        const stock = stocks.find((s) => s.symbol === symbol);
        if (!stock) return null;

        const isPositive = stock.changePercent >= 0;

        return (
          <Pressable
            key={symbol}
            onPress={() => router.push(DynamicRoutes.stock(symbol))}
            className='flex-row items-center px-4 py-4 bg-surface-light rounded-2xl'
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
                {stock.name}
              </Text>
            </View>

            <View className="mx-8">
              <MiniChart isPositive={isPositive}/>
            </View>

            <View className="items-end">
              <Text className="text-white font-medium">
                ${formatCurrency(stock.price)}
              </Text>

              <TrendPill
                value={stock.changePercent}
                textClassName="text-xs font-medium"
                gapClassName="gap-2"
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  </View>
);