import {View, TextInput, Pressable} from 'react-native';
import {IconSearch, IconX} from '@tabler/icons-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isSearching: boolean;
}

export const SearchBar = ({
  value,
  onChangeText,
  onClear,
  isSearching,
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-surface-light border border-neutral-800 rounded-2xl px-4 h-14 gap-3">
      <IconSearch size={20} color="#a3a3a3" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search stocks, ETFs, sectors…"
        placeholderTextColor="#737373"
        className="flex-1 text-white text-base"
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
      />

      {isSearching && (
        <Pressable
          onPress={onClear}
          className="w-6 h-6 rounded-full bg-neutral-800 items-center justify-center"
        >
          <IconX size={14} color="white" />
        </Pressable>
      )}
    </View>
  );
};
