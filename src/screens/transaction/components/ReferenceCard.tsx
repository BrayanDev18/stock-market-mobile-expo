import {View, Text} from 'react-native';

import {DetailRow} from './DetailRow';

interface ReferenceCardProps {
  id: string;
  symbol: string;
  exchange: string;
  settlementString: string;
}

export const ReferenceCard = ({id, symbol, exchange, settlementString}: ReferenceCardProps) => (
  <View className="mt-6 px-5 gap-4">
    <Text className="text-white text-lg font-medium">Reference</Text>

    <View className="bg-surface-light rounded-2xl p-4 gap-3">
      <DetailRow
        label="Order ID"
        value={`#${id.toUpperCase()}-${symbol}`}
        copyable
      />

      <View className="h-px bg-neutral-800"/>

      <DetailRow label="Exchange" value={exchange}/>

      <View className="h-px bg-neutral-800"/>

      <DetailRow label="Settlement" value={settlementString}/>
    </View>
  </View>
);
