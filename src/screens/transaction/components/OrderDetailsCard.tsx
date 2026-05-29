import {View, Text} from 'react-native';

import {formatCurrency} from '@/core/utils';
import {DetailRow} from './DetailRow';

interface OrderDetailsCardProps {
  isBuy: boolean;
  shares: number;
  price: number;
  total: number;
  fee: number;
  net: number;
}

export const OrderDetailsCard = ({isBuy, shares, price, total, fee, net}: OrderDetailsCardProps) => (
  <View className="mt-6 px-5 gap-4">
    <Text className="text-white text-lg font-medium">Order Details</Text>

    <View className="bg-surface-light rounded-2xl p-4 gap-3">
      <DetailRow
        label="Order type"
        value={isBuy ? 'Buy · Market' : 'Sell · Market'}
        valueClassName={isBuy ? 'text-green-400' : 'text-red-400'}
      />

      <View className="h-px bg-neutral-800"/>

      <DetailRow label="Shares" value={`${shares}`}/>

      <View className="h-px bg-neutral-800"/>

      <DetailRow
        label="Price per share"
        value={`$${formatCurrency(price)}`}
      />

      <View className="h-px bg-neutral-800"/>

      <DetailRow
        label="Subtotal"
        value={`$${formatCurrency(total)}`}
      />

      <View className="h-px bg-neutral-800"/>

      <DetailRow
        label="Commission fee"
        value={`$${formatCurrency(fee)}`}
      />

      <View className="h-px bg-neutral-800"/>

      <View className="flex-row items-center justify-between">
        <Text className="text-white text-base font-semibold">
          {isBuy ? 'Total paid' : 'Total received'}
        </Text>
        <Text className="text-white text-base font-semibold">
          ${formatCurrency(net)}
        </Text>
      </View>
    </View>
  </View>
);
