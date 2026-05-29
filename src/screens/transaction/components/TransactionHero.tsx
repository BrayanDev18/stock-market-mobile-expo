import {View, Text} from 'react-native';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCircleCheckFilled,
} from '@tabler/icons-react-native';

import {formatCurrency} from '@/core/utils';
import {Colors} from '@/core/constants';

interface TransactionHeroProps {
  isBuy: boolean;
  shares: number;
  net: number;
  accentColor: string;
}

export const TransactionHero = ({isBuy, shares, net, accentColor}: TransactionHeroProps) => (
  <View className="items-center px-5 mt-4 gap-3">
    <View
      className="w-20 h-20 rounded-full items-center justify-center"
      style={{backgroundColor: accentColor + '1A'}}
    >
      <View
        className="w-16 h-16 rounded-full items-center justify-center"
        style={{backgroundColor: accentColor + '26'}}
      >
        {isBuy
          ? <IconArrowDownRight size={30} color={accentColor}/>
          : <IconArrowUpRight size={30} color={accentColor}/>
        }
      </View>
    </View>

    <Text className="text-neutral-400 text-sm">
      {isBuy ? 'Bought' : 'Sold'} {shares} shares
    </Text>

    <Text
      className="text-white text-5xl font-semibold tracking-tight"
      style={{color: isBuy ? 'white' : 'white'}}
    >
      {isBuy ? '-' : '+'}${formatCurrency(net)}
    </Text>

    {/* Status pill */}
    <View className="flex-row items-center gap-1.5 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1.5 mt-1">
      <IconCircleCheckFilled size={14} color={Colors.up}/>
      <Text className="text-green-400 text-xs font-semibold">Completed</Text>
    </View>
  </View>
);
