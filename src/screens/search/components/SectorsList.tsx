import {View, Text} from 'react-native';
import {IconLayoutGrid} from '@tabler/icons-react-native';

import {sectors} from '@/core/data';
import {SectorRow} from './SectorRow';

interface SectorsListProps {
  onSelect: (name: string) => void;
}

export const SectorsList = ({onSelect}: SectorsListProps) => {
  return (
    <View className="mt-8 gap-4 mb-32">
      <View className="flex-row items-center gap-2">
        <IconLayoutGrid size={18} color="#a3a3a3" />
        <Text className="text-white text-lg font-medium">Browse by Sector</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {sectors.map((sector) => (
          <SectorRow key={sector.name} sector={sector} onSelect={onSelect} />
        ))}
      </View>
    </View>
  );
};
