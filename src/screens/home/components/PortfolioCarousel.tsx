import {View, Text, ScrollView, Pressable} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';

import {TrendPill} from '@/components';
import {portfolio, stocks} from '@/core/data';
import {DynamicRoutes} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

/** Horizontal carousel of portfolio holdings cards. */
export const PortfolioCarousel = () => (
  <View className="mt-8 gap-4">
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-medium">My Portfolio</Text>

      <Pressable>
        <Text className="text-neutral-500 text-sm">Show All</Text>
      </Pressable>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
      {portfolio.holdings.map((holding) => {
        const stock = stocks.find((s) => s.symbol === holding.symbol);
        if (!stock) return null;

        const gainPercent = ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;

        return (
          <Pressable
            key={holding.symbol}
            onPress={() => router.push(DynamicRoutes.stock(holding.symbol))}
            className="bg-surface-light rounded-2xl p-4 gap-5"
            style={{width: 180}}
          >
            <View className="flex-row gap-3 items-center">
              <Image
                source={{uri: stock.logo}}
                style={{width: 36, height: 36, aspectRatio: 1, borderRadius: 5}}
              />

              <View className="flex-1">
                <Text className="text-neutral-200  font-medium">
                  {stock.symbol}
                </Text>

                <Text className="text-neutral-400 text-xs" numberOfLines={1}>
                  {stock.name}
                </Text>
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-white text-xl font-semibold">
                ${formatCurrency(stock.price)}
              </Text>

              <TrendPill value={gainPercent}/>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  </View>
);