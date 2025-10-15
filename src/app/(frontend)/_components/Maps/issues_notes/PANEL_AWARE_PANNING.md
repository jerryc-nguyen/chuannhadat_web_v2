# Panel-Aware Map Panning Issue & Solution

## 🎯 The Problem

When users interact with map markers (clicking from autocomplete, listing items, etc.), the markers would often appear behind UI panels, making them invisible or hard to see. The challenge was to implement intelligent panning that positions markers in the visible area of the map, accounting for different panel configurations.

## 🔍 Root Cause Analysis

### **The Core Challenge:**

Map panning typically centers markers in the middle of the viewport, but with UI panels overlaying the map, the "center" is not always the best position for visibility.

### **Panel Configurations:**

```
No Panels:           Single Panel:         Dual Panels:
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│                 │   │[Panel]│         │   │[Panel][Panel]│  │
│        ●        │   │       │    ●    │   │              │● │
│                 │   │       │         │   │              │  │
└─────────────────┘   └─────────────────┘   └─────────────────┘
   Center works         Center behind       Center behind
                       panel - bad!        panels - bad!
```

### **What We Needed:**

Smart panning that positions markers in the **visible area center**, not the **screen center**.

## 🛠️ The Solution: Panel-Aware Panning

### **Key Components:**

#### **1. Visible Area Calculation**

```typescript
const calculateVisibleAreaCenter = () => {
  const windowWidth = window.innerWidth;
  const isListingPanelShown = !!selectedLocation;
  const isInfoPanelShown = !!selectedMarker;
  const areBothPanelsShown = isListingPanelShown && isInfoPanelShown;
  const canShowBothPanels = windowWidth >= 1200;

  let visibleAreaCenterX = windowWidth / 2; // Default: screen center

  if (areBothPanelsShown && canShowBothPanels) {
    // Both panels: visible area starts after both panels
    const availableWidth = windowWidth - PANEL_WIDTH * 2;
    visibleAreaCenterX = PANEL_WIDTH * 2 + availableWidth / 2;
  } else if (isListingPanelShown || isInfoPanelShown) {
    // Single panel: visible area starts after one panel
    const availableWidth = windowWidth - PANEL_WIDTH;
    visibleAreaCenterX = PANEL_WIDTH + availableWidth / 2;
  }

  // Calculate offset from screen center to visible area center
  const screenCenterX = windowWidth / 2;
  const offsetX = visibleAreaCenterX - screenCenterX;

  return { x: offsetX, y: 0 };
};
```

#### **2. Smart Panning Logic (Refactored)**

The main `panToLocationSmart` function has been refactored into smaller, focused helper functions for better maintainability:

```typescript
// Main entry point - clean and focused
const panToLocationSmart = (location, options) => {
  // Validate inputs
  if (!validatePanningInputs(location)) return;

  // Prepare options
  const panOptions = { animate: true, duration: 0.5, ...options };

  // Route to appropriate handler based on bounds check
  const isInBounds = isMarkerInMapBounds(location);

  if (!isInBounds) {
    handleOutOfBoundsPanning(location, panOptions);
  } else {
    handleInBoundsPanning(location, panOptions);
  }
};

// Helper: Handle out-of-bounds markers
const handleOutOfBoundsPanning = (location, options) => {
  const pixelOffset = calculateVisibleAreaCenter();
  const targetMapCenter = calculateOptimalMapCenter(location, pixelOffset);

  // Pan to optimal position in one smooth motion
  map.panTo([targetMapCenter.lat, targetMapCenter.lon], options);
};

// Helper: Handle in-bounds markers
const handleInBoundsPanning = (location, options) => {
  const isBehindPanels = isMarkerBehindPanels(location);

  if (isBehindPanels) {
    const pixelOffset = calculateVisibleAreaCenter();
    map.panBy([-pixelOffset.x, -pixelOffset.y], options);
  }
};

// Helper: Calculate optimal map center for out-of-bounds markers
const calculateOptimalMapCenter = (location, pixelOffset) => {
  if (pixelOffset.x === 0 && pixelOffset.y === 0) return location;

  // Convert pixel offset to coordinate offset
  const currentCenter = map.getCenter();
  const currentCenterPoint = map.latLngToContainerPoint([currentCenter.lat, currentCenter.lng]);

  const adjustedCenterPoint = {
    x: currentCenterPoint.x - pixelOffset.x,
    y: currentCenterPoint.y - pixelOffset.y,
  };

  const adjustedCenter = map.containerPointToLatLng([adjustedCenterPoint.x, adjustedCenterPoint.y]);
  const latOffset = adjustedCenter.lat - currentCenter.lat;
  const lonOffset = adjustedCenter.lng - currentCenter.lng;

  return {
    lat: location.lat + latOffset,
    lon: location.lon + lonOffset,
  };
};

// Helper: Input validation
const validatePanningInputs = (location) => {
  if (!map) return false;
  const { lat, lon } = location;
  return typeof lat === 'number' && typeof lon === 'number';
};
```

