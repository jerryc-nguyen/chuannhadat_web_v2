const oldCats: string[] = [
  "/category/"
]

export const hardcodeRedirectMapping: Record<string, string> = {
  'cho-thue-nha-hem-nha-rieng': 'cho-thue-nha-nguyen-can',
  'cho-thue-nha-mat-tien-nha-mat-pho-kinh-doanh-tot': 'cho-thue-nha-mat-tien-kinh-doanh',
}

export const redirectTokens = oldCats

export const isHardcodeRedirect = (path: string) => {
  if (!path) return false;
  return Object.keys(hardcodeRedirectMapping).some((key) => path.includes(key));
}

export const newHardcodeRedirectPath = (path: string) => {
  if (!path) return '';
  const key = Object.keys(hardcodeRedirectMapping).find((key) => path.includes(key));
  if (!key) return '';
  return path.replace(key, hardcodeRedirectMapping[key]);
}

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
