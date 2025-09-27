# Code Examples: Before vs After Interface Update

## Real Code Comparison

### Desktop Component (location-form-v2.tsx)

#### Before Update

```typescript
// ❌ PROBLEM: TypeScript errors
const LocationFormV2: React.FC<any> = ({ form }) => {
  // This would cause TypeScript error!
  const { city, district, ward, street } = form.getValues(); // ❌ Properties don't exist

  // Had to use workarounds
  const city_id = form.watch('city_id');
  const [curCity, setCurCity] = useState({ value: city_id, text: '' }); // ❌ Empty text
};
```

#### After Update

```typescript
// ✅ SOLUTION: Clean, type-safe code
const LocationFormV2: React.FC<any> = ({ form }) => {
  // Now works perfectly with TypeScript
  const { city, district, ward, street } = form.getValues(); // ✅ Fully typed

  // Direct initialization with complete data
  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(
    city?.value ? city : undefined, // ✅ Has both value and text
  );
};
```

### Mobile Component (LocationField.tsx)

#### Before Update

```typescript
// ❌ PROBLEM: Inconsistent with desktop
export default function LocationField({ form, ... }: LocationFieldProps) {
  // Could only use IDs
  const city_id = form.watch('city_id');

  // Manual state management with empty text
  const [cityOption, setCityOption] = useState({ value: city_id, text: '' });

  // Complex workaround to populate text
  useEffect(() => {
    if (city_id && !cityOption?.value) {
      setCityOption({ value: city_id, text: '' }); // Still empty!
    }
  }, [city_id]);
}
```

#### After Update

```typescript
// ✅ SOLUTION: Consistent with desktop
export default function LocationField({ form, ... }: LocationFieldProps) {
  // Same pattern as desktop
  const { city, district, ward, street } = form.getValues();

  // Direct initialization with complete data
  const [cityOption, setCityOption] = useState<OptionForSelect | undefined>(
    city?.value ? city : initialCityOption  // ✅ Complete object with text
  );

  // Watch complete objects (like desktop)
  const watchedCity = form.watch('city');

  // Update when form changes
  useEffect(() => {
    if (watchedCity?.value) {
      setCityOption(watchedCity); // ✅ Complete object
    }
  }, [watchedCity]);
}
```

## Form Handling Comparison

### Setting Form Values

#### Before Update

```typescript
// ❌ INCONSISTENT: Different patterns
// Desktop
const onSelectCity = (city?: OptionForSelect) => {
  form.setValue('city', city); // ❌ TypeScript error!
  form.setValue('city_id', city?.value);
};

// Mobile
const handleChangeCity = (city?: OptionForSelect) => {
  form.setValue('city_id', city?.value || ''); // ✅ Works but incomplete
  // ❌ Can't set complete object - interface doesn't support it
};
```

#### After Update

```typescript
// ✅ CONSISTENT: Same pattern everywhere
// Both Desktop and Mobile
const onSelectCity = (city?: OptionForSelect) => {
  form.setValue('city_id', city?.value || ''); // For backend
  form.setValue('city', city); // For UI display
};
```

## Server Response Handling

### Data Population on Edit

#### Before Update

```typescript
// ❌ PROBLEM: Server data couldn't be used directly
// Server returns: { city: { value: 58, text: "Điện Biên" } }

// Desktop: Worked by accident (using any type)
const { city } = form.getValues(); // ❌ TypeScript error but runtime worked

// Mobile: Couldn't use server data
const city_id = form.getValues().city_id; // ✅ Only ID available
// ❌ Lost the text "Điện Biên" - had to fetch separately
```

#### After Update

```typescript
// ✅ SOLUTION: Direct usage of server data
// Server returns: { city: { value: 58, text: "Điện Biên" } }

// Both Desktop and Mobile: Perfect integration
const { city, district, ward, street } = form.getValues(); // ✅ Complete objects

// Immediate display with proper text
setCityOption(city); // Shows "Điện Biên" immediately
```

## TypeScript Benefits

### Type Safety

#### Before Update

```typescript
// ❌ RUNTIME ERRORS POSSIBLE
interface IPostForm {
  city_id?: number | string;
  // Missing: city?: OptionForSelect;
}

// This compiles but fails at runtime
const cityText = form.getValues().city?.text; // ❌ undefined
```

#### After Update

```typescript
// ✅ COMPILE-TIME SAFETY
interface IPostForm {
  city_id?: number | string;
  city?: OptionForSelect; // ✅ Explicitly defined
}

// TypeScript catches errors early
const cityText = form.getValues().city?.text; // ✅ Fully typed
```

### Developer Experience

#### Before Update

```typescript
// ❌ NO AUTOCOMPLETE
form.getValues().city; // ❌ TypeScript doesn't know about 'city'
```

#### After Update

```typescript
// ✅ FULL AUTOCOMPLETE
form.getValues().city?.  // ✅ TypeScript suggests: value, text, etc.
```

## Code Complexity Reduction

### Component Logic

#### Before Update

```typescript
// ❌ COMPLEX: Multiple data sources and transformations
const LocationField = ({ form }) => {
  const city_id = form.watch('city_id');
  const [cityOption, setCityOption] = useState({ value: '', text: '' });

  // Complex logic to sync ID with text
  useEffect(() => {
    if (city_id) {
      // Need to find city in global list
      const foundCity = cities.find((c) => c.value === city_id);
      if (foundCity) {
        setCityOption(foundCity);
      } else {
        // Fallback to ID only
        setCityOption({ value: city_id, text: '' });
      }
    }
  }, [city_id, cities]); // Multiple dependencies

  // More complex logic for updates...
};
```

#### After Update

```typescript
// ✅ SIMPLE: Direct data usage
const LocationField = ({ form }) => {
  const { city } = form.getValues();

  // Simple initialization
  const [cityOption, setCityOption] = useState(city);

  // Simple updates
  const watchedCity = form.watch('city');
  useEffect(() => {
    if (watchedCity?.value) {
      setCityOption(watchedCity);
    }
  }, [watchedCity]); // Single dependency
};
```

## Maintenance Benefits

### Adding New Location Field

#### Before Update

```typescript
// ❌ MULTIPLE CHANGES NEEDED
// 1. Update interface
interface IPostForm {
  region_id?: string; // Add ID only
}

// 2. Update desktop component (different pattern)
const region = form.watch('region'); // ❌ TypeScript error

// 3. Update mobile component (different pattern)
const region_id = form.watch('region_id'); // Different approach

// 4. Handle inconsistencies between platforms
```

#### After Update

```typescript
// ✅ SINGLE CHANGE
// 1. Update interface
interface IPostForm {
  region_id?: string;
  region?: OptionForSelect; // Complete object
}

// 2. All components work automatically
const { region } = form.getValues(); // ✅ Works everywhere
```

## Performance Comparison

### Initial Load

#### Before Update

```typescript
// ❌ MULTIPLE REQUESTS
// 1. Load post data (IDs only)
const postData = await api.getPost(id); // { city_id: 58 }

// 2. Load location data separately
const cities = await api.getCities();

// 3. Match and populate
const city = cities.find((c) => c.value === postData.city_id);
```

#### After Update

```typescript
// ✅ SINGLE REQUEST
// 1. Load complete post data
const postData = await api.getPost(id);
// {
//   city_id: 58,
//   city: { value: 58, text: "Điện Biên" }
// }

// 2. Ready to use immediately!
form.reset(postData);
```

This comparison clearly shows how the interface update transforms complex, error-prone code into simple, maintainable, and type-safe solutions.
