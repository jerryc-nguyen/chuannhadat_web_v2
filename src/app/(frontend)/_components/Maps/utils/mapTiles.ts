// Map tile layer configurations
// https://docs.maptiler.com/cloud/api/maps/#raster-xyz-tiles

// streets-v2, bright
export const MAP_TILES = {
  STREET_TILES: {
    url: 'https://api.maptiler.com/maps/dataviz/256/{z}/{x}/{y}.png?key=gpe5BRrqVAZQLV8W877W',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
    maxZoom: 22,
  },
  GOOGLE_SATELLITE: {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '© <a href="https://www.google.com/maps">Google Maps</a>',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
} as const;

export type MapTileType = keyof typeof MAP_TILES;

export const DEFAULT_TILE = 'STREET_TILES' as MapTileType;

// Zoom level threshold for switching between satellite and street view
export const SATELLITE_ZOOM_THRESHOLD = 13;

// Function to determine which tile to use based on zoom level
export const getTileTypeForZoom = (zoomLevel: number): MapTileType => {
  return zoomLevel <= SATELLITE_ZOOM_THRESHOLD ? 'GOOGLE_SATELLITE' : 'STREET_TILES';
};
