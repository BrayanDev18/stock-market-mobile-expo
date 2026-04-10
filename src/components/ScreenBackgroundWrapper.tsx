import {View} from 'react-native'
import {Edges, SafeAreaView} from "react-native-safe-area-context";
import {ReactNode} from "react";
import {BackgroundGlowEffect} from "./BackgroundGlowEffect";

export const ScreenBackgroundWrapper = ({areaEdges, children}: { areaEdges?: Edges, children: ReactNode }) => {
  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={areaEdges}>
        <BackgroundGlowEffect/>

        {children}
      </SafeAreaView>
    </View>
  )
}
