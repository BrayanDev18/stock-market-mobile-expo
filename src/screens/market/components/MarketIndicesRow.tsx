import {View, Text, ScrollView, Pressable} from 'react-native';
import {IconTrendingUp3, IconTrendingDown3} from '@tabler/icons-react-native';

import {formatCurrency} from '@/core/utils';
import {Colors} from '@/core/constants';
import type {MarketIndexProps} from '@/core/interfaces';

import {Sparkline} from './Sparkline';

interface MarketIndicesRowProps {
  indices: MarketIndexProps[];
  onSelectIndex: (symbol: string) => void;
}

export const MarketIndicesRow = ({indices, onSelectIndex}: MarketIndicesRowProps) => (
  <View className="mt-8 gap-4">
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-medium">Indices</Text>

      <Pressable>
        <Text className="text-neutral-500 text-sm">Show All</Text>
      </Pressable>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3"
    >
      {indices.map((index) => {
        const isPositive = index.changePercent >= 0;

        return (
          <Pressable
            key={index.symbol}
            onPress={() => onSelectIndex(index.symbol)}
            className="bg-surface-light rounded-2xl p-4 gap-3"
            style={{width: 170}}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-neutral-300 text-xs font-medium">
                {index.name}
              </Text>

              {isPositive
                ? <IconTrendingUp3 color={Colors.up} size={16}/>
                : <IconTrendingDown3 color={Colors.down} size={16}/>
              }
            </View>

            {/* Mini chart */}
            <View className="-ml-1">
              <Sparkline
                seed={`idx-${index.symbol}`}
                changePercent={index.changePercent}
                width={140}
                height={40}
                points={20}
              />
            </View>

            <View className="gap-0.5">
              <Text className="text-white text-base font-semibold">
                {formatCurrency(index.value)}
              </Text>

              <Text
                className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
              >
                {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  </View>
);
