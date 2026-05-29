import {View, Text, ScrollView, Pressable} from 'react-native';
import {IconTrendingUp3, IconTrendingDown3} from '@tabler/icons-react-native';

import {formatCurrency} from '@/core/utils';
import {Colors} from '@/core/constants';
import type {MarketIndexProps} from '@/core/interfaces';

import {HeroChart} from './HeroChart';
import {TIMEFRAMES, type Timeframe} from '../constants';

interface HeroIndexCardProps {
  indices: MarketIndexProps[];
  heroIndex: MarketIndexProps;
  heroIndexSymbol: string;
  onSelectIndex: (symbol: string) => void;
  timeframe: Timeframe;
  onSelectTimeframe: (timeframe: Timeframe) => void;
}

export const HeroIndexCard = ({
  indices,
  heroIndex,
  heroIndexSymbol,
  onSelectIndex,
  timeframe,
  onSelectTimeframe,
}: HeroIndexCardProps) => {
  const isHeroPositive = heroIndex.changePercent >= 0;

  return (
    <View className="bg-surface-light rounded-3xl p-5 gap-4 border border-neutral-800">
      {/* Index tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {indices.map((idx) => {
          const active = idx.symbol === heroIndexSymbol;
          return (
            <Pressable
              key={idx.symbol}
              onPress={() => onSelectIndex(idx.symbol)}
              className={`px-3 py-1.5 rounded-full border ${active ? 'bg-white border-white' : 'bg-neutral-900 border-neutral-800'}`}
            >
              <Text
                className={`text-xs font-semibold ${active ? 'text-black' : 'text-neutral-300'}`}
              >
                {idx.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Price */}
      <View className="gap-1">
        <Text className="text-neutral-400 text-xs">{heroIndex.symbol}</Text>
        <Text className="text-white text-3xl font-semibold tracking-tight">
          {formatCurrency(heroIndex.value)}
        </Text>

        <View className="flex-row items-center gap-2">
          {isHeroPositive
            ? <IconTrendingUp3 size={14} color={Colors.up}/>
            : <IconTrendingDown3 size={14} color={Colors.down}/>
          }
          <Text
            className={`text-sm font-medium ${isHeroPositive ? 'text-green-400' : 'text-red-400'}`}
          >
            {isHeroPositive ? '+' : ''}{heroIndex.change.toFixed(2)}
            {' '}
            ({isHeroPositive ? '+' : ''}{heroIndex.changePercent.toFixed(2)}%)
          </Text>
          <Text className="text-neutral-500 text-xs">· {timeframe}</Text>
        </View>
      </View>

      {/* Chart */}
      <View className="-ml-2">
        <HeroChart index={heroIndex} timeframe={timeframe}/>
      </View>

      {/* Timeframe tabs */}
      <View className="flex-row gap-2">
        {TIMEFRAMES.map((tf) => {
          const active = tf.id === timeframe;
          return (
            <Pressable
              key={tf.id}
              onPress={() => onSelectTimeframe(tf.id)}
              className={`flex-1 items-center py-2 rounded-full border ${active ? 'bg-white border-white' : 'bg-neutral-900 border-neutral-800'}`}
            >
              <Text
                className={`text-xs font-medium ${active ? 'text-black' : 'text-neutral-300'}`}
              >
                {tf.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
