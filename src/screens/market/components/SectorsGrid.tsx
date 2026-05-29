import {View, Text, Pressable} from 'react-native';
import {IconChartBar} from '@tabler/icons-react-native';

import {TrendPill} from '@/components';
import type {SectorProps} from '@/core/interfaces';

import {SectorBars} from './SectorBars';

interface SectorsGridProps {
  sectors: SectorProps[];
}

export const SectorsGrid = ({sectors}: SectorsGridProps) => (
  <View className="mt-8 gap-4">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <IconChartBar size={18} color="#a3a3a3"/>
        <Text className="text-white text-lg font-medium">Sectors</Text>
      </View>

      <Pressable>
        <Text className="text-neutral-500 text-sm">Show All</Text>
      </Pressable>
    </View>

    <View className="flex-row flex-wrap gap-3">
      {sectors.slice(0, 6).map((sector) => {
        return (
          <Pressable
            key={sector.name}
            className="bg-surface-light rounded-2xl p-4 gap-3"
            style={{width: '47.5%'}}
          >
            <View className="flex-row items-start justify-between">
              <Text className="text-neutral-200 text-sm font-medium flex-1" numberOfLines={1}>
                {sector.name}
              </Text>
            </View>

            {/* Bars */}
            <View className="-ml-1">
              <SectorBars sector={sector}/>
            </View>

            <View className="flex-row items-end justify-between">
              <Text className="text-white text-base font-semibold">
                {sector.marketCap}
              </Text>

              <TrendPill
                value={sector.change}
                iconSize={12}
                textClassName="text-xs font-medium"
                gapClassName="gap-1"
                text={`${sector.change >= 0 ? '+' : ''}${sector.change.toFixed(2)}%`}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  </View>
);
