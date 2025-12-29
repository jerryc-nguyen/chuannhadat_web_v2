import { useState, useCallback } from 'react';
import { autocompleteApi } from '../api';
import { OptionForSelect } from '@common/types';
import { toSearchString } from '@common/stringHelpers';

export type SearchResultType = 'recent' | 'search' | 'combined' | null;

export type UseAutocompleteSearchProps = {
  initialRecentSearches?: OptionForSelect[];
  scope?: string;
}

export const useAutocompleteSearch = ({ initialRecentSearches = [], scope = 'map' }: UseAutocompleteSearchProps = {}) => {
  const [results, setResults] = useState<OptionForSelect[]>(initialRecentSearches);
  const [recentSearches, setRecentSearches] = useState<OptionForSelect[]>(initialRecentSearches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultType, setResultType] = useState<SearchResultType>(initialRecentSearches.length > 0 ? 'recent' : null);

  const search = useCallback(async (params: Record<string, A> = {}) => {
    const { keyword = '' } = params;
    if (!keyword.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      setResultType(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await autocompleteApi.search({ ...params, scope });
      if (response.success) {
        setResults(response.data);
        setResultType('search');
      } else {
        setResults([]);
        setError('Search failed');
        setResultType(null);
      }
    } catch (err) {
      console.error('Autocomplete search error:', err);
      setResults([]);
      setError('Search failed');
      setResultType(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecentSearches = useCallback(async (params: Record<string, A> = {}) => {
    setLoading(true);
    setError(null);
    params.limit ||= 10;
    try {
      const response = await autocompleteApi.recent(params);
      if (response.success) {
        const recentData = response.data.map(option => ({
          ...option,
          _resultType: 'recent' as const
        }));
        setRecentSearches(recentData);
        setResults(recentData);
        setResultType('recent');
      } else {
        setRecentSearches([]);
        setResults([]);
        setError('Failed to load recent searches');
        setResultType(null);
      }
    } catch (err) {
      console.error('Recent searches error:', err);
      setRecentSearches([]);
      setResults([]);
      setError('Failed to load recent searches');
      setResultType(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sort results based on search query relevance
  const sortByRelevance = useCallback((items: OptionForSelect[], query: string): OptionForSelect[] => {
    const normalizedQuery = toSearchString(query);

    return [...items].sort((a, b) => {
      const textA = toSearchString(a.text || '');
      const textB = toSearchString(b.text || '');

      // Exact match gets highest priority
      const exactMatchA = textA === normalizedQuery;
      const exactMatchB = textB === normalizedQuery;
      if (exactMatchA && !exactMatchB) return -1;
      if (!exactMatchA && exactMatchB) return 1;

      // Starts with query gets next priority
      const startsWithA = textA.startsWith(normalizedQuery);
      const startsWithB = textB.startsWith(normalizedQuery);
      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;

      // Contains query gets lower priority
      const containsA = textA.includes(normalizedQuery);
      const containsB = textB.includes(normalizedQuery);
      if (containsA && !containsB) return -1;
      if (!containsA && containsB) return 1;

      // If same relevance, maintain original order
      return 0;
    });
  }, []);

  const mergeWithRecentSearches = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // If no search query, just show recent searches
      setResults(recentSearches);
      setResultType('recent');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResponse = await autocompleteApi.search({ keyword: searchQuery, scope });

      const combinedResults: OptionForSelect[] = [];

      // Get search results with markers
      const searchResults = searchResponse.success && searchResponse.data.length > 0
        ? searchResponse.data.map(option => ({
          ...option,
          _resultType: 'search' as const
        }))
        : [];

      // Filter recent searches to exclude those that appear in search results
      const filteredRecentSearches = recentSearches
        .filter(recent => !searchResults.some(search =>
          search.text === recent.text ||
          (search.value && recent.value && search.value === recent.value)
        ))
        .slice(0, 3); // Limit to 3 recent items

      // Add filtered recent searches first
      if (filteredRecentSearches.length > 0) {
        combinedResults.push(...filteredRecentSearches);
      }

      // Add search results
      if (searchResults.length > 0) {
        combinedResults.push(...searchResults);
      }

      // Sort all results by relevance to search query
      const sortedResults = sortByRelevance(combinedResults, searchQuery);

      setResults(sortedResults);
      setResultType('combined'); // Indicate mixed results
    } catch (err) {
      console.error('Search error:', err);
      setResults(recentSearches); // Fall back to recent searches
      setError('Search failed');
      setResultType('recent');
    } finally {
      setLoading(false);
    }
  }, [recentSearches, sortByRelevance]);

  const deleteRecentSearch = useCallback(async (option: OptionForSelect) => {
    // Remove from local recent searches state
    setRecentSearches(prev => prev.filter(recent =>
      !(recent.text === option.text && recent.value === option.value)
    ));

    // Update results if currently showing recent searches
    if (resultType === 'recent') {
      setResults(prev => prev.filter(result =>
        !(result.text === option.text && result.value === option.value)
      ));
    }

    return await autocompleteApi.deleteRecent({ target_type: option.data_type || '', target_id: option.data?.id || 0 });
  }, [resultType]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setResultType(null);
  }, []);

  return {
    results,
    recentSearches,
    loading,
    error,
    resultType,
    search,
    loadRecentSearches,
    mergeWithRecentSearches,
    deleteRecentSearch,
    clearResults,
  };
};

export const convertAutocompleteToFilterOption = (option: OptionForSelect): Record<string, OptionForSelect | undefined> => {
  if (!option.data) return {};

  const result: Record<string, OptionForSelect | undefined> = {
    city: undefined,
    district: undefined,
    ward: undefined,
    project: undefined,
  };
  const { data, text } = option;

  switch (data.mappable_type) {
    case 'Core::City':
      result.city = { text: text, value: data.mappable_id };
      break;
    case 'Core::District':
      result.district = { text: text, value: data.mappable_id }
      break;
    case 'Core::Ward':
      result.ward = { text: text, value: data.mappable_id }
      break;
    case 'Core::Project':
      result.project = { text: text, value: data.mappable_id };
      break;
  }

  return result;
};
