import {StyleSheet, View} from 'react-native';
import {Canvas, Circle, Blur, Fill} from '@shopify/react-native-skia';

import {Colors} from '@/core/constants';

import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../constants';

export const BackgroundEffect = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{flex: 1}}>
        <Fill color="#0a0a0a"/>
        <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.35} r={180} color={Colors.accentLight}>
          <Blur blur={100}/>
        </Circle>
        {/*<Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.15} r={90} color="#22c55e">*/}
        {/*  <Blur blur={50}/>*/}
        {/*</Circle>*/}
      </Canvas>
    </View>
  );
};