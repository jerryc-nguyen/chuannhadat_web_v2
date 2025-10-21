// Constants for UI dimensions
export const SEARCH_BOX_WIDTH = 480;
export const SEARCH_BOX_PADDING = 16;
export const SEARCH_BOX_WIDTH_WITH_PADDING = SEARCH_BOX_WIDTH + SEARCH_BOX_PADDING * 2;
export const LISTING_PANEL_WIDTH = 400;
export const LISTING_PANEL_PADDING = 16;
export const LISTING_PANEL_WIDTH_WITH_PADDING = LISTING_PANEL_WIDTH + LISTING_PANEL_PADDING * 2;

// Z-index constants for layering components
// Hierarchy: Base (0-100) → Map internals (100-500) → Panels (1000-1500) → Controls (1500-2000) → Overlays (2000+)
export const Z_INDEX = {
  // Base layers (0-100)
  MAP: 0,
  STICKY_HEADER: 10,

  // Map internals (100-500) - override Leaflet defaults
  LEAFLET_TILE_PANE: 100,      // Instead of 200
  LEAFLET_OVERLAY_PANE: 200,   // Instead of 400
  LEAFLET_SHADOW_PANE: 300,    // Instead of 500
  LEAFLET_MARKER_PANE: 400,    // Instead of 600
  LEAFLET_POPUP_PANE: 500,     // Instead of 700

  // Panels and drawers (1000-1500)
  INFO_PANEL: 1200,
  LISTING_PANEL: 1100,

  // Map controls and UI (1500-2000) - above map internals
  MAP_CONTROLS: 1200,
  DESKTOP_DROPDOWN: 1200,

  // Dropdowns and overlays (2000+) - highest priority
  DROPDOWN: 2100,

  // Modal overlays (9000+) - above everything
  MODAL_OVERLAY: 9000,
} as const;
