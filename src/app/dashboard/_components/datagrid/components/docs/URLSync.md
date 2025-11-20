# Lodash `merge` — When to Use (and with URL Sync)

Use lodash `merge` when you need to deep‑combine two objects where:

- You want to preserve existing keys/values from a “base” object and selectively override with a “payload”.
- You have nested structures (e.g., a `filters` object) and need deep merging rather than a shallow assignment.
- You’re composing state from multiple sources (e.g., current URL params + new filter/page data) and prefer a single, predictable merge step.

Good use cases in this codebase:

- Building the next query string: merge current `searchParams` (as `prev`) with a new sync payload (`obj`), then stringify.
- Combining `submittedFilters` (stable snapshot) with transient UI state (pagination) for the URL sync layer.
- Merging default filter values with values restored from the URL on initial load.

Example (deep merge for URL building):

```ts
import { merge } from 'lodash-es';

const prev = { page: '2', filters: { city: 'hcm', price_min: 100 } };
const obj = { filters: { price_min: 200, price_max: 500 }, per_page: 20 };

// Deep merge: nested filters are combined
const next = merge({}, prev, obj);
// next = { page: '2', per_page: 20, filters: { city: 'hcm', price_min: 200, price_max: 500 } }
```

Important gotchas:

- Omitting a key in `obj` does NOT remove the key from `prev` — the value persists.
- `undefined` values on the right side are ignored; they won’t overwrite `prev`.
- Arrays are merged index‑wise; if you intend to replace or union arrays, use a custom strategy (`mergeWith`) or helpers like `concat`/`union` first.

Alternatives:

- `Object.assign` or spread (`{...a, ...b}`) for shallow merges.
- `mergeWith` for custom merge behavior (e.g., removing keys, array replacement).
- `omit` / `pick` to shape the payload before a merge.

# URL Sync – lodash `merge` behavior and the fix

This note documents why removing a key from the object you pass to the URL sync helper may not remove it from the actual URL, and shows the robust fix.

## Context

- The URL sync utility composes the next query string by merging the current URL params with a payload object:
  - `objectToQueryString(obj, currentSearch)` → `merge(prev, obj)` then `removeEmpty(...)` then `stringify(...)`.
- `prev` is derived from the current browser URL query params.

## The Problem

- If a key exists in `prev` (the current URL), and you simply omit that key from `obj`, the merge keeps the existing value. The key remains in the URL.
- Attempting to override a key by setting it to `undefined` won’t work either: lodash `merge` ignores `undefined` values on the right-hand side.

Example symptoms:

- `page=1` persists in the URL even when you try to “exclude” it from the sync payload.

## Why `undefined` didn’t work

- lodash `merge(prev, obj)` treats `undefined` as “no change”, so `prev.page` survives the merge.
- Only values that explicitly overwrite (e.g., `null`, empty string, or different primitives) will replace the previous value.

## The Fix: overwrite with `null` and rely on `removeEmpty`

- Before calling `useSyncQueryToUrl`, build a payload that sets unwanted keys to `null` when you want them removed. `removeEmpty` drops `null` keys after the merge.

### Reference implementation (controller)

```ts
// Build pagination payload for URL
const paginationParam: Record<string, number> = {
  page: pagination.pageIndex + 1,
  per_page: pagination.pageSize,
};

// Compose the object to sync to URL
const syncObject: Record<string, any> = { ...submittedFilters, ...paginationParam };

// Hide page when it’s the default (1)
if (paginationParam.page === 1) {
  // Use null (not undefined) so merge overwrites existing value and removeEmpty drops it
  syncObject.page = null;
}

// Push to URL (other excludes still apply)
useSyncQueryToUrl(syncObject, EXCLUDE_FIELDS_TO_URL);
```

### Optional: conditionally hide `per_page`

If you have a default page size and want to hide it when unchanged:

```ts
if (paginationParam.per_page === 20) {
  syncObject.per_page = null;
}
```

## Guidance

- Separate concerns: keep `submittedFilters` for server-side filtering, and add `paginationParam` only to the URL sync payload.
- Use `null` to explicitly clear a param in the URL; avoid `undefined` for this purpose with lodash `merge`.
- Continue using the `excludeFields` list (e.g., `EXCLUDE_FIELDS_TO_URL`) to drop fields you never want in the URL.

## Troubleshooting

- If a param persists in the URL:
  - Confirm you’re overwriting it with `null` in the sync payload.
  - Verify you call `useSyncQueryToUrl(syncObject, EXCLUDE_FIELDS_TO_URL)` after composing the payload.
  - Check for string values like `'1'` being read from `prev` and ensure the overwrite happens before stringify.
