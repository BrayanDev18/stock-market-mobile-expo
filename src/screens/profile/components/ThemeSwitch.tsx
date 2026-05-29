import {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {IconSun, IconMoon, IconDeviceDesktop} from '@tabler/icons-react-native';

import {Gradients} from '@/core/constants';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOptionProps {
  id: ThemeMode;
  label: string;
  Icon: typeof IconSun;
}

const THEME_OPTIONS: ThemeOptionProps[] = [
  {id: 'light', label: 'Light', Icon: IconSun},
  {id: 'dark', label: 'Dark', Icon: IconMoon},
  {id: 'system', label: 'System', Icon: IconDeviceDesktop},
];

/** Appearance segmented control (light / dark / system) with active gradient pill. */
export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  return (
    <View className="mt-6 gap-3">
      <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider px-5">
        Appearance
      </Text>

      <View className="bg-surface-light rounded-2xl mx-4 p-1.5 flex-row">
        {THEME_OPTIONS.map(({id, label, Icon}) => {
          const isActive = theme === id;

          return (
            <Pressable
              key={id}
              onPress={() => setTheme(id)}
              className="flex-1"
            >
              {isActive ? (
                <LinearGradient
                  colors={Gradients.accent}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    paddingVertical: 12,
                    borderRadius: 14,
                  }}
                >
                  <Icon size={16} color="black"/>
                  <Text className="text-black text-sm font-semibold">{label}</Text>
                </LinearGradient>
              ) : (
                <View className="flex-row items-center justify-center gap-1.5 py-3">
                  <Icon size={16} color="#a3a3a3"/>
                  <Text className="text-neutral-400 text-sm font-medium">{label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};