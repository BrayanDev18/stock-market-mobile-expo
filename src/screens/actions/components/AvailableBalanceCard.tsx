import {View, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {IconCashBanknote} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

interface AvailableBalanceCardProps {
  amount: number;
}

/** Gradient card showing the available-to-withdraw balance. */
export const AvailableBalanceCard = ({amount}: AvailableBalanceCardProps) => (
  <View className="mx-5 mt-2">
    <LinearGradient
      colors={['#111111', '#0a0a0a']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#262626',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View className="w-11 h-11 rounded-full bg-green-400/20 items-center justify-center">
        <IconCashBanknote size={20} color={Colors.accentLight} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-neutral-400 text-xs">Available to withdraw</Text>
        <Text className="text-white text-lg font-semibold">
          ${formatCurrency(amount)}
        </Text>
      </View>
    </LinearGradient>
  </View>
);