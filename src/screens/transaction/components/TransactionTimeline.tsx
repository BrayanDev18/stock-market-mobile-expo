import {View, Text} from 'react-native';
import {IconCheck} from '@tabler/icons-react-native';

interface TransactionTimelineProps {
  date: string;
  settlementString: string;
}

export const TransactionTimeline = ({date, settlementString}: TransactionTimelineProps) => (
  <View className="mt-6 px-5 gap-4">
    <Text className="text-white text-lg font-medium">Timeline</Text>

    <View className="bg-surface-light rounded-2xl p-4 gap-4">
      <View className="flex-row items-start gap-3">
        <View className="items-center">
          <View className="w-7 h-7 rounded-full bg-green-400 items-center justify-center">
            <IconCheck size={14} color="black"/>
          </View>
          <View className="w-px flex-1 bg-neutral-800 mt-1" style={{minHeight: 24}}/>
        </View>

        <View className="flex-1 pb-4">
          <Text className="text-white text-sm font-medium">Order placed</Text>
          <Text className="text-neutral-500 text-xs">{date} · 09:31 AM</Text>
        </View>
      </View>

      <View className="flex-row items-start gap-3">
        <View className="items-center">
          <View className="w-7 h-7 rounded-full bg-green-400 items-center justify-center">
            <IconCheck size={14} color="black"/>
          </View>
          <View className="w-px flex-1 bg-neutral-800 mt-1" style={{minHeight: 24}}/>
        </View>

        <View className="flex-1 pb-4">
          <Text className="text-white text-sm font-medium">Order executed</Text>
          <Text className="text-neutral-500 text-xs">{date} · 09:31 AM</Text>
        </View>
      </View>

      <View className="flex-row items-start gap-3">
        <View className="items-center">
          <View className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-neutral-500"/>
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-neutral-300 text-sm font-medium">Settlement</Text>
          <Text className="text-neutral-500 text-xs">{settlementString}</Text>
        </View>
      </View>
    </View>
  </View>
);