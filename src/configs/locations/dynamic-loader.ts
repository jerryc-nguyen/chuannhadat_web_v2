/**
 * Dynamic Location Data Loader
 * 
 * Progressively loads location data on-demand instead of bundling all 4MB upfront.
 * This can reduce initial bundle size by 4MB and improve PageSpeed significantly.
 */

// Types for location data
export interface City {
  id: string;
  name: string;
  slug?: string;
}

export interface District {
  id: string;
  name: string;
  cityId: string;
  slug?: string;
}

export interface Ward {
  id: string;
  name: string;
  districtId: string;
  slug?: string;
}

export interface Street {
  id: string;
  name: string;
  districtId: string;
  slug?: string;
}

export interface Project {
  id: string;
  name: string;
  districtId: string;
  slug?: string;
}

// Cache for loaded data
const cache = new Map<string, any>();

/**
 * Progressive Data Loader
 * Load data only when needed, cache results
 */
export class LocationDataLoader {

  // Always load cities (small - 3.2KB)
  static async getCities(): Promise<City[]> {
    if (cache.has('cities')) {
      return cache.get('cities');
    }

    try {
      // Dynamic import instead of static import
      const { default: cities } = await import('./cities.json');
      cache.set('cities', cities);
      return cities;
    } catch (error) {
      console.error('Failed to load cities:', error);
      return [];
    }
  }

  // Load districts only when a city is selected (49KB)
  static async getDistrictsByCity(cityId?: string): Promise<District[]> {
    const cacheKey = `districts_${cityId || 'all'}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const { default: citiesDistricts } = await import('./cities_districts.json');

      const districts = cityId
        ? citiesDistricts.filter((d: District) => d.cityId === cityId)
        : citiesDistricts;

      cache.set(cacheKey, districts);
      return districts;
    } catch (error) {
      console.error('Failed to load districts:', error);
      return [];
    }
  }

  // Load wards only when a district is selected (577KB)
  static async getWardsByDistrict(districtId?: string): Promise<Ward[]> {
    const cacheKey = `wards_${districtId || 'all'}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const { default: districtWards } = await import('./districts_wards.json');

      const wards = districtId
        ? districtWards.filter((w: Ward) => w.districtId === districtId)
        : districtWards;

      cache.set(cacheKey, wards);
      return wards;
    } catch (error) {
      console.error('Failed to load wards:', error);
      return [];
    }
  }

  // Load streets only when needed (998KB)
  static async getStreetsByDistrict(districtId?: string): Promise<Street[]> {
    const cacheKey = `streets_${districtId || 'all'}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const { default: districtStreets } = await import('./districts_streets.json');

      const streets = districtId
        ? districtStreets.filter((s: Street) => s.districtId === districtId)
        : districtStreets;

      cache.set(cacheKey, streets);
      return streets;
    } catch (error) {
      console.error('Failed to load streets:', error);
      return [];
    }
  }

  // Load projects only when needed (371KB)
  static async getProjectsByDistrict(districtId?: string): Promise<Project[]> {
    const cacheKey = `projects_${districtId || 'all'}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const { default: districtProjects } = await import('./districts_projects.json');

      const projects = districtId
        ? districtProjects.filter((p: Project) => p.districtId === districtId)
        : districtProjects;

      cache.set(cacheKey, projects);
      return projects;
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  // Load ward streets only when absolutely needed (1.9MB!)
  static async getWardStreets(wardId?: string): Promise<any[]> {
    const cacheKey = `ward_streets_${wardId || 'all'}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      // This is the biggest file - only load when really needed
      const { default: wardStreets } = await import('./districts_ward_streets.json');

      const data = wardId
        ? wardStreets.filter((ws: any) => ws.wardId === wardId)
        : wardStreets;

      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to load ward streets:', error);
      return [];
    }
  }

  // Clear cache if needed
  static clearCache() {
    cache.clear();
  }

  // Get cache size for debugging
  static getCacheInfo() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  }
}
