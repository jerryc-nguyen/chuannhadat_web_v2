export const shortenLocationName = (string?: string) => {
  if (!string) {
    return undefined;
  }

  return string.replace('Hồ Chí Minh', 'HCM').
    replace('Bà Rịa Vũng Tàu', 'BR-VT').
    replace('Thừa Thiên Huế', 'Huế')
}

export const formatRealEstateText = (text: string): string => {
  return text
    .replace(/❌❌/g, '\n❌❌')   // Line break before warning emojis
    .replace(/🔥🔥🔥/g, '\n🔥🔥🔥')  // Add line break before fire emojis
    .replace(/💥💥💥/g, '\n💥💥💥')
    .replace(/Chỉ /g, '\nChỉ ')
    .replace(/(?<=\d) tỷ/g, ' tỷ')  // Ensure space before "tỷ"
    .replace(/(?<=\d)m2/g, 'm2')    // Ensure spacing consistency
    .replace(/ - /g, '\n- ')        // Break line before location details
    .replace(/\+ /g, '\n+ ')
    .replace(/\. /g, '.\n')
    .replace(/\* /g, '\n *')
    .trim();
}
