import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';
import {IconPhotoScan, IconQrcode, IconLink} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';

export interface RecentPayeeProps {
  id: string;
  name: string;
  avatar: string;
}

interface ScanBottomSheetProps {
  payees: RecentPayeeProps[];
}

/** Bottom sheet with recent payees and quick-action buttons on the scan screen. */
export const ScanBottomSheet = ({payees}: ScanBottomSheetProps) => (
  <View className="bg-surface-light rounded-t-[32px] border-t border-l border-r border-neutral-800 px-5 pt-5 pb-10">
    {/* Drag handle */}
    <View className="items-center mb-4">
      <View className="w-10 h-1 rounded-full bg-neutral-700" />
    </View>

    {/* Recent payees */}
    <View className="gap-3">
      <Text className="text-white text-base font-medium">Recent</Text>

      <View className="flex-row gap-3">
        {payees.map((payee) => (
          <Pressable key={payee.id} className="items-center gap-2" style={{width: 64}}>
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
        <IconPhotoScan size={22} color={Colors.accentLight} />
        <Text className="text-neutral-200 text-xs font-medium">Upload QR</Text>
      </Pressable>

      <Pressable className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 items-center gap-2">
        <IconQrcode size={22} color={Colors.accentLight} />
        <Text className="text-neutral-200 text-xs font-medium">My QR</Text>
      </Pressable>

      <Pressable className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl py-4 items-center gap-2">
        <IconLink size={22} color={Colors.accentLight} />
        <Text className="text-neutral-200 text-xs font-medium">Pay Link</Text>
      </Pressable>
    </View>
  </View>
);
