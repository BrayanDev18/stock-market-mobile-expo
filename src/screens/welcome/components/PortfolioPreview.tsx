import {View, Text} from 'react-native';
import Svg, {Polyline} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import {
  IconTrendingUp3,
  IconBell,
  IconWallet,
  IconArrowUpRight,
} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {portfolio} from '@/core/data';
import {formatCurrency} from '@/core/utils';

import {
  SCREEN_WIDTH,
  CARD_WIDTH,
  CHART_VIEW_W,
  CHART_VIEW_H,
  PORTFOLIO_CHART_POINTS,
  AVATAR_PALETTE,
  previewHoldings,
  buildChartPointsString,
  previewStyles,
} from '../constants';

export const PortfolioPreview = () => {
  const chartPoints = buildChartPointsString(PORTFOLIO_CHART_POINTS, CHART_VIEW_W);

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
              <Text className="text-neutral-500 text-[10px]">Overview</Text>
              <Text className="text-white text-base font-bold">Portfolio</Text>
            </View>

            <View className="w-7 h-7 rounded-xl bg-neutral-800 items-center justify-center">
              <IconBell size={13} color="white"/>
            </View>
          </View>

          {/* Total value */}
          <View className="items-center mt-5 gap-1">
            <View className="flex-row items-center gap-1.5">
              <IconWallet size={12} color="#a3a3a3"/>
              <Text className="text-neutral-400 text-[10px]">Total Value</Text>
            </View>
            <Text className="text-white text-2xl font-bold">${formatCurrency(portfolio.totalValue)}</Text>
            <View className="flex-row items-center gap-1">
              <IconTrendingUp3 size={11} color={Colors.up}/>
              <Text className="text-green-400 text-[11px] font-semibold">
                +${formatCurrency(portfolio.dayChange)} ({portfolio.dayChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Chart */}
          <View className="px-3 mt-3">
            <Svg width={CHART_VIEW_W} height={70} viewBox={`0 0 ${CHART_VIEW_W} ${CHART_VIEW_H}`}>
              <Polyline
                points={chartPoints}
                fill="none"
                stroke={Colors.up}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Holdings header */}
          <View className="flex-row items-center justify-between px-5 mt-2">
            <Text className="text-white text-[11px] font-semibold">Holdings</Text>
            <Text className="text-neutral-500 text-[9px]">Show All</Text>
          </View>

          {/* Holdings rows */}
          <View className="px-4 mt-2 gap-1.5 mb-5">
            {previewHoldings.map((h, i) => (
              <View
                key={h.symbol}
                className="flex-row items-center bg-neutral-900 rounded-xl px-2.5 py-2"
              >
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{backgroundColor: AVATAR_PALETTE[i] + '33'}}
                >
                  <Text className="text-white text-[10px] font-bold">
                    {h.symbol.slice(0, 2)}
                  </Text>
                </View>

                <View className="ml-2 flex-1">
                  <Text className="text-white text-[10px] font-semibold">{h.symbol}</Text>
                  <Text className="text-neutral-500 text-[10px]" numberOfLines={1}>{h.name}</Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-[10px] font-semibold">${formatCurrency(h.value)}</Text>
                  <Text
                    className={`text-[10px] font-semibold ${h.gainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {h.gainPercent >= 0 ? '+' : ''}{h.gainPercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Floating P&L tooltip */}
        <View
          className="absolute bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-2"
          style={{top: 120, right: -12, ...previewStyles.floatingCard}}
        >
          <Text className="text-neutral-400 text-[9px]">{"Today's P&L"}</Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <IconTrendingUp3 size={12} color={Colors.up}/>
            <Text className="text-green-400 text-sm font-bold">+${formatCurrency(portfolio.dayChange)}</Text>
          </View>
        </View>

        {/* Floating badge */}
        <View
          className="absolute bg-green-400 rounded-full px-3 py-1.5 flex-row items-center gap-1"
          style={{bottom: 90, left: -8, ...previewStyles.floatingCard}}
        >
          <IconArrowUpRight size={12} color="black"/>
          <Text className="text-black text-[10px] font-bold">Profit</Text>
        </View>
      </View>
    </View>
  );
};