## 🎯 How Panel-Aware Panning Works

### **Step 1: Calculate Visible Area**

#### **Example: 1462px Screen with Dual Panels**

```
Screen Layout:
├─ ListingPanel: 0px → 512px
├─ InfoPanel: 512px → 1024px
├─ Visible Area: 1024px → 1462px (438px wide)
└─ Visible Center: 1024px + 219px = 1243px

Calculation:
- Screen Center: 1462px ÷ 2 = 731px
- Visible Area Center: 1243px
- Offset: 1243px - 731px = +512px
```

**Meaning**: Marker should appear **512px to the right** of screen center to be in the visible area center.

#### **Example: 1462px Screen with Single Panel**

```
Screen Layout:
├─ Panel: 0px → 512px
├─ Visible Area: 512px → 1462px (950px wide)
└─ Visible Center: 512px + 475px = 987px

Calculation:
- Screen Center: 731px
- Visible Area Center: 987px
- Offset: 987px - 731px = +256px
```

**Meaning**: Marker should appear **256px to the right** of screen center.

### **Step 2: Apply Offset Logic**

#### **Case A: Marker Out of Bounds**

```typescript
// Goal: Position map so marker appears at visible area center
// Method: Calculate optimal map center position

// 1. Get pixel offset for visible area
const offset = { x: 256, y: 0 }; // Marker should be 256px right of center

// 2. Convert to coordinate offset
const currentCenter = map.getCenter(); // Current map center
const currentCenterPoint = map.latLngToContainerPoint([currentCenter.lat, currentCenter.lng]);

// 3. Apply offset in OPPOSITE direction (move map center left to make marker appear right)
const adjustedCenterPoint = {
  x: currentCenterPoint.x - 256, // Move map center 256px LEFT
  y: currentCenterPoint.y,
};

// 4. Convert back to coordinates
const adjustedCenter = map.containerPointToLatLng([adjustedCenterPoint.x, adjustedCenterPoint.y]);
const latOffset = adjustedCenter.lat - currentCenter.lat;
const lonOffset = adjustedCenter.lng - currentCenter.lng;

// 5. Apply to target marker location
const targetMapCenter = {
  lat: markerLat + latOffset,
  lon: markerLon + lonOffset,
};

// 6. Pan to optimal position
map.panTo([targetMapCenter.lat, targetMapCenter.lon]);
```

**Result**: Marker appears exactly in the center of the visible area.

#### **Case B: Marker In Bounds Behind Panels**

```typescript
// Goal: Move marker from behind panel to visible area
// Method: Simple map pan by offset amount

const offset = { x: 256, y: 0 }; // Marker should move 256px right

// Pan map in OPPOSITE direction (move map left to make marker appear right)
map.panBy([-256, 0]); // Negative offset
```

**Result**: Marker slides from behind panel into visible area.

## 🧮 The Mathematics Behind Offset Calculation

### **Core Principle:**

To make a marker appear at position `X` on screen, the map center must be positioned such that when the marker is rendered, it appears at `X`.

### **The Relationship:**

```
Marker Screen Position = Map Center Position + Marker Offset from Map Center
```

### **To Position Marker at Desired Location:**

```
Desired Marker Position = Current Map Center + Required Map Center Adjustment
```

### **Therefore:**

```
Required Map Center Adjustment = Desired Marker Position - Current Map Center
Map Center Adjustment = -Marker Position Adjustment (opposite direction)
```

### **Example Calculation:**

```
Goal: Make marker appear 256px right of screen center
Current: Marker at screen center (0px offset)
Required: Move marker +256px right
Solution: Move map center -256px left
Result: Marker appears +256px right of center
```

## 🎯 Visual Examples

### **Example 1: Out of Bounds Marker with Single Panel**

#### **Before Panning:**

```
Map View: [Marker not visible - outside bounds]
Screen:   [Panel    |    Empty Area    ]
          0px      512px              1462px
```

#### **After Smart Panning:**

```
Map View: [Marker now visible in optimal position]
Screen:   [Panel    |    ● Marker     ]
          0px      512px   987px      1462px
                           ↑
                    Visible area center
```

### **Example 2: In Bounds Marker Behind Panel**

