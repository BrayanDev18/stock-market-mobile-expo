import {View, TextInput} from 'react-native';
import {IconMessageCircle} from '@tabler/icons-react-native';

interface NoteInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

/** Optional "Add a note" field on the transfer screen. */
export const NoteInput = ({value, onChangeText}: NoteInputProps) => (
  <View className="mt-6">
    <View className="flex-row items-center bg-surface-light border border-neutral-800 rounded-2xl px-4 h-14 gap-3">
      <IconMessageCircle size={18} color="#a3a3a3" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Add a note (optional)"
        placeholderTextColor="#525252"
        className="flex-1 text-white text-base"
      />
    </View>
  </View>
);
