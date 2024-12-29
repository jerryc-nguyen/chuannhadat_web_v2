export const shortenLocationName = (string?: string) => {
  if (!string) {
    return undefined;
  }

  return string.replace('Hồ Chí Minh', 'HCM').
    replace('Bà Rịa Vũng Tàu', 'BR-VT').
    replace('Thừa Thiên Huế', 'Huế')
}
