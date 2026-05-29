import {View, Text} from 'react-native';
import {IconSearch} from '@tabler/icons-react-native';

import type {StockProps} from '@/core/interfaces';
import {StockResultRow} from './StockResultRow';

interface SearchResultsProps {
  query: string;
  results: StockProps[];
}

export const SearchResults = ({query, results}: SearchResultsProps) => {
  return (
    <View className="mt-8 gap-4 mb-32">
      <Text className="text-neutral-400 text-sm">
        {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
      </Text>

      {results.length === 0 ? (
        <View className="items-center justify-center py-16 gap-2">
          <View className="w-16 h-16 rounded-full bg-surface-light items-center justify-center">
            <IconSearch size={24} color="#525252" />
          </View>
          <Text className="text-neutral-300 text-base font-medium">
            No matches found
          </Text>
          <Text className="text-neutral-500 text-sm">
            Try a different symbol or company name
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {results.map((stock) => (
            <StockResultRow key={stock.symbol} stock={stock} />
          ))}
        </View>
      )}
    </View>
  );
};
