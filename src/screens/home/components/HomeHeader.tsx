import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';
import {IconBell} from '@tabler/icons-react-native';

/** Home screen header: avatar, greeting and notification bell. */
export const HomeHeader = () => (
  <View className="flex-row items-center justify-between px-5 pt-8 pb-8">
    <View className="flex-row gap-2 items-center">
      <Image
        source={{uri: 'https://editorial.uefa.com/resources/027b-16a6f83fcf8f-179708787343-1000/cristiano_ronaldo_of_portugal_celebrates_after_scoring_a.jpeg'}}
        style={{width: 40, height: 40, borderRadius: 10}}
      />

      <View>
        <Text className="text-white text-base font-bold">Crisitiano Ronaldo</Text>
        <Text className="text-neutral-300">Good morning</Text>
      </View>
    </View>

    <Pressable
      className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
      <IconBell size={20} color="white"/>
    </Pressable>
  </View>
);
