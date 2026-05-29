import {Stack} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";

import "../../global.css"
import '@/core/utils/cssInterop';

const AppLayout = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Stack screenOptions={{headerShown: false}}/>
    </GestureHandlerRootView>
  );
}

export default AppLayout
