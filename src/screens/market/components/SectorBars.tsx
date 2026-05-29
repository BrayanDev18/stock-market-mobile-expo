import {useMemo} from 'react';
import {BarChart} from 'react-native-gifted-charts';

import {mulberry32, seedFromString} from '@/core/utils';
import {trendAlpha} from '@/core/constants';
import type {SectorProps} from '@/core/interfaces';

interface SectorBarsProps {
  sector: SectorProps;
}

export const SectorBars = ({sector}: SectorBarsProps) => {
  const data = useMemo(() => {
    const rand = mulberry32(seedFromString(sector.name));
    const isPositive = sector.change >= 0;
    return Array.from({length: 10}, (_, i) => {
      const base = 8 + rand() * 10 + (isPositive ? i * 0.6 : (10 - i) * 0.6);
      return {
        value: parseFloat(base.toFixed(2)),
        frontColor: isPositive
          ? trendAlpha.up(0.5)
          : trendAlpha.down(0.5),
      };
    });
  }, [sector]);

  return (
    <BarChart
      data={data}
      width={120}
      height={32}
      barWidth={6}
      spacing={4}
      initialSpacing={0}
      hideRules
      hideYAxisText
      xAxisColor="transparent"
      yAxisColor="transparent"
      barBorderRadius={1.5}
      disableScroll
    />
  );
};
