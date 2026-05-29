import {View, Text, Pressable} from 'react-native';
import {IconDownload, IconHelpCircle} from '@tabler/icons-react-native';

export const TransactionActions = () => (
  <View className="mt-6 px-5 flex-row gap-3 mb-10">
    <Pressable className="flex-1 bg-surface-light border border-neutral-800 rounded-2xl py-4 items-center gap-2">
      <IconDownload size={20} color="white"/>
      <Text className="text-neutral-200 text-xs font-medium">Download Receipt</Text>
    </Pressable>

    <Pressable className="flex-1 bg-surface-light border border-neutral-800 rounded-2xl py-4 items-center gap-2">
      <IconHelpCircle size={20} color="white"/>
      <Text className="text-neutral-200 text-xs font-medium">Get Help</Text>
    </Pressable>
  </View>
);
