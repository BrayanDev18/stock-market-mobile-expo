import {View, Text, Pressable, ScrollView} from 'react-native';
import {Image} from 'expo-image';
import {IconPlus} from '@tabler/icons-react-native';

export interface ContactProps {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

interface RecentContactsProps {
  contacts: ContactProps[];
  /** Id of the currently selected contact, if any. */
  selectedId: string | null;
  /** Called with the tapped contact id. */
  onSelect: (id: string) => void;
}

/** Horizontal recent-contacts carousel (with a leading "New" tile) on transfer. */
export const RecentContacts = ({
  contacts,
  selectedId,
  onSelect,
}: RecentContactsProps) => (
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
          <IconPlus size={22} color="#a3a3a3" />
        </View>
        <Text className="text-neutral-400 text-xs">New</Text>
      </Pressable>

      {contacts.map((c) => {
        const isSelected = c.id === selectedId;

        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c.id)}
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
);