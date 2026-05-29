import {View, Text} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import {
  IconSearch,
  IconTrendingUp3,
  IconTrendingDown3,
  IconFlame,
} from '@tabler/icons-react-native';

import {Colors, trendAlpha} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

import {
  SCREEN_WIDTH,
  CARD_WIDTH,
  AVATAR_PALETTE,
  previewMovers,
  spIndex,
  nasdaqIndex,
  techSector,
  topMover,
  previewStyles,
} from '../constants';

const BARS = [12, 18, 10, 22, 15, 25, 19, 28, 21, 30, 23, 27];

export const MoversPreview = () => {
  return (
    <View className="items-center justify-center" style={{width: SCREEN_WIDTH}}>
      <View className="items-center">
        <LinearGradient
          colors={['#1a1a1a', '#0f0f0f']}
          className="rounded-[28px] border border-neutral-800 overflow-hidden"
          style={{width: CARD_WIDTH, ...previewStyles.phoneCard}}
        >
          {/* Mock status bar */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <Text className="text-white text-xs font-semibold">9:41</Text>
            <View className="flex-row gap-1">
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
              <View className="w-1 h-1 rounded-full bg-white"/>
            </View>
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2">
            <View>
              <Text className="text-neutral-500 text-[10px]">Explore</Text>
              <Text className="text-white text-base font-bold">Market</Text>
            </View>

            <View className="w-7 h-7 rounded-xl bg-neutral-800 items-center justify-center">
              <IconSearch size={13} color="white"/>
            </View>
          </View>

          {/* Index strip */}
          <View className="flex-row gap-2 px-5 mt-3">
            <View className="bg-neutral-900 rounded-xl px-2.5 py-2 flex-1">
              <Text className="text-neutral-500 text-[10px]">{spIndex.name}</Text>
              <Text className="text-white text-[11px] font-bold">{formatCurrency(spIndex.value)}</Text>
              <Text className="text-green-400 text-[10px] font-semibold">+{spIndex.changePercent.toFixed(2)}%</Text>
            </View>

            <View className="bg-neutral-900 rounded-xl px-2.5 py-2 flex-1">
              <Text className="text-neutral-500 text-[10px]">{nasdaqIndex.name}</Text>
              <Text className="text-white text-[11px] font-bold">{formatCurrency(nasdaqIndex.value)}</Text>
              <Text className="text-green-400 text-[10px] font-semibold">+{nasdaqIndex.changePercent.toFixed(2)}%</Text>
            </View>
          </View>

          {/* Volume bars */}
          <View className="px-5 mt-3">
            <View className="flex-row items-center gap-1 mb-1">
              <IconFlame size={10} color="#fbbf24"/>
              <Text className="text-white text-[10px] font-semibold">Top Movers</Text>
            </View>

            <Svg width={CARD_WIDTH - 40} height={26}>
              {BARS.map((h, i) => (
                <Rect
                  key={i}
                  x={i * 18}
                  y={28 - h}
                  width={10}
                  height={h}
                  rx={2}
                  fill={i === 7 ? Colors.up : trendAlpha.up(0.25)}
                />
              ))}
            </Svg>
          </View>

          {/* Movers rows */}
          <View className="px-4 mt-2 gap-1.5 mb-5">
            {previewMovers.map((m, i) => {
              const up = m.changePercent >= 0;

              return (
                <View
                  key={m.symbol}
                  className="flex-row items-center bg-neutral-900 rounded-xl px-2.5 py-2"
                >
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{backgroundColor: AVATAR_PALETTE[i] + '33'}}
                  >
                    <Text className="text-white text-[10px] font-bold">
                      {m.symbol.slice(0, 2)}
                    </Text>
                  </View>

                  <View className="ml-2 flex-1">
                    <Text className="text-white text-[10px] font-semibold">{m.symbol}</Text>
                    <Text className="text-neutral-500 text-[10px]" numberOfLines={1}>{m.name}</Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-white text-[10px] font-semibold">${formatCurrency(m.price)}</Text>
                    <View className="flex-row items-center gap-0.5">
                      {up
                        ? <IconTrendingUp3 size={8} color={Colors.up}/>
                        : <IconTrendingDown3 size={8} color={Colors.down}/>
                      }
                      <Text
                        className={`text-[10px] font-semibold ${up ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {up ? '+' : ''}{m.changePercent.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </LinearGradient>

        {/* Floating fire trending badge */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{top: 110, right: -10, ...previewStyles.floatingCard}}
        >
          <View className="flex-row items-center gap-1.5">
            <View className="w-6 h-6 rounded-full bg-yellow-500/20 items-center justify-center">
              <IconFlame size={12} color="#fbbf24"/>
            </View>
            <View>
              <Text className="text-white text-[10px] font-bold">Trending</Text>
              <Text className="text-yellow-400 text-[9px]">{topMover.symbol} +{topMover.changePercent.toFixed(2)}%</Text>
            </View>
          </View>
        </View>

        {/* Floating sector badge */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{bottom: 80, left: -14, ...previewStyles.floatingCard}}
        >
          <Text className="text-neutral-400 text-[9px]">Tech Sector</Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <IconTrendingUp3 size={10} color={Colors.up}/>
            <Text className="text-green-400 text-[11px] font-bold">+{techSector.change.toFixed(2)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
