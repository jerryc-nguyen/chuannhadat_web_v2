import { useState, useCallback } from 'react';
import { autocompleteApi } from '../api';
import { OptionForSelect } from '@common/types';

export const useAutocompleteSearch = () => {
  const [results, setResults] = useState<OptionForSelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await autocompleteApi.search({ keyword: searchQuery });
      if (response.success) {
        setResults(response.data);
      } else {
        setResults([]);
        setError('Search failed');
      }
    } catch (err) {
      console.error('Autocomplete search error:', err);
      setResults([]);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
};
