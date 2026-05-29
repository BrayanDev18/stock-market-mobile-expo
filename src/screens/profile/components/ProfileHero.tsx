import {View, Text, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Image} from 'expo-image';
import {IconBadgeFilled, IconCrown, IconCircleCheckFilled, IconEdit} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

/** Gradient avatar card: profile photo, name/email, Pro badge, and a stats row. */
export const ProfileHero = () => (
  <View className="mx-4">
    <LinearGradient
      colors={['#1a1a1a', '#0f0f0f']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#262626',
      }}
    >
      <View className="flex-row items-center">
        <View className="relative">
          <Image
            source={{uri: 'https://editorial.uefa.com/resources/027b-16a6f83fcf8f-179708787343-1000/cristiano_ronaldo_of_portugal_celebrates_after_scoring_a.jpeg'}}
            style={{width: 64, height: 64, borderRadius: 20}}
          />
          <View className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
            <IconCircleCheckFilled size={18} color={Colors.accentLight}/>
          </View>
        </View>

        <View className="ml-4 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-white text-lg font-bold">Cristiano Ronaldo</Text>
            <IconBadgeFilled size={14} color="#3b82f6"/>
          </View>
          <Text className="text-neutral-400 text-xs">cristiano@quantix.app</Text>

          <View className="flex-row items-center gap-1.5 mt-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2.5 py-1 self-start">
            <IconCrown size={12} color="#fbbf24"/>
            <Text className="text-yellow-400 text-[10px] font-semibold">Pro Member</Text>
          </View>
        </View>

        <Pressable className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center">
          <IconEdit size={16} color="white"/>
        </Pressable>
      </View>

      {/* Stats row */}
      <View className="flex-row mt-5 pt-4 border-t border-neutral-800">
        <View className="flex-1 items-center gap-0.5">
          <Text className="text-neutral-500 text-[10px] uppercase tracking-wider">Portfolio</Text>
          <Text className="text-white text-sm font-semibold">$89.4K</Text>
        </View>
        <View className="w-px bg-neutral-800"/>
        <View className="flex-1 items-center gap-0.5">
          <Text className="text-neutral-500 text-[10px] uppercase tracking-wider">Member</Text>
          <Text className="text-white text-sm font-semibold">2 yrs</Text>
        </View>
        <View className="w-px bg-neutral-800"/>
        <View className="flex-1 items-center gap-0.5">
          <Text className="text-neutral-500 text-[10px] uppercase tracking-wider">Trades</Text>
          <Text className="text-white text-sm font-semibold">148</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);
