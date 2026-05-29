import {View, Text, Pressable, StyleSheet, type ViewStyle} from 'react-native';
import Animated, {type AnimatedStyle} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';

import {Colors, trendAlpha} from '@/core/constants';

interface CornerProps {
  position: 'tl' | 'tr' | 'bl' | 'br';
}

const Corner = ({position}: CornerProps) => {
  const positionStyles = {
    tl: {top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16},
    tr: {top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16},
    bl: {bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16},
    br: {bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16},
  };

  return (
    <View
      style={[
        {position: 'absolute', width: 32, height: 32, borderColor: Colors.accentLight},
        positionStyles[position],
      ]}
    />
  );
};

interface ScanViewfinderProps {
  /** Square viewfinder edge length. */
  size: number;
  /** True once a code has been detected (hides scan line, shows result). */
  scanned: boolean;
  /** Animated transform style for the moving scan line. */
  scanLineStyle: AnimatedStyle<ViewStyle>;
  /** Re-arm the scanner ("Scan again"). */
  onScanAgain: () => void;
}

/** Framed viewfinder with green tint, animated scan line, corner brackets, and status copy. */
export const ScanViewfinder = ({
  size,
  scanned,
  scanLineStyle,
  onScanAgain,
}: ScanViewfinderProps) => (
  <View className="flex-1 items-center justify-center">
    <View className="rounded-3xl overflow-hidden" style={{width: size, height: size}}>
      {/* Cutout — transparent window over the live feed */}
      <View style={StyleSheet.absoluteFill} />

      {/* Subtle green tint */}
      <LinearGradient
        colors={[trendAlpha.up(0.06), trendAlpha.up(0)]}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated scan line */}
      {!scanned && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: Colors.accentLight,
              shadowColor: Colors.accentLight,
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.8,
              shadowRadius: 10,
            },
            scanLineStyle,
          ]}
        />
      )}

      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
    </View>

    {scanned ? (
      <View className="items-center gap-3 mt-6">
        <Text className="text-white text-base font-semibold">QR code detected</Text>
        <Pressable
          onPress={onScanAgain}
          className="bg-green-400 rounded-full px-5 py-2.5"
        >
          <Text className="text-black text-sm font-semibold">Scan again</Text>
        </Pressable>
      </View>
    ) : (
      <>
        <Text className="text-white text-base font-medium mt-6">
          Align QR code within the frame
        </Text>
        <Text className="text-neutral-400 text-sm mt-1">
          Hold steady to scan automatically
        </Text>
      </>
    )}
  </View>
);