#### **Before Panning:**

```
Map View: [Marker visible but behind panel]
Screen:   [Panel ●  |    Empty Area    ]
          0px      512px              1462px
               ↑
          Marker hidden
```

#### **After Smart Panning:**

```
Map View: [Marker moved to visible area]
Screen:   [Panel    |    ● Marker     ]
          0px      512px   987px      1462px
                           ↑
                    Now visible
```

## 🔧 Implementation Details

### **Key Functions:**

#### **1. Core Helper Functions**

##### **`calculateVisibleAreaCenter()`**

- **Purpose**: Calculate where marker should appear on screen
- **Returns**: Pixel offset from screen center to visible area center
- **Logic**: Account for panel widths and responsive breakpoints

##### **`isMarkerInMapBounds()`**

- **Purpose**: Check if marker is currently visible on map
- **Returns**: Boolean indicating if marker is within current viewport
- **Logic**: Use Leaflet's `bounds.contains()` method

##### **`isMarkerBehindPanels()`**

- **Purpose**: Check if visible marker is behind UI panels
- **Returns**: Boolean indicating if marker is in panel coverage area
- **Logic**: Convert marker coordinates to screen pixels and check against panel widths

#### **2. Refactored Smart Panning Functions**

##### **`panToLocationSmart()` - Main Entry Point**

- **Purpose**: Clean, focused main function that routes to appropriate handlers
- **Logic**: Validate inputs → Check bounds → Route to specific handler
- **Benefits**: Single responsibility, easy to understand flow

##### **`validatePanningInputs()`**

- **Purpose**: Centralized input validation
- **Returns**: Boolean indicating if inputs are valid
- **Benefits**: Reusable validation logic, early error detection

##### **`handleOutOfBoundsPanning()`**

- **Purpose**: Handle markers that are outside the current map viewport
- **Logic**: Calculate optimal map center → Pan in one smooth motion
- **Benefits**: Focused on out-of-bounds case, clear separation of concerns

##### **`handleInBoundsPanning()`**

- **Purpose**: Handle markers that are within viewport but might be behind panels
- **Logic**: Check if behind panels → Apply offset if needed
- **Benefits**: Focused on in-bounds case, simple and clear

##### **`calculateOptimalMapCenter()`**

- **Purpose**: Calculate the optimal map center position for out-of-bounds markers
- **Returns**: Target map center coordinates
- **Benefits**: Pure function, testable, reusable coordinate calculation logic

#### **3. Refactoring Benefits**

##### **🧹 Code Cleanliness**

- **Single Responsibility**: Each function has one clear purpose
- **Readability**: Main function is now easy to understand at a glance
- **Maintainability**: Changes to specific logic are isolated to relevant functions

##### **🔧 Testability**

- **Pure Functions**: `calculateOptimalMapCenter` and `validatePanningInputs` are pure functions
- **Isolated Logic**: Each helper can be tested independently
- **Mocking**: Easier to mock specific parts of the panning logic

##### **🚀 Reusability**

- **Modular Design**: Helper functions can be reused in other contexts
- **Composability**: Functions can be combined in different ways
- **Extensibility**: Easy to add new panning strategies without touching existing code

##### **🐛 Debugging**

- **Clear Stack Traces**: Function names clearly indicate where issues occur
- **Focused Logging**: Each function can have its own specific logging
- **Isolated Testing**: Can test each piece of logic separately

### **Coordinate System Understanding:**

#### **Screen Coordinates (Pixels):**

```
(0,0) ────────────────── (windowWidth, 0)
  │                              │
  │     [Panel] │ Visible Area   │
  │             │                │
  │             │       ●        │ ← Marker at (x, y) pixels
  │             │                │
(0,windowHeight) ──────────────── (windowWidth, windowHeight)
```

#### **Map Coordinates (Lat/Lng):**

```
        North (higher lat)
             ↑
West ←──────────────→ East
(lower lng)    │    (higher lng)
             ↓
        South (lower lat)
```

#### **The Conversion:**

- `map.latLngToContainerPoint([lat, lng])` → Convert map coordinates to screen pixels
- `map.containerPointToLatLng([x, y])` → Convert screen pixels to map coordinates

## 🏆 Benefits of This Solution

### **1. Smooth User Experience:**

- ✅ **Single smooth animation** instead of jarring two-step movements
- ✅ **Predictable behavior** - markers always appear in optimal position
- ✅ **Responsive design** - adapts to different screen sizes and panel configurations

### **2. Intelligent Positioning:**

- ✅ **Context-aware** - considers current panel state
- ✅ **Optimal visibility** - markers never hidden behind panels
- ✅ **Efficient panning** - minimal map movement required

