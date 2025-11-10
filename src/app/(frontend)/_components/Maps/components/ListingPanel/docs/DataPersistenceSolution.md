# Data Persistence Solution for ListingPanel

## Problem

When users interact with the map (pan, zoom, filter), the listing panel would show a jarring "empty state" while new data loaded. This created a poor user experience with content blinking and layout shifts.

## Solution: Progressive Data Loading with Local State Management

### Before (Standard React Query Behavior)

```typescript
// React Query replaces data immediately when new query executes
const { data: response, isLoading, error } = useLocationListing(params);

// UI shows loading state, then empty, then new data
if (isLoading) return <LoadingComponent />;
if (error) return <ErrorComponent />;
return <DataComponent data={response} />;
```

**Issues:**

- Old data disappears immediately when new query starts
- Users see empty list during API calls
- Jarring UI transitions
- Poor perceived performance

### After (Data Persistence Implementation)

#### 1. Local State for Display Data

```typescript
// Separate local state that persists across API calls
const [displayData, setDisplayData] = useState<{
  markers: Marker[];
  pagination: IPagination | null;
  locationTitle: string | null;
} | null>(null);
```

#### 2. Smart Data Updates

```typescript
// Only update display data when new data successfully arrives
useEffect(() => {
  if (response && !isFetching) {
    // Extract data from response
    const markers = (responseData?.results as Marker[]) || [];
    const pagination = responseData?.pagination as IPagination | null;
    const locationTitle = responseData?.location_title as string | null;

    // Update display state
    setDisplayData({ markers, pagination, locationTitle });
  }
}, [response, isFetching]);
```

#### 3. Progressive Loading States

```typescript
// Use displayData for rendering (keeps old data visible)
const markers = displayData?.markers || [];
const pagination = displayData?.pagination || null;

// Background updates - subtle overlay
{isFetching && displayData && (
  <div className="bg-white/60">Cập nhật...</div>
)}

// Initial load - full overlay
{isFetching && !displayData && (
  <div className="bg-white/90">Đang tải...</div>
)}
```

## Architecture

### Data Flow

```
React Query (API) → Local State (Display) → UI Components
     ↓                    ↓                    ↓
  Raw API data    →   Processed display data →  Rendered UI
  (replaces)           (persists)              (smooth)
```

### State Management Layers

1. **React Query**: Handles API calls, caching, background updates
2. **Local Component State**: Manages what data is displayed to user
3. **UI State**: Loading overlays, error states, user interactions

## Benefits

### User Experience

- ✅ **No Content Blinking**: Old data stays visible during updates
- ✅ **Progressive Loading**: Different states for initial vs background loads
- ✅ **Smooth Transitions**: Seamless data updates
- ✅ **Error Resilience**: Keeps old data visible even on API errors

### Technical Benefits

- ✅ **Performance**: React Query caching still works
- ✅ **Reliability**: Graceful error handling
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Flexibility**: Easy to extend with more loading states

## Is This a Standard Solution?

**Yes, this is a standard and recommended pattern** for handling data persistence in React applications:

### Why Standard?

1. **Separation of Concerns**: API logic (React Query) vs UI logic (component state)
2. **Optimistic Updates**: Show old data while fetching new data
3. **Progressive Enhancement**: Start with basic loading, enhance with persistence
4. **Error Boundaries**: Keep working data visible during failures

### Similar Patterns Used In:

- **Social Media Feeds**: Keep posts visible while loading new ones
- **Search Results**: Show previous results while searching
- **Infinite Scroll**: Keep existing items while loading more
- **Real-time Updates**: Show stale data during live updates

### Alternatives Considered:

- **React Query `keepPreviousData`**: Not available in current version
- **Optimistic Updates**: Complex for map bounds changes
- **Global State**: Overkill for component-specific display logic

## Implementation Checklist

- [x] Local state for display data persistence
- [x] Progressive loading overlays (initial vs background)
- [x] Error handling that preserves old data
- [x] React Query caching configuration
- [x] Smooth transitions between states
- [x] Proper cleanup and memory management

## Usage Examples

### Basic Implementation

```typescript
const { data, isFetching } = useQuery(key, fetcher);
const [displayData, setDisplayData] = useState(null);

useEffect(() => {
  if (data && !isFetching) {
    setDisplayData(data);
  }
}, [data, isFetching]);
```

### Advanced Loading States

```typescript
// Initial load
{isFetching && !displayData && <FullLoadingOverlay />}

// Background updates
{isFetching && displayData && <SubtleLoadingOverlay />}

// Error with data
{error && displayData && <ErrorBanner />}

// Complete error
{error && !displayData && <FullErrorState />}
```

This solution provides excellent UX while maintaining clean, maintainable code architecture.
