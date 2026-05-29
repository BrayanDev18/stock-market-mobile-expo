import {View, Text, Pressable} from 'react-native';

interface ChipProps {
  /** Visible chip label. */
  label: string;
}

interface ChipRowProps {
  chips: ChipProps[];
  /** Called with the index of the pressed chip. */
  onPress: (index: number) => void;
}

/** Row of pill chips for quick-amount (deposit) / percent (withdraw) shortcuts. */
export const ChipRow = ({chips, onPress}: ChipRowProps) => (
  <View className="flex-row gap-2 px-5 mt-6">
    {chips.map((chip, index) => (
      <Pressable
        key={chip.label}
        onPress={() => onPress(index)}
        className="flex-1 items-center bg-surface-light border border-neutral-800 rounded-full py-2.5"
      >
        <Text className="text-neutral-200 text-sm font-medium">{chip.label}</Text>
      </Pressable>
    ))}
  </View>
);