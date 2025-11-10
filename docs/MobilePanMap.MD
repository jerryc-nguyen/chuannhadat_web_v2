# Mobile Map Panning Logic

## Overview

The mobile map panning logic ensures that markers remain visible above the bottom sheet when the info panel is displayed. Unlike desktop which has side panels, mobile uses a bottom sheet that covers the lower portion of the screen.

## Key Concepts

### Screen Coordinate System

- **Origin**: Top-left corner (0,0)
- **Y-axis**: Increases downward (higher Y = lower on screen)
- **X-axis**: Increases rightward

### Bottom Sheet Layout

- Bottom sheet typically occupies **40%** of screen height
- Visible map area is the **top 60%** of screen
- Target position is the **center of visible area**

## Panning Logic

### Step 1: Detect Bottom Sheet Collision

```typescript
const isInfoPanelShown = !!selectedMarker;

if (!isInfoPanelShown) {
  return false; // No collision if no bottom sheet
}

// Bottom sheet covers bottom 40% of screen
const windowHeight = window.innerHeight;
const bottomSheetHeight = windowHeight * 0.4;
const bottomSheetTop = windowHeight - bottomSheetHeight;

// Check if marker is in bottom sheet area
const markerPoint = map.latLngToContainerPoint([location.lat, location.lon]);
const isBehindBottomSheet = markerPoint.y > bottomSheetTop;
```

### Step 2: Calculate Target Position

When a marker is behind the bottom sheet, calculate where it should be positioned:

```typescript
// Define visible area boundaries
const visibleAreaTop = windowHeight - bottomSheetHeight; // Top of visible area

// Target: center of visible area above bottom sheet
const targetScreenY = visibleAreaTop / 2;
```

**Visual representation:**

```
┌─────────────────────────────────┐ Screen Height: 1000px
│                                 │
│        Visible Area             │ Visible Area Top: 600px
│        (60% of screen)          │ Target Y: 300px (center)
├─────────────────────────────────┤ Bottom Sheet Top: 600px
│                                 │
│      Bottom Sheet               │ Bottom Sheet Height: 400px
│      (40% of screen)            │ (covered area)
└─────────────────────────────────┘
```

### Step 3: Calculate Pan Offset

To move the marker from its current position to the target position:

```typescript
// Get current marker position
const markerPoint = map.latLngToContainerPoint([location.lat, location.lon]);

// Calculate required pan amount
const yOffset = markerPoint.y - targetScreenY;
```

**Example:**

- Screen height: 1000px
- Bottom sheet: 400px (40%)
- Visible area top: 600px
- Target Y: 300px (center of visible area)
- Marker at Y: 800px (behind bottom sheet)
- `yOffset = 800 - 300 = 500` (positive = pan down)

### Step 4: Execute Pan

```typescript
// Pan the map down to move markers up on screen
map.panBy([0, yOffset], {
  animate: true,
  duration: 0.5,
});
```

## PanBy Behavior

In Leaflet, `panBy(dx, dy)` moves the map center by the specified pixel amounts:

- **`panBy(0, 100)`**: Moves map center **down** by 100px
- **Result**: All markers appear to move **up** by 100px on screen

**Direction Logic:**

- If marker is **below** target (higher Y): `yOffset > 0`
- Pan **down** (`panBy(0, positive)`) → markers move **up**
- Marker moves from Y=800 to Y=300 ✓

## Edge Cases

### Marker Above Target

- `markerPoint.y < targetScreenY`
- `yOffset < 0` (negative)
- `panBy(0, negative)` → pan up → markers move down
- Moves marker toward center

### Marker Already in Visible Area

- No panning needed
- Falls back to normal `panToLocation`

### Bottom Sheet Not Shown

- `isInfoPanelShown = false`
- No collision detection
- Uses normal panning

## Configuration

### Bottom Sheet Height

```typescript
const bottomSheetHeight = windowHeight * 0.4; // 40% of screen height
```

**Adjustable**: Change the multiplier based on actual bottom sheet height.

### Target Position

```typescript
const targetScreenY = visibleAreaTop / 2; // Center of visible area
```

**Alternative**: Could position at `visibleAreaTop * 0.25` for higher placement.

## Debug Information

The hook provides detailed debug logs:

```
📱 Marker behind bottom sheet: {
  windowHeight: 1000,
  bottomSheetHeight: 400,
  visibleAreaTop: 600,
  targetScreenY: 300,
  markerScreenY: 800,
  yOffset: 500,
  panBy: [0, 500],
  action: 'pan down to move marker up'
}
```

## Integration

This logic is integrated into:

- `useMapPanningMobile.panToLocationSmart()` - Called when markers are selected
- `useMapMobileHook` - Handles marker click events
- Automatically triggers when bottom sheet opens with marker behind it

The implementation ensures markers are always visible when the mobile info panel is displayed.
