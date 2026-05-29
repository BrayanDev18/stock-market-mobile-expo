import {View, Text, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  IconX,
  IconCamera,
  IconCameraOff,
  IconShieldLock,
} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {ActionHeader, HeaderIconButton, GradientButton} from '@/components';

interface CameraPermissionStateProps {
  /** True when the OS won't show the prompt again (deep-link to Settings). */
  permanentlyDenied: boolean;
  /** Primary CTA: request permission or open Settings. */
  onPrimaryPress: () => void;
  /** Close / dismiss the screen. */
  onClose: () => void;
}

/** Empty state shown when camera permission has not been granted. */
export const CameraPermissionState = ({
  permanentlyDenied,
  onPrimaryPress,
  onClose,
}: CameraPermissionStateProps) => (
  <View className="flex-1 bg-surface">
    <SafeAreaView className="flex-1" edges={['top']}>
      <ActionHeader
        left={
          <HeaderIconButton onPress={onClose}>
            <IconX size={20} color="white" />
          </HeaderIconButton>
        }
        title="Scan to Pay"
        right={<View className="w-12" />}
      />

      <View className="flex-1 items-center justify-center px-8 gap-5">
        <View className="w-24 h-24 rounded-full bg-green-400/10 items-center justify-center">
          <View className="w-20 h-20 rounded-full bg-green-400/20 items-center justify-center">
            <IconCameraOff size={36} color={Colors.accentLight} />
          </View>
        </View>

        <View className="items-center gap-2">
          <Text className="text-white text-xl font-bold">
            Camera access needed
          </Text>
          <Text className="text-neutral-400 text-sm text-center leading-5">
            QuantiX uses your camera to scan QR codes for instant payments. Your
            camera feed never leaves your device.
          </Text>
        </View>

        <View className="flex-row items-center gap-2 bg-surface-light border border-neutral-800 rounded-full px-4 py-2">
          <IconShieldLock size={14} color={Colors.accentLight} />
          <Text className="text-neutral-300 text-xs">
            Used only for QR scanning
          </Text>
        </View>

        <GradientButton
          label={permanentlyDenied ? 'Open Settings' : 'Enable Camera'}
          onPress={onPrimaryPress}
          icon={<IconCamera size={18} color="black" />}
          height={56}
          className="w-full mt-2"
        />

        <Pressable onPress={onClose}>
          <Text className="text-neutral-500 text-sm">Not now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  </View>
);
