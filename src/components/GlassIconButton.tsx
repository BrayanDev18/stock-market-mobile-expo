import React from 'react';
import { Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/core/constants';

type Props = {
  label: string;
  icon: React.ReactNode;

  onPress?: () => void;

  size?: number;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';

  glowColor?: string;
  glowOpacity?: number;

  className?: string;
};

export const GlassIconButton = ({
                                  label,
                                  icon,
                                  onPress,
                                  size = 64,
                                  intensity = 100,
                                  tint = 'dark',
                                  glowColor = Colors.accentDim,
                                  glowOpacity = 0.12,
                                  className = '',
                                }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center justify-center gap-2 py-2 ${className}`}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={{
          width: size,
          height: size,
          borderRadius: 18,
          overflow: 'hidden',
        }}
        className="items-center justify-center bg-neutral-800/50 border border-white/10"
      >

        {icon}
      </BlurView>

      <Text className="text-neutral-200 text-sm">
        {label}
      </Text>
    </Pressable>
  );
};