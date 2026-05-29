import {View, Text, Pressable} from 'react-native';
import {router} from 'expo-router';
import {
  IconArrowsTransferDown, IconCashMinus, IconCashPlus, IconScanTraces,
} from '@tabler/icons-react-native';

import {ScreenRoutes} from '@/core/constants';

/** Row of quick-action buttons (deposit, transfer, withdraw, scan). */
export const QuickActions = () => (
  <View className="flex-row gap-2">
    <Pressable
      onPress={() => router.push(ScreenRoutes.deposit)}
      className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
    >
      <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
        <IconCashPlus size={22} color="white"/>
      </View>

      <Text className="text-neutral-200 text-base">
        Deposit
      </Text>
    </Pressable>

    <Pressable
      onPress={() => router.push(ScreenRoutes.transfer)}
      className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
    >
      <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
        <IconArrowsTransferDown size={22} color="white"/>
      </View>

      <Text className="text-neutral-200 text-base">
        Transfer
      </Text>
    </Pressable>

    <Pressable
      onPress={() => router.push(ScreenRoutes.withdraw)}
      className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
    >
      <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
        <IconCashMinus size={22} color="white"/>
      </View>

      <Text className="text-neutral-200 text-base">
        Withdraw
      </Text>
    </Pressable>

    <Pressable
      onPress={() => router.push(ScreenRoutes.scan)}
      className="flex-1 items-center justify-center rounded-2xl gap-2 py-2"
    >
      <View className="w-16 h-16 rounded-2xl bg-surface-light items-center justify-center">
        <IconScanTraces size={22} color="white"/>
      </View>

      <Text className="text-neutral-200 text-base">
        Scan
      </Text>
    </Pressable>
  </View>
);