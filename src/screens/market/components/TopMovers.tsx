import {View, Text, Pressable} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';
import {IconFlame} from '@tabler/icons-react-native';

import {formatCurrency} from '@/core/utils';
import {TrendPill} from '@/components';
import {DynamicRoutes} from '@/core/constants';
import type {StockProps} from '@/core/interfaces';

import {Sparkline} from './Sparkline';
import {MOVER_TABS, type MoverTab} from '../constants';

interface TopMoversProps {
  activeTab: MoverTab;
  onSelectTab: (tab: MoverTab) => void;
  movers: StockProps[];
}

export const TopMovers = ({activeTab, onSelectTab, movers}: TopMoversProps) => (
  <View className="mt-8 gap-4">
    <View className="flex-row items-center justify-between px-5">
      <View className="flex-row items-center gap-2">
        <IconFlame size={18} color="#fbbf24"/>
        <Text className="text-white text-lg font-medium">Top Movers</Text>
      </View>

      <Pressable>
        <Text className="text-neutral-500 text-sm">Show All</Text>
      </Pressable>
    </View>

    {/* Tabs */}
    <View className="flex-row gap-2">
      {MOVER_TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            className={`px-4 py-2 rounded-full border ${isActive ? 'bg-white border-white' : 'bg-surface-light border-neutral-800'}`}
          >
            <Text
              className={`text-sm font-medium ${isActive ? 'text-black' : 'text-neutral-300'}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>

    <View className="gap-3">
      {movers.map((stock) => {
        return (
          <Pressable
            key={stock.symbol}
            onPress={() => router.push(DynamicRoutes.stock(stock.symbol))}
            className="flex-row items-center px-4 py-4 bg-surface-light rounded-2xl"
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

            <View className="mx-4">
              <Sparkline
                seed={`mover-${stock.symbol}`}
                changePercent={stock.changePercent}
                width={64}
                height={30}
                points={16}
              />
            </View>

            <View className="items-end">
              <Text className="text-white font-medium">
                ${formatCurrency(stock.price)}
              </Text>

              <TrendPill
                value={stock.changePercent}
                iconSize={14}
                textClassName="text-xs font-medium"
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  </View>
);
