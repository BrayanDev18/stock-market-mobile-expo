import {Text, Pressable} from 'react-native';

import {TrendPill} from '@/components';
import type {SectorProps} from '@/core/interfaces';

interface SectorRowProps {
  sector: SectorProps;
  onSelect: (name: string) => void;
}

export const SectorRow = ({sector, onSelect}: SectorRowProps) => {
  const isPositive = sector.change >= 0;

  return (
    <Pressable
      onPress={() => onSelect(sector.name)}
      className="bg-surface-light rounded-2xl p-4 gap-2"
      style={{width: '47.5%'}}
    >
      <Text className="text-neutral-200 text-sm font-medium" numberOfLines={1}>
        {sector.name}
      </Text>

      <TrendPill
        value={sector.change}
        iconSize={14}
        textClassName="text-xs font-medium"
        text={`${isPositive ? '+' : ''}${sector.change.toFixed(2)}%`}
      />
    </Pressable>
  );
};