### **3. Robust Implementation:**

- ✅ **Handles all cases** - out of bounds, in bounds behind panels, already visible
- ✅ **Responsive breakpoints** - different logic for mobile vs desktop
- ✅ **Error handling** - graceful fallbacks for edge cases

## 🎓 Key Learnings

### **1. Coordinate System Mastery:**

Understanding the relationship between screen pixels and map coordinates is crucial for precise positioning.

### **2. Offset Direction Logic:**

To move a marker right on screen, you move the map left (opposite direction).

### **3. Panel-Aware UI Design:**

When UI elements overlay interactive content, positioning logic must account for the overlay areas.

### **4. Smooth Animation Principles:**

Single, calculated movements provide better UX than multiple sequential movements.

### **5. Responsive Considerations:**

Panel configurations change based on screen size, requiring adaptive logic.

## 🔍 Debugging Tips

### **Common Issues:**

#### **1. Wrong Offset Direction:**

```typescript
// ❌ WRONG: Moving in same direction as desired marker movement
map.panBy([offset.x, offset.y]);

// ✅ CORRECT: Moving in opposite direction
map.panBy([-offset.x, -offset.y]);
```

#### **2. Coordinate Conversion Errors:**

```typescript
// ❌ WRONG: Using out-of-bounds coordinates
const point = map.latLngToContainerPoint([outOfBoundsLat, outOfBoundsLng]);

// ✅ CORRECT: Using current map center as reference
const center = map.getCenter();
const centerPoint = map.latLngToContainerPoint([center.lat, center.lng]);
```

#### **3. Panel State Detection:**

```typescript
// ❌ WRONG: Hardcoded panel assumptions
const panelWidth = 512;

// ✅ CORRECT: Dynamic panel state detection
const isListingPanelShown = !!selectedLocation;
const isInfoPanelShown = !!selectedMarker;
```

### **Debug Logging:**

The `useMapPanningDesktop` hook includes a comprehensive debug logging system that can be easily controlled:

#### **Debug Control:**

```typescript
// Debug flag to control logging output
const DEBUG_MAP_PANNING = false; // Set to true to enable debug logs

// Debug helper functions
const debugLog = (message: string, data?: unknown) => {
  if (DEBUG_MAP_PANNING) {
    console.log(message, data || '');
  }
};

const debugWarn = (message: string, data?: unknown) => {
  if (DEBUG_MAP_PANNING) {
    console.warn(message, data || '');
  }
};
```

#### **Usage Examples:**

```typescript
// Visible area calculation logging
debugLog('🎯 Visible area calculation:', {
  windowWidth,
  screenCenterX,
  visibleAreaCenterX,
  offsetX,
  meaning: `marker should appear ${offsetX}px ${offsetX > 0 ? 'right' : 'left'} of screen center`,
});

// Bounds checking
debugLog('🗺️ Map bounds check:', {
  location,
  isInBounds: leafletResult,
  reason: leafletResult ? 'marker in bounds' : 'marker out of bounds',
});

// Panel collision detection
debugLog('🎯 Panel collision check:', {
  location,
  windowWidth,
  markerScreenX: markerPoint.x,
  panelCoverageWidth,
  isBehind,
  result: isBehind ? 'BEHIND PANELS' : 'VISIBLE',
});
```

#### **Debug Categories:**

- **🗺️ Map Operations**: Bounds checking, panning actions
- **🎯 Panel Logic**: Visible area calculations, collision detection
- **⚠️ Warnings**: Input validation, error conditions

#### **How to Enable Debug Logs:**

1. **Development**: Set `DEBUG_MAP_PANNING = true` in the file
2. **Production**: Keep `DEBUG_MAP_PANNING = false` to avoid console pollution
3. **Conditional**: Can be controlled by environment variables if needed

#### **Benefits:**

- **Zero Performance Impact**: When disabled, no function calls are made
- **Comprehensive Coverage**: All major operations are logged
- **Clear Categorization**: Emojis and prefixes make logs easy to filter
- **Detailed Context**: Each log includes relevant data for debugging

## 📚 Related Concepts

- **Viewport Management**: Understanding visible areas in web applications
- **Coordinate System Transformations**: Converting between different coordinate spaces
- **Responsive UI Design**: Adapting layouts based on screen size and content
- **Animation Principles**: Creating smooth, predictable user interactions
- **State-Driven UI**: Using application state to determine optimal positioning

This solution demonstrates how complex UI interactions can be broken down into mathematical relationships and implemented with clean, maintainable code.
