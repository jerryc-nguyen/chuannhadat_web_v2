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

  // Panels and drawers (1000-1500)
  INFO_PANEL: 40,
  LISTING_PANEL: 40,

  // Map controls and UI (1500-2000) - above map internals
  MAP_CONTROLS: 40,
  DESKTOP_DROPDOWN: 40,

  // Dropdowns and overlays (2000+) - highest priority
  DROPDOWN: 50,

} as const;
