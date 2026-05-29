import {View, Text, Pressable} from 'react-native';
import {IconTrendingUp3, IconChevronRight} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

interface WelcomeHeaderProps {
  onSkip: () => void;
}

export const WelcomeHeader = ({onSkip}: WelcomeHeaderProps) => (
  <View className="flex-row items-center justify-between px-6">
    <View className="flex-row items-center gap-2">
      <View className="w-9 h-9 rounded-xl bg-green-400/20 items-center justify-center border border-green-400/30">
        <IconTrendingUp3 size={20} color={Colors.up}/>
      </View>
      <Text className="text-white text-2xl font-bold tracking-tight">
        Quanti<Text className="text-green-400">X</Text>
      </Text>
    </View>

    <Pressable
      onPress={onSkip}
      className="flex-row items-center gap-1 bg-neutral-900/70 border border-neutral-800 rounded-full px-4 py-2"
    >
      <Text className="text-white text-sm font-medium">Skip</Text>
      <IconChevronRight size={14} color="white"/>
    </Pressable>
  </View>
);
