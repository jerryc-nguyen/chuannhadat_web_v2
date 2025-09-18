import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { OptionForSelect } from '@common/types';

interface LocationContextType {
  // Data
  cities: OptionForSelect[];
  citiesDistricts: Record<string, OptionForSelect[]>;
  districtWards: Record<string, OptionForSelect[]>;
  districtStreets: Record<string, OptionForSelect[]>;

  // Loading states
  isLoadingCities: boolean;
  isLoadingDistricts: boolean;
  isLoadingWards: boolean;
  isLoadingStreets: boolean;

  // Methods to trigger loading
  loadCities: () => Promise<void>;
  loadDistricts: (cityId: string) => Promise<void>;
  loadWards: (districtId: string) => Promise<void>;
  loadStreets: (districtId: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Cache for location data - global across all components
const globalLocationCache = {
  cities: null as OptionForSelect[] | null,
  citiesDistricts: {} as Record<string, OptionForSelect[]>,
  districtWards: {} as Record<string, OptionForSelect[]>,
  districtStreets: {} as Record<string, OptionForSelect[]>,
};

// Loading states to prevent duplicate requests
const globalLoadingStates = {
  cities: false,
  citiesDistricts: new Set<string>(),
  districtWards: new Set<string>(),
  districtStreets: new Set<string>(),
};

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [cities, setCities] = useState<OptionForSelect[]>(globalLocationCache.cities || []);
  const [citiesDistricts, setCitiesDistricts] = useState<Record<string, OptionForSelect[]>>(globalLocationCache.citiesDistricts);
  const [districtWards, setDistrictWards] = useState<Record<string, OptionForSelect[]>>(globalLocationCache.districtWards);
  const [districtStreets, setDistrictStreets] = useState<Record<string, OptionForSelect[]>>(globalLocationCache.districtStreets);

  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [isLoadingStreets, setIsLoadingStreets] = useState(false);

  // Load cities data - now called on demand
  const loadCities = useCallback(async () => {
    // If cities are already cached, make sure local state is updated
    if (globalLocationCache.cities) {
      setCities(globalLocationCache.cities);
      return;
    }

    // If already loading, wait for it to complete
    if (globalLoadingStates.cities) return;

    try {
      globalLoadingStates.cities = true;
      setIsLoadingCities(true);

      const response = await fetch('/data/cities.json');
      if (response.ok) {
        const citiesData = await response.json();
        globalLocationCache.cities = citiesData;
        setCities(citiesData);
      } else {
        globalLocationCache.cities = [];
        setCities([]);
      }
    } catch (error) {
      // Silently handle error
      globalLocationCache.cities = [];
      setCities([]);
    } finally {
      globalLoadingStates.cities = false;
      setIsLoadingCities(false);
    }
  }, []);

  // Load districts data for a specific city
  const loadDistricts = useCallback(async (cityId: string) => {
    if (globalLocationCache.citiesDistricts[cityId] || globalLoadingStates.citiesDistricts.has(cityId)) return;

    try {
      globalLoadingStates.citiesDistricts.add(cityId);
      setIsLoadingDistricts(true);

      const response = await fetch('/data/cities_districts.json');
      if (response.ok) {
        const allDistricts = await response.json();
        // Cache all districts at once for efficiency
        Object.assign(globalLocationCache.citiesDistricts, allDistricts);
        setCitiesDistricts(prev => ({ ...prev, ...allDistricts }));
      }
    } catch (error) {
      // Silently handle error
      globalLocationCache.citiesDistricts[cityId] = [];
      setCitiesDistricts(prev => ({ ...prev, [cityId]: [] }));
    } finally {
      globalLoadingStates.citiesDistricts.delete(cityId);
      setIsLoadingDistricts(false);
    }
  }, []);

  // Load wards data for a specific district
  const loadWards = useCallback(async (districtId: string) => {
    if (globalLocationCache.districtWards[districtId] || globalLoadingStates.districtWards.has(districtId)) return;

    try {
      globalLoadingStates.districtWards.add(districtId);
      setIsLoadingWards(true);

      const response = await fetch('/data/districts_wards.json');
      if (response.ok) {
        const allWards = await response.json();
        // Cache all wards at once for efficiency
        Object.assign(globalLocationCache.districtWards, allWards);
        setDistrictWards(prev => ({ ...prev, ...allWards }));
      }
    } catch (error) {
      // Silently handle error
      globalLocationCache.districtWards[districtId] = [];
      setDistrictWards(prev => ({ ...prev, [districtId]: [] }));
    } finally {
      globalLoadingStates.districtWards.delete(districtId);
      setIsLoadingWards(false);
    }
  }, []);

  // Load streets data for a specific district
  const loadStreets = useCallback(async (districtId: string) => {
    if (globalLocationCache.districtStreets[districtId] || globalLoadingStates.districtStreets.has(districtId)) return;

    try {
      globalLoadingStates.districtStreets.add(districtId);
      setIsLoadingStreets(true);

      const response = await fetch('/data/districts_streets.json');
      if (response.ok) {
        const allStreets = await response.json();
        // Cache all streets at once for efficiency
        Object.assign(globalLocationCache.districtStreets, allStreets);
        setDistrictStreets(prev => ({ ...prev, ...allStreets }));
      }
    } catch (error) {
      // Silently handle error
      globalLocationCache.districtStreets[districtId] = [];
      setDistrictStreets(prev => ({ ...prev, [districtId]: [] }));
    } finally {
      globalLoadingStates.districtStreets.delete(districtId);
      setIsLoadingStreets(false);
    }
  }, []);

  // Don't auto-load cities - wait for actual usage

  const contextValue: LocationContextType = {
    cities,
    citiesDistricts,
    districtWards,
    districtStreets,
    isLoadingCities,
    isLoadingDistricts,
    isLoadingWards,
    isLoadingStreets,
    loadCities,
    loadDistricts,
    loadWards,
    loadStreets,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook to use location context
export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

// Hook specifically for location picker components
export function useLocationPicker() {
  const context = useLocationContext();

  // Auto-load districts when city changes
  const loadDistrictsForCity = useCallback((cityId: string | number | undefined) => {
    if (cityId) {
      context.loadDistricts(cityId.toString());
    }
  }, [context]);

  // Auto-load wards when district changes
  const loadWardsForDistrict = useCallback((districtId: string | number | undefined) => {
    if (districtId) {
      context.loadWards(districtId.toString());
    }
  }, [context]);

  // Auto-load streets when district changes
  const loadStreetsForDistrict = useCallback((districtId: string | number | undefined) => {
    if (districtId) {
      context.loadStreets(districtId.toString());
    }
  }, [context]);

  return {
    ...context,
    loadDistrictsForCity,
    loadWardsForDistrict,
    loadStreetsForDistrict,
  };
}
