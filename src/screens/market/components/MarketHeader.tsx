import {View, Text, Pressable} from 'react-native';
import {router} from 'expo-router';
import {IconSearch} from '@tabler/icons-react-native';

import {ScreenRoutes} from '@/core/constants';

export const MarketHeader = () => (
  <View className="flex-row items-center justify-between pt-2 pb-6">
    <View>
      <Text className="text-neutral-300">Explore</Text>
      <Text className="text-white text-2xl font-bold">Market</Text>
    </View>

    <Pressable
      onPress={() => router.push(ScreenRoutes.search)}
      className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
      <IconSearch size={20} color="white"/>
    </Pressable>
  </View>
);
