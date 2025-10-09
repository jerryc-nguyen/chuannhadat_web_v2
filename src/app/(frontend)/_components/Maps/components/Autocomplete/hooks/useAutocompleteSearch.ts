import { useState, useCallback } from 'react';
import { autocompleteApi } from '../api';
import { OptionForSelect } from '@common/types';

export type SearchResultType = 'recent' | 'search' | null;

export const useAutocompleteSearch = () => {
  const [results, setResults] = useState<OptionForSelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultType, setResultType] = useState<SearchResultType>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      setResultType(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await autocompleteApi.search({ keyword: searchQuery });
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

  const loadRecentSearches = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await autocompleteApi.recent({ limit });
      if (response.success) {
        setResults(response.data);
        setResultType('recent');
      } else {
        setResults([]);
        setError('Failed to load recent searches');
        setResultType(null);
      }
    } catch (err) {
      console.error('Recent searches error:', err);
      setResults([]);
      setError('Failed to load recent searches');
      setResultType(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setResultType(null);
  }, []);

  return {
    results,
    loading,
    error,
    resultType,
    search,
    loadRecentSearches,
    clearResults,
  };
};
