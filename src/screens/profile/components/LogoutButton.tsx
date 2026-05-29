import {View, Text, Pressable} from 'react-native';
import {IconLogout} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

/** Tinted "Log Out" action button. */
export const LogoutButton = () => (
  <View className="mt-8 px-4">
    <Pressable className="flex-row items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl py-4">
      <IconLogout size={18} color={Colors.down}/>
      <Text className="text-red-400 text-base font-semibold">Log Out</Text>
    </Pressable>
  </View>
);
