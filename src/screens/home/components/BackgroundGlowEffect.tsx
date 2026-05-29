import {Dimensions, StyleSheet, View} from 'react-native'
import {
  Canvas,
  RadialGradient,
  vec,
  Circle,
  Blur
} from "@shopify/react-native-skia";

import {Colors} from '@/core/constants';

const {width, height} = Dimensions.get('window');

export const BackgroundGlowEffect = () => {
  const cx = width * 0.5;
  const cy = height * 0.05;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={{flex: 1}}>
        <Circle cx={cx} cy={cy} r={320}>
          <RadialGradient
            c={vec(cx, cy)}
            r={320}
            colors={[
              'rgba(187,247,208,0.50)', // centro suave
              'rgba(74,222,128,0.30)',
              'rgba(22,163,74,0.18)',
              'rgba(22,101,52,0.10)',
              'rgba(0,0,0,0)'
            ]}
          />
        </Circle>

        <Circle
          cx={cx}
          cy={cy}
          r={260}
          color={Colors.accentDim}
          opacity={0.08}
        >
          <Blur blur={140}/>
        </Circle>

        <Circle
          cx={cx}
          cy={cy}
          r={80}
          color="#bbf7d0"
          opacity={0.25}
        >
          <Blur blur={80}/>
        </Circle>

      </Canvas>
    </View>
  )
}