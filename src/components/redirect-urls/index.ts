const oldCats: string[] = [
  "/category/"
]

export const redirectTokens = oldCats

export const isOldLegacyCats = (path: string) => {
  if (!path) return false;
  // Ruby: return false if path.include?('/category/')
  if (path.includes('/category/')) return false;

  // Ruby patterns:
  // -c\d+(?:/|$), -d\d+(?:/|$), -w\d+(?:/|$), -st\d+(?:/|$)
  const patterns = [
    /-c\d+(?:\/|$)/i,
    /-d\d+(?:\/|$)/i,
    /-w\d+(?:\/|$)/i,
    /-st\d+(?:\/|$)/i,
    /-pj\d+(?:\/|$)/i,
  ];

  return patterns.some((re) => re.test(path));
}
export const shouldRedirect = (path: string) => {
  if (isOldLegacyCats(path)) return true;

  return redirectTokens.some((oldPath) => {
    const regex = new RegExp(`^${oldPath}`, 'gi');
    return regex.test(path)
  })
}
