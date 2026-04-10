import {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
  AppState,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import {
  IconX,
  IconPhotoScan,
  IconQrcode,
  IconLink,
  IconBolt,
  IconBoltOff,
  IconCamera,
  IconCameraOff,
  IconShieldLock,
} from '@tabler/icons-react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const VIEWFINDER_SIZE = SCREEN_WIDTH * 0.72;

interface RecentPayeeProps {
  id: string;
  name: string;
  avatar: string;
}

const RECENT_PAYEES: RecentPayeeProps[] = [
  {id: '1', name: 'Coffee Hub', avatar: 'https://i.pravatar.cc/120?img=14'},
  {id: '2', name: 'Uber', avatar: 'https://i.pravatar.cc/120?img=33'},
  {id: '3', name: 'Netflix', avatar: 'https://i.pravatar.cc/120?img=45'},
  {id: '4', name: 'Spotify', avatar: 'https://i.pravatar.cc/120?img=58'},
];

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
        {position: 'absolute', width: 32, height: 32, borderColor: '#4ade80'},
        positionStyles[position],
      ]}
    />
  );
};

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const scanLineY = useSharedValue(0);
  const hasHandledScanRef = useRef(false);

  // Pause the camera when the app goes to background, resume on foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      setIsActive(state === 'active');
    });
    return () => sub.remove();
  }, []);

  // Kick off the scan-line animation once.
  useEffect(() => {
    scanLineY.value = withRepeat(
      withSequence(
        withTiming(VIEWFINDER_SIZE - 4, {duration: 1800, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 1800, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{translateY: scanLineY.value}],
  }));

  const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
    if (hasHandledScanRef.current) return;
    hasHandledScanRef.current = true;
    setScanned(true);
    // In a real app you'd parse result.data and navigate to the pay flow.
    console.log('Scanned QR:', result.data);
  }, []);

  const resetScanner = () => {
    hasHandledScanRef.current = false;
    setScanned(false);
  };

  // --- Permission gate ------------------------------------------------------

  if (!permission) {
    // Permissions are still loading from the OS
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-neutral-400 text-sm">Loading camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    const permanentlyDenied = !permission.canAskAgain;

    return (
      <View className="flex-1 bg-surface">
        <SafeAreaView className="flex-1" edges={['top']}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
            >
              <IconX size={20} color="white"/>
            </Pressable>

            <Text className="text-white text-base font-semibold">Scan to Pay</Text>

            <View className="w-12"/>
          </View>

          {/* Empty state */}
          <View className="flex-1 items-center justify-center px-8 gap-5">
            <View className="w-24 h-24 rounded-full bg-green-400/10 items-center justify-center">
              <View className="w-20 h-20 rounded-full bg-green-400/20 items-center justify-center">
                <IconCameraOff size={36} color="#4ade80"/>
              </View>
            </View>

            <View className="items-center gap-2">
              <Text className="text-white text-xl font-bold">
                Camera access needed
              </Text>
              <Text className="text-neutral-400 text-sm text-center leading-5">
                QuantiX uses your camera to scan QR codes for instant payments.
                Your camera feed never leaves your device.
              </Text>
            </View>

            {/* Privacy note */}
            <View className="flex-row items-center gap-2 bg-surface-light border border-neutral-800 rounded-full px-4 py-2">
              <IconShieldLock size={14} color="#4ade80"/>
              <Text className="text-neutral-300 text-xs">
                Used only for QR scanning
              </Text>
            </View>

            {/* CTA */}
            <Pressable
              onPress={() => {
                if (permanentlyDenied) {
                  void Linking.openSettings();
                } else {
                  void requestPermission();
                }
              }}
              className="w-full mt-2"
            >
              <LinearGradient
                colors={['#4ade80', '#22c55e']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  height: 56,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <IconCamera size={18} color="black"/>
                <Text className="text-black text-base font-bold">
                  {permanentlyDenied ? 'Open Settings' : 'Enable Camera'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text className="text-neutral-500 text-sm">Not now</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // --- Camera + scanner -----------------------------------------------------

  return (
    <View className="flex-1 bg-black">
      {/* Live camera preview */}
      {isActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      )}

      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/55"/>

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconX size={20} color="white"/>
          </Pressable>

          <Text className="text-white text-base font-semibold">Scan to Pay</Text>

          <Pressable
            onPress={() => setTorchOn((prev) => !prev)}
            className={`w-12 h-12 rounded-2xl items-center justify-center border ${torchOn ? 'bg-yellow-400 border-yellow-400' : 'bg-neutral-900/70 border-neutral-800'}`}
          >
            {torchOn
              ? <IconBolt size={20} color="black"/>
              : <IconBoltOff size={20} color="white"/>
            }
          </Pressable>
        </View>

        {/* Viewfinder */}
        <View className="flex-1 items-center justify-center">
          <View
            className="rounded-3xl overflow-hidden"
            style={{width: VIEWFINDER_SIZE, height: VIEWFINDER_SIZE}}
          >
            {/* Cutout — transparent window over the live feed */}
            <View style={StyleSheet.absoluteFillObject}/>

            {/* Subtle green tint */}
            <LinearGradient
              colors={['rgba(74, 222, 128, 0.06)', 'rgba(74, 222, 128, 0)']}
              style={StyleSheet.absoluteFillObject}
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
                    backgroundColor: '#4ade80',
                    shadowColor: '#4ade80',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                  },
                  scanLineStyle,
                ]}
              />
            )}

            {/* Corner brackets */}
            <Corner position="tl"/>
            <Corner position="tr"/>
            <Corner position="bl"/>
            <Corner position="br"/>
          </View>

          {scanned ? (
            <View className="items-center gap-3 mt-6">
              <Text className="text-white text-base font-semibold">
                QR code detected
              </Text>
              <Pressable
                onPress={resetScanner}
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

        {/* Bottom sheet */}
        <View className="bg-surface-light rounded-t-[32px] border-t border-l border-r border-neutral-800 px-5 pt-5 pb-10">
          {/* Drag handle */}
          <View className="items-center mb-4">
            <View className="w-10 h-1 rounded-full bg-neutral-700"/>
          </View>

          {/* Recent payees */}
          <View className="gap-3">
            <Text className="text-white text-base font-medium">Recent</Text>

            <View className="flex-row gap-3">
              {RECENT_PAYEES.map((payee) => (
                <Pressable
                  key={payee.id}
                  className="items-center gap-2"
                  style={{width: 64}}
                >
                  <Image
                    source={{uri: payee.avatar}}
                    style={{width: 48, height: 48, borderRadius: 14}}
                  />
                  <Text className="text-neutral-300 text-xs" numberOfLines={1}>
                    {payee.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 mt-6">
            <Pressable className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 items-center gap-2">
              <IconPhotoScan size={22} color="#4ade80"/>
              <Text className="text-neutral-200 text-xs font-medium">Upload QR</Text>
            </Pressable>

            <Pressable className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 items-center gap-2">
              <IconQrcode size={22} color="#4ade80"/>
              <Text className="text-neutral-200 text-xs font-medium">My QR</Text>
            </Pressable>

            <Pressable className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 items-center gap-2">
              <IconLink size={22} color="#4ade80"/>
              <Text className="text-neutral-200 text-xs font-medium">Pay Link</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ScanScreen;
