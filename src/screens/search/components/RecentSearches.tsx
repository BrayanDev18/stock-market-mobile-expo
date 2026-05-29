import {View, Text, Pressable} from 'react-native';
import {IconX, IconClockHour3} from '@tabler/icons-react-native';

interface RecentSearchesProps {
  recent: string[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
  onClearAll: () => void;
}

export const RecentSearches = ({
  recent,
  onSelect,
  onRemove,
  onClearAll,
}: RecentSearchesProps) => {
  if (recent.length === 0) return null;

  return (
    <View className="mt-8 gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <IconClockHour3 size={18} color="#a3a3a3" />
          <Text className="text-white text-lg font-medium">Recent</Text>
        </View>

        <Pressable onPress={onClearAll}>
          <Text className="text-neutral-500 text-sm">Clear All</Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {recent.map((symbol) => (
          <Pressable
            key={symbol}
            onPress={() => onSelect(symbol)}
            className="flex-row items-center gap-2 bg-surface-light border border-neutral-800 rounded-full pl-4 pr-2 py-2"
          >
            <Text className="text-neutral-200 text-sm font-medium">
              {symbol}
            </Text>

            <Pressable
              onPress={() => onRemove(symbol)}
              className="w-5 h-5 rounded-full bg-neutral-800 items-center justify-center"
            >
              <IconX size={12} color="#a3a3a3" />
            </Pressable>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
