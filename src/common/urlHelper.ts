import { isBlank } from "@common/utils";

/**
 * Build a full URL with query parameters.
 * @param baseUrl - Base URL (with or without existing query params).
 * @param params - Key-value pairs for query parameters.
 * @param mergeExisting - Whether to merge existing query params from baseUrl.
 * @returns The full URL with encoded query string.
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined> = {},
  mergeExisting = false,
  origin?: string
): string {
  const urlOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = new URL(baseUrl, origin || urlOrigin);

  if (mergeExisting) {
    const existingParams = new URLSearchParams(url.search);
    existingParams.forEach((value, key) => {
      if (!(key in params)) url.searchParams.set(key, value);
    });
  }

  Object.entries(params).forEach(([key, value]) => {
    if (isBlank(value)) return;

    if (Array.isArray(value)) {
      url.searchParams.set(key, value.join(','));
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Build a query string from a search params-like object.
 * Accepts values as strings, arrays of strings, or undefined.
 */
export function buildQueryString(params: Record<string, string | string[] | undefined> = {}): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, String(v)));
    } else if (value !== undefined) {
      usp.append(key, String(value));
    }
  });
  return usp.toString();
}

/**
 * Build a path string from a slug value (string or string[]).
 * Optionally accepts a prefix (e.g., 'profile') to be inserted after root.
 */
export function slugToPath(slug: string | string[], prefix = ''): string {
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = prefix ? `/${prefix}/${slugStr}` : `/${slugStr}`;
  return path.replace(/\/+/g, '/');
}

/**
 * Build a path with query string from search params.
 */
export function buildPathWithQuery(
  path: string,
  searchParams: Record<string, string | string[] | undefined> = {}
): string {
  const qs = buildQueryString(searchParams);
  return qs ? `${path}?${qs}` : path;
}

/**
 * Resolve `path` and `pathWithQuery` from Next.js page props.
 * Accepts promised `params` and `searchParams` to avoid duplicate awaiting.
 * Optional `prefix` lets you build paths like `/profile/<slug>`.
 */
export async function resolvePathAndQueryFromProps(
  params: Promise<{ slug: string | string[] }>,
  searchParams?: Promise<Record<string, string | string[] | undefined>>,
  prefix = ''
): Promise<{
  path: string;
  pathWithQuery: string;
  slugStr: string;
  searchParamsObj: Record<string, string | string[] | undefined>;
  hasQueryString: boolean;
}> {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = slugToPath(slug, prefix);
  const searchParamsObj = (await searchParams) ?? {};
  const pathWithQuery = buildPathWithQuery(path, searchParamsObj);
  const hasQueryString = Object.keys(searchParamsObj).length > 0;
  return { path, pathWithQuery, slugStr, searchParamsObj, hasQueryString };
}
