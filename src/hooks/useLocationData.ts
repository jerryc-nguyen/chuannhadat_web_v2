/**
 * React Hook for Dynamic Location Data Loading
 * 
 * Provides a clean React interface for progressively loading location data.
 * Replaces direct JSON imports with on-demand loading.
 */

import { useState, useEffect, useCallback } from 'react';
import { LocationDataLoader, type City, type District, type Ward, type Street, type Project } from '@configs/locations/dynamic-loader';

interface UseLocationDataReturn {
  cities: City[];
  districts: District[];
  wards: Ward[];
  streets: Street[];
  projects: Project[];
  loading: {
    cities: boolean;
    districts: boolean;
    wards: boolean;
    streets: boolean;
    projects: boolean;
  };
  error: string | null;
  loadDistricts: (cityId: string) => Promise<void>;
  loadWards: (districtId: string) => Promise<void>;
  loadStreets: (districtId: string) => Promise<void>;
  loadProjects: (districtId: string) => Promise<void>;
  reset: () => void;
}

export function useLocationData(): UseLocationDataReturn {
  // State for each data type
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [streets, setStreets] = useState<Street[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    cities: false,
    districts: false,
    wards: false,
    streets: false,
    projects: false,
  });

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Helper to update loading state
  const updateLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // Load cities on mount (small file, always needed)
  useEffect(() => {
    const loadCities = async () => {
      updateLoading('cities', true);
      setError(null);

      try {
        const citiesData = await LocationDataLoader.getCities();
        setCities(citiesData);
      } catch (err) {
        setError('Failed to load cities');
        console.error('Error loading cities:', err);
      } finally {
        updateLoading('cities', false);
      }
    };

    loadCities();
  }, []);

  // Load districts when city is selected
  const loadDistricts = useCallback(async (cityId: string) => {
    updateLoading('districts', true);
    setError(null);

    try {
      const districtsData = await LocationDataLoader.getDistrictsByCity(cityId);
      setDistricts(districtsData);

      // Clear dependent data when city changes
      setWards([]);
      setStreets([]);
      setProjects([]);
    } catch (err) {
      setError('Failed to load districts');
      console.error('Error loading districts:', err);
    } finally {
      updateLoading('districts', false);
    }
  }, []);

  // Load wards when district is selected
  const loadWards = useCallback(async (districtId: string) => {
    updateLoading('wards', true);
    setError(null);

    try {
      const wardsData = await LocationDataLoader.getWardsByDistrict(districtId);
      setWards(wardsData);
    } catch (err) {
      setError('Failed to load wards');
      console.error('Error loading wards:', err);
    } finally {
      updateLoading('wards', false);
    }
  }, []);

  // Load streets when district is selected  
  const loadStreets = useCallback(async (districtId: string) => {
    updateLoading('streets', true);
    setError(null);

    try {
      const streetsData = await LocationDataLoader.getStreetsByDistrict(districtId);
      setStreets(streetsData);
    } catch (err) {
      setError('Failed to load streets');
      console.error('Error loading streets:', err);
    } finally {
      updateLoading('streets', false);
    }
  }, []);

  // Load projects when district is selected
  const loadProjects = useCallback(async (districtId: string) => {
    updateLoading('projects', true);
    setError(null);

    try {
      const projectsData = await LocationDataLoader.getProjectsByDistrict(districtId);
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      updateLoading('projects', false);
    }
  }, []);

  // Reset all data
  const reset = useCallback(() => {
    setDistricts([]);
    setWards([]);
    setStreets([]);
    setProjects([]);
    setError(null);
  }, []);

  return {
    cities,
    districts,
    wards,
    streets,
    projects,
    loading,
    error,
    loadDistricts,
    loadWards,
    loadStreets,
    loadProjects,
    reset,
  };
}

/**
 * Hook for loading all location data at once (use sparingly)
 * Only use this if you really need all data immediately
 */
export function useAllLocationData() {
  const [allData, setAllData] = useState<{
    cities: City[];
    districts: District[];
    wards: Ward[];
    streets: Street[];
    projects: Project[];
  }>({
    cities: [],
    districts: [],
    wards: [],
    streets: [],
    projects: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [cities, districts, wards, streets, projects] = await Promise.all([
          LocationDataLoader.getCities(),
          LocationDataLoader.getDistrictsByCity(),
          LocationDataLoader.getWardsByDistrict(),
          LocationDataLoader.getStreetsByDistrict(),
          LocationDataLoader.getProjectsByDistrict(),
        ]);

        setAllData({ cities, districts, wards, streets, projects });
      } catch (err) {
        setError('Failed to load location data');
        console.error('Error loading all location data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  return { ...allData, loading, error };
}
