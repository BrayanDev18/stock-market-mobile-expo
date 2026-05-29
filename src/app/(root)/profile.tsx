import {View, Text, ScrollView, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconBell} from '@tabler/icons-react-native';

import {
  ProfileHero,
  ThemeSwitch,
  QuickSettingsSection,
  SettingsGroups,
  LogoutButton,
  AppFooter,
} from '@/screens/profile/components';

const ProfileScreen = () => (
  <View className="flex-1 bg-surface">
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <Text className="text-white text-2xl font-bold">Settings</Text>

          <Pressable className="w-11 h-11 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800">
            <IconBell size={18} color="white"/>
          </Pressable>
        </View>

        <ProfileHero/>
        <ThemeSwitch/>
        <QuickSettingsSection/>
        <SettingsGroups/>
        <LogoutButton/>
        <AppFooter/>
      </ScrollView>
    </SafeAreaView>
  </View>
);

export default ProfileScreen;
