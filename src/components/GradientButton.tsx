import type {ReactNode} from 'react';
import {Text, Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {Gradients} from '@/core/constants';

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** Optional leading icon (render it black to match the label). */
  icon?: ReactNode;
  /** Pill height in px (default 60; the camera CTA uses 56). */
  height?: number;
  /** Extra classes for the outer Pressable (e.g. `w-full` inside a centered column). */
  className?: string;
}

/**
 * The pill-shaped accent CTA used across the action flows. When `disabled`,
 * it renders the muted gradient and dimmed label.
 */
export const GradientButton = ({
  label,
  onPress,
  disabled = false,
  icon,
  height = 60,
  className,
}: GradientButtonProps) => {
  const active = !disabled;

  return (
    <Pressable onPress={onPress} disabled={disabled} className={className}>
      <LinearGradient
        colors={active ? Gradients.accent : Gradients.disabled}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          height,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        }}
      >
        {icon}
        <Text
          className={`text-base font-bold ${active ? 'text-black' : 'text-neutral-500'}`}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};