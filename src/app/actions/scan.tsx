import {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Pressable, Dimensions, StyleSheet, AppState, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import {IconX, IconBolt, IconBoltOff} from '@tabler/icons-react-native';

import {ActionHeader, HeaderIconButton} from '@/components';
import {
  CameraPermissionState,
  ScanViewfinder,
  ScanBottomSheet,
  type RecentPayeeProps,
} from '@/screens/actions/components';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const VIEWFINDER_SIZE = SCREEN_WIDTH * 0.72;

const RECENT_PAYEES: RecentPayeeProps[] = [
  {id: '1', name: 'Coffee Hub', avatar: 'https://i.pravatar.cc/120?img=14'},
  {id: '2', name: 'Uber', avatar: 'https://i.pravatar.cc/120?img=33'},
  {id: '3', name: 'Netflix', avatar: 'https://i.pravatar.cc/120?img=45'},
  {id: '4', name: 'Spotify', avatar: 'https://i.pravatar.cc/120?img=58'},
];

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
      <CameraPermissionState
        permanentlyDenied={permanentlyDenied}
        onPrimaryPress={() => {
          if (permanentlyDenied) {
            void Linking.openSettings();
          } else {
            void requestPermission();
          }
        }}
        onClose={() => router.back()}
      />
    );
  }

  // --- Camera + scanner -----------------------------------------------------

  return (
    <View className="flex-1 bg-black">
      {/* Live camera preview */}
      {isActive && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      )}

      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/55" />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ActionHeader
          left={
            <HeaderIconButton onPress={() => router.back()}>
              <IconX size={20} color="white" />
            </HeaderIconButton>
          }
          title="Scan to Pay"
          right={
            <Pressable
              onPress={() => setTorchOn((prev) => !prev)}
              className={`w-12 h-12 rounded-2xl items-center justify-center border ${torchOn ? 'bg-yellow-400 border-yellow-400' : 'bg-neutral-900/70 border-neutral-800'}`}
            >
              {torchOn
                ? <IconBolt size={20} color="black" />
                : <IconBoltOff size={20} color="white" />
              }
            </Pressable>
          }
        />

        <ScanViewfinder
          size={VIEWFINDER_SIZE}
          scanned={scanned}
          scanLineStyle={scanLineStyle}
          onScanAgain={resetScanner}
        />

        <ScanBottomSheet payees={RECENT_PAYEES} />
      </SafeAreaView>
    </View>
  );
};

export default ScanScreen;
