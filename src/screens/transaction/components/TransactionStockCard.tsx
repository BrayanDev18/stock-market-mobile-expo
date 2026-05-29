import {View, Text} from 'react-native';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';

import {formatCurrency} from '@/core/utils';
import type {StockProps} from '@/core/interfaces';

interface TransactionStockCardProps {
  stock: StockProps;
}

export const TransactionStockCard = ({stock}: TransactionStockCardProps) => (
  <View className="mx-5 mt-8">
    <LinearGradient
      colors={['#161616', '#0f0f0f']}
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
      <Image
        source={{uri: stock.logo}}
        style={{width: 48, height: 48, borderRadius: 12}}
      />

      <View className="ml-3 flex-1">
        <Text className="text-white text-base font-semibold">{stock.symbol}</Text>
        <Text className="text-neutral-500 text-xs" numberOfLines={1}>
          {stock.name}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-neutral-400 text-xs">Current Price</Text>
        <Text className="text-white text-base font-semibold">
          ${formatCurrency(stock.price)}
        </Text>
      </View>
    </LinearGradient>
  </View>
);