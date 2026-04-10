import {useState} from 'react';
import {View, Text, Pressable, ScrollView, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {Image} from 'expo-image';
import {
  IconArrowLeft,
  IconHelpCircle,
  IconArrowsUpDown,
  IconWallet,
  IconUser,
  IconPlus,
  IconMessageCircle,
} from '@tabler/icons-react-native';

import {formatCurrency} from '@/utils';

interface ContactProps {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

const RECENT_CONTACTS: ContactProps[] = [
  {
    id: '1',
    name: 'Sarah',
    handle: '@sarah',
    avatar: 'https://i.pravatar.cc/120?img=47',
  },
  {
    id: '2',
    name: 'Alex',
    handle: '@alex.m',
    avatar: 'https://i.pravatar.cc/120?img=12',
  },
  {
    id: '3',
    name: 'Jordan',
    handle: '@jordan',
    avatar: 'https://i.pravatar.cc/120?img=33',
  },
  {
    id: '4',
    name: 'Emily',
    handle: '@emily.k',
    avatar: 'https://i.pravatar.cc/120?img=45',
  },
  {
    id: '5',
    name: 'Marcus',
    handle: '@marcus',
    avatar: 'https://i.pravatar.cc/120?img=67',
  },
];

const TransferScreen = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [recipientId, setRecipientId] = useState<string | null>(null);

  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const recipient = RECENT_CONTACTS.find((c) => c.id === recipientId);
  const canContinue = numericAmount > 0 && recipient;

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconArrowLeft size={20} color="white"/>
          </Pressable>

          <Text className="text-white text-base font-semibold">Transfer</Text>

          <Pressable
            className="w-12 h-12 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
          >
            <IconHelpCircle size={20} color="white"/>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* From / To */}
          <View className="mt-4">
            <View className="bg-surface-light rounded-2xl p-4 flex-row items-center">
              <View className="w-11 h-11 rounded-full bg-green-400/20 items-center justify-center">
                <IconWallet size={20} color="#4ade80"/>
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-neutral-500 text-xs">From</Text>
                <Text className="text-white text-base font-medium">Main Wallet</Text>
              </View>

              <Text className="text-neutral-400 text-sm">
                ${formatCurrency(89432.55)}
              </Text>
            </View>

            {/* Swap icon */}
            <View className="items-center" style={{marginVertical: -10, zIndex: 10}}>
              <View className="w-10 h-10 rounded-full bg-surface border-2 border-surface items-center justify-center">
                <View className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center">
                  <IconArrowsUpDown size={16} color="white"/>
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

                  <Pressable onPress={() => setRecipientId(null)}>
                    <Text className="text-green-400 text-sm">Change</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View className="w-11 h-11 rounded-full bg-neutral-800 items-center justify-center">
                    <IconUser size={20} color="#a3a3a3"/>
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-neutral-500 text-xs">To</Text>
                    <Text className="text-neutral-500 text-base">Select recipient</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Amount */}
          <View className="mt-8 items-center gap-2">
            <Text className="text-neutral-400 text-sm">You send</Text>

            <View className="flex-row items-start">
              <Text className="text-neutral-500 text-2xl mt-2">$</Text>
              <TextInput
                value={amount}
                onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                placeholderTextColor="#525252"
                keyboardType="decimal-pad"
                className="text-white text-6xl font-semibold tracking-tight"
                style={{minWidth: 120, textAlign: 'center'}}
              />
            </View>

            <Text className="text-neutral-500 text-xs">
              Available ${formatCurrency(89432.55)}
            </Text>
          </View>

          {/* Note */}
          <View className="mt-6">
            <View className="flex-row items-center bg-surface-light border border-neutral-800 rounded-2xl px-4 h-14 gap-3">
              <IconMessageCircle size={18} color="#a3a3a3"/>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note (optional)"
                placeholderTextColor="#525252"
                className="flex-1 text-white text-base"
              />
            </View>
          </View>

          {/* Recent contacts */}
          <View className="mt-8 gap-4 mb-32">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-medium">Recent</Text>

              <Pressable>
                <Text className="text-neutral-500 text-sm">Show All</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              <Pressable className="items-center gap-2" style={{width: 68}}>
                <View className="w-14 h-14 rounded-full bg-surface-light border border-dashed border-neutral-700 items-center justify-center">
                  <IconPlus size={22} color="#a3a3a3"/>
                </View>
                <Text className="text-neutral-400 text-xs">New</Text>
              </Pressable>

              {RECENT_CONTACTS.map((c) => {
                const isSelected = c.id === recipientId;

                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setRecipientId(c.id)}
                    className="items-center gap-2"
                    style={{width: 68}}
                  >
                    <View
                      className={`rounded-full p-0.5 ${isSelected ? 'bg-green-400' : 'bg-transparent'}`}
                    >
                      <Image
                        source={{uri: c.avatar}}
                        style={{width: 54, height: 54, borderRadius: 50}}
                      />
                    </View>
                    <Text
                      className={`text-xs ${isSelected ? 'text-white' : 'text-neutral-400'}`}
                      numberOfLines={1}
                    >
                      {c.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        {/* CTA */}
        <View className="absolute bottom-6 left-4 right-4">
          <Pressable disabled={!canContinue}>
            <LinearGradient
              colors={canContinue ? ['#4ade80', '#22c55e'] : ['#262626', '#262626']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                height: 60,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                className={`text-base font-bold ${canContinue ? 'text-black' : 'text-neutral-500'}`}
              >
                {recipient ? `Send to ${recipient.name}` : 'Continue'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TransferScreen;
