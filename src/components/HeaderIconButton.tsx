import type {ReactNode} from 'react';
import {Pressable} from 'react-native';

interface HeaderIconButtonProps {
  children: ReactNode;
  onPress?: () => void;
  /** Extra classes appended to the base glass button (e.g. `active:opacity-70`). */
  className?: string;
}

/**
 * The square "glass" icon button used in screen headers (back, help, share…).
 * Base style: `w-12 h-12 rounded-2xl bg-neutral-900/70 border border-neutral-800`.
 */
export const HeaderIconButton = ({
  children,
  onPress,
  className = '',
}: HeaderIconButtonProps) => (
  <Pressable
    onPress={onPress}
    className={`w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800 ${className}`}
  >
    {children}
  </Pressable>
);