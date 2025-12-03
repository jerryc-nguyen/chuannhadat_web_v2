export function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN')
}

export function formatNumberString(string: string): string {
  const number = parseInt(string.replace(/[^\d]/g, '') as string);
  return formatNumber(number);
}
