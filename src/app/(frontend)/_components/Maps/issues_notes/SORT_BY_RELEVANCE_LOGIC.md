# SortByRelevance Logic - Detailed Explanation

## Overview

The `sortByRelevance` function is a sophisticated text-matching algorithm that ranks autocomplete search results based on how well they match the user's search query. It uses a multi-tier priority system to ensure the most relevant results appear at the top of the dropdown.

## Core Algorithm Flow

### 1. Input Processing

```typescript
const sortByRelevance = useCallback((items: OptionForSelect[], query: string): OptionForSelect[] => {
  const normalizedQuery = toSearchString(query);

  return [...items].sort((a, b) => {
    const textA = toSearchString(a.text || '');
    const textB = toSearchString(b.text || '');
```

**What happens here:**

- Creates a copy of the items array to avoid mutating the original
- Normalizes the search query using `toSearchString`
- Normalizes each item's text using the same function
- Uses JavaScript's native `sort()` method with a custom comparator

## Text Normalization (`toSearchString`)

Before any comparison, both the query and result texts undergo normalization:

### Vietnamese Character Mapping

```typescript
// Lowercase Vietnamese characters
.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
.replace(/[èéẹẻẽêềếệểễ]/g, 'e')
.replace(/[ìíịỉĩ]/g, 'i')
.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
.replace(/[ùúụủũưừứựửữ]/g, 'u')
.replace(/[ỳýỵỷỹ]/g, 'y')
.replace(/[đ]/g, 'd')

// Uppercase Vietnamese characters (converted to lowercase equivalents)
.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A') // → 'a'
.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')           // → 'e'
// ... etc
```

### Diacritical Mark Removal

```typescript
.replace(/[\u0300]/g, '')  // Grave accent (à)
.replace(/[\u0301]/g, '')  // Acute accent (á)
.replace(/[\u0302]/g, '')  // Circumflex (â)
.replace(/[\u0303]/g, '')  // Tilde (ã)
.replace(/[\u0306]/g, '')  // Breve (ă)
.replace(/[\u0309]/g, '')  // Hook above (ả)
.replace(/[\u0323]/g, '')  // Dot below (ạ)
.replace(/[\u031B]/g, '')  // Horn (ơ)
```

### Text Cleaning

```typescript
.replace(/_/g, ' ')         // Convert underscores to spaces
.replace(/\s+/g, ' ')       // "Squish" multiple whitespace to single space
.toLowerCase()              // Convert to lowercase
.trim()                     // Remove leading/trailing whitespace
```

## Sorting Priority System

The algorithm uses a **hierarchical comparison system** with three distinct priority levels:

### Priority Level 1: Exact Match (Highest Priority)

```typescript
const exactMatchA = textA === normalizedQuery;
const exactMatchB = textB === normalizedQuery;
if (exactMatchA && !exactMatchB) return -1; // A comes first
if (!exactMatchA && exactMatchB) return 1; // B comes first
```

**Examples:**

- Query: "ho chi minh"
- "ho chi minh" (exact match) → **TOP**
- "Ho Chi Minh City" (partial match) → **Lower**

### Priority Level 2: Starts With Query (Medium Priority)

```typescript
const startsWithA = textA.startsWith(normalizedQuery);
const startsWithB = textB.startsWith(normalizedQuery);
if (startsWithA && !startsWithB) return -1;
if (!startsWithA && startsWithB) return 1;
```

**Examples:**

- Query: "ho chi"
- "ho chi minh" (starts with) → **High**
- "ho chi minh city" (starts with) → **High**
- "district ho chi minh" (contains but doesn't start with) → **Lower**

### Priority Level 3: Contains Query (Lowest Priority)

```typescript
const containsA = textA.includes(normalizedQuery);
const containsB = textB.includes(normalizedQuery);
if (containsA && !containsB) return -1;
if (!containsA && containsB) return 1;
```

**Examples:**

- Query: "minh"
- "ho chi minh" (contains) → **Medium**
- "minh city" (starts with) → **Higher than contains**
- "saigon" (no match) → **Lowest**

## Comparator Logic Details

### Return Values in JavaScript Sort

- `return -1`: Item A comes before Item B (higher priority)
- `return 1`: Item B comes before Item A (higher priority)
- `return 0`: Items have equal priority (maintain original order)

### Hierarchical Decision Making

The algorithm checks priorities in strict order:

1. **First**: Check exact matches
2. **Only if no exact match winner**: Check "starts with" matches
3. **Only if no "starts with" winner**: Check "contains" matches
4. **If all checks pass**: Return 0 (maintain original order)

## Real-World Example

**User searches:** "hồ chí minh" (with Vietnamese accents)

**Normalization process:**

- Query: "hồ chí minh" → "ho chi minh"
- Result 1: "Hồ Chí Minh" → "ho chi minh"
- Result 2: "Ho Chi Minh City" → "ho chi minh city"
- Result 3: "Thành phố Hồ Chí Minh" → "thanh pho ho chi minh"

**Sorting results:**

1. **"Hồ Chí Minh"** (exact match after normalization) → **#1**
2. **"Ho Chi Minh City"** (starts with "ho chi minh") → **#2**
3. **"Thành phố Hồ Chí Minh"** (contains "ho chi minh") → **#3**

## Performance Considerations

### Time Complexity

- **O(n log n)** due to JavaScript's native sort algorithm
- **O(m)** for text normalization per item (where m is string length)
- **Total: O(n log n \* m)**

### Space Complexity

- **O(n)** for creating a copy of the items array
- **O(m)** temporary strings during normalization

### Optimizations

- Uses `useCallback` to memoize the function
- Normalization happens only once per item during sorting
- Early return on exact matches prevents unnecessary checks

## Integration Points

### Called From: `mergeWithRecentSearches`

```typescript
const sortedResults = sortByRelevance(combinedResults, searchQuery);
setResults(sortedResults);
```

### Dependencies

- `toSearchString` from `@common/stringHelpers`
- `useCallback` for performance optimization

## Edge Cases Handled

1. **Empty/null text**: Returns original text or empty string
2. **No matches**: All items return 0, maintaining original order
3. **Equal priority**: Maintains stable sort (original order preserved)
4. **Case sensitivity**: All text normalized to lowercase
5. **Vietnamese characters**: Comprehensive accent/diacritical mark removal
6. **Whitespace**: Normalized to single spaces

## Testing Scenarios

### Vietnamese Text Search

- Query: "hà nội" should match "Hà Nội", "Ha Noi", "HÀ NỘI"
- Should prioritize exact matches over partial matches

### Mixed Content Types

- Recent searches + API results sorted together
- Maintains result type icons while reordering by relevance

### Boundary Cases

- Empty query: No sorting applied
- Single character queries: Broad matching
- Very long queries: Exact matching prioritized
