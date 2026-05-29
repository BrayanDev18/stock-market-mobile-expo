import type {ReactNode} from 'react';
import {View, Text} from 'react-native';
import {router} from 'expo-router';
import {IconArrowLeft, IconHelpCircle} from '@tabler/icons-react-native';

import {HeaderIconButton} from './HeaderIconButton';

interface ActionHeaderProps {
  /** Centered title text. Ignored when `center` is provided. */
  title?: string;
  /** Custom center node (e.g. logo + symbol on the stock screen). */
  center?: ReactNode;
  /** Custom left node. Defaults to a back button that pops the stack. */
  left?: ReactNode;
  /**
   * Custom right node. Omit for the default help button; pass `null` to hide.
   */
  right?: ReactNode;
  /** Press handler for the default back button. Defaults to `router.back()`. */
  onBack?: () => void;
}

/**
 * Shared screen header: `[ left ]  [ center/title ]  [ right ]`.
 * Defaults give a back button on the left and a help button on the right —
 * the shape used across every action flow.
 */
export const ActionHeader = ({
  title,
  center,
  left,
  right,
  onBack,
}: ActionHeaderProps) => (
  <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
    {left ?? (
      <HeaderIconButton onPress={onBack ?? (() => router.back())}>
        <IconArrowLeft size={20} color="white" />
      </HeaderIconButton>
    )}

    {center ?? (
      <Text className="text-white text-base font-semibold">{title}</Text>
    )}

    {right === undefined ? (
      <HeaderIconButton>
        <IconHelpCircle size={20} color="white" />
      </HeaderIconButton>
    ) : (
      right
    )}
  </View>
);