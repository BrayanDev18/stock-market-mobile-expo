import {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ActionHeader, GradientButton} from '@/components';
import {
  TransferFlowCard,
  TransferAmountInput,
  NoteInput,
  RecentContacts,
  type ContactProps,
} from '@/screens/actions/components';

const BALANCE = 89432.55;

const RECENT_CONTACTS: ContactProps[] = [
  {id: '1', name: 'Sarah', handle: '@sarah', avatar: 'https://i.pravatar.cc/120?img=47'},
  {id: '2', name: 'Alex', handle: '@alex.m', avatar: 'https://i.pravatar.cc/120?img=12'},
  {id: '3', name: 'Jordan', handle: '@jordan', avatar: 'https://i.pravatar.cc/120?img=33'},
  {id: '4', name: 'Emily', handle: '@emily.k', avatar: 'https://i.pravatar.cc/120?img=45'},
  {id: '5', name: 'Marcus', handle: '@marcus', avatar: 'https://i.pravatar.cc/120?img=67'},
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
        <ActionHeader title="Transfer" />

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <TransferFlowCard
            balance={BALANCE}
            recipient={recipient}
            onClearRecipient={() => setRecipientId(null)}
          />

          <TransferAmountInput value={amount} onChangeText={setAmount} balance={BALANCE} />

          <NoteInput value={note} onChangeText={setNote} />

          <RecentContacts
            contacts={RECENT_CONTACTS}
            selectedId={recipientId}
            onSelect={setRecipientId}
          />
        </ScrollView>

        <View className="absolute bottom-6 left-4 right-4">
          <GradientButton
            label={recipient ? `Send to ${recipient.name}` : 'Continue'}
            disabled={!canContinue}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TransferScreen;
