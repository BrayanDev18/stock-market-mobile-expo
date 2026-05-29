import {View, Text, Pressable} from 'react-native';
import {IconFlame} from '@tabler/icons-react-native';

import {mostActive} from '@/core/data';
import {TrendingRow} from './TrendingRow';

export const TrendingList = () => {
  return (
    <View className="mt-8 gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <IconFlame size={18} color="#fbbf24" />
          <Text className="text-white text-lg font-medium">Trending</Text>
        </View>

        <Pressable>
          <Text className="text-neutral-500 text-sm">Show All</Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {mostActive.map((stock, idx) => (
          <TrendingRow key={stock.symbol} stock={stock} rank={idx + 1} />
        ))}
      </View>
    </View>
  );
};
