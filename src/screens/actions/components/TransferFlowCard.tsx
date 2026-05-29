import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';
import {IconArrowsUpDown, IconWallet, IconUser} from '@tabler/icons-react-native';

import {Colors} from '@/core/constants';
import {formatCurrency} from '@/core/utils';

import type {ContactProps} from './RecentContacts';

interface TransferFlowCardProps {
  /** Available balance shown on the "From" wallet row. */
  balance: number;
  /** Selected recipient, or null for the empty "Select recipient" state. */
  recipient?: ContactProps;
  /** Clears the selected recipient ("Change"). */
  onClearRecipient: () => void;
}

/** From (wallet) ↔ To (recipient) swap card on the transfer screen. */
export const TransferFlowCard = ({
  balance,
  recipient,
  onClearRecipient,
}: TransferFlowCardProps) => (
  <View className="mt-4">
    <View className="bg-surface-light rounded-2xl p-4 flex-row items-center">
      <View className="w-11 h-11 rounded-full bg-green-400/20 items-center justify-center">
        <IconWallet size={20} color={Colors.accentLight} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-neutral-500 text-xs">From</Text>
        <Text className="text-white text-base font-medium">Main Wallet</Text>
      </View>

      <Text className="text-neutral-400 text-sm">${formatCurrency(balance)}</Text>
    </View>

    {/* Swap icon */}
    <View className="items-center" style={{marginVertical: -10, zIndex: 10}}>
      <View className="w-10 h-10 rounded-full bg-surface border-2 border-surface items-center justify-center">
        <View className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center">
          <IconArrowsUpDown size={16} color="white" />
        </View>
      </View>
    </View>

    <View className="bg-surface-light rounded-2xl p-4 flex-row items-center">
      {recipient ? (
        <>
          <Image
            source={{uri: recipient.avatar}}
            style={{width: 44, height: 44, borderRadius: 50}}
          />

          <View className="ml-3 flex-1">
            <Text className="text-neutral-500 text-xs">To</Text>
            <Text className="text-white text-base font-medium">{recipient.name}</Text>
          </View>

          <Pressable onPress={onClearRecipient}>
            <Text className="text-green-400 text-sm">Change</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View className="w-11 h-11 rounded-full bg-neutral-800 items-center justify-center">
            <IconUser size={20} color="#a3a3a3" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-neutral-500 text-xs">To</Text>
            <Text className="text-neutral-500 text-base">Select recipient</Text>
          </View>
        </>
      )}
    </View>
  </View>
);