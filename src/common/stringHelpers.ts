export const shortenLocationName = (string?: string) => {
  if (!string) {
    return undefined;
  }

  return string.replace('Hồ Chí Minh', 'HCM').
    replace('Bà Rịa Vũng Tàu', 'BR-VT').
    replace('Thừa Thiên Huế', 'Huế')
}

export const formatRealEstateText = (text: string): string => {
  if (!text) return '';

  // Check if we're in the browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // First convert newlines to br tags, then decode HTML entities
    const textWithBr = text
      .replace(/\r\n/g, '\n') // Normalize Windows line endings
      .replace(/\r/g, '\n') // Normalize Mac line endings
      .replace(/\n/g, '<br/>'); // Convert newlines to br tags

    // Use browser's built-in HTML entity decoder
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textWithBr;

    // Get the HTML with entities decoded but tags preserved
    return tempDiv.innerHTML
      .replace(/<br\s*\/?>/gi, '<br/>') // Normalize all br tags
      .trim();
  }

  // Fallback for server-side rendering
  return text
    .replace(/\r\n/g, '\n') // Normalize Windows line endings
    .replace(/\r/g, '\n') // Normalize Mac line endings
    .replace(/\n/g, '<br/>') // Convert newlines to br tags
    .replace(/<br\s*\/?>/gi, '<br/>') // Normalize all br tags
    .replace(/&amp;/g, '&') // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
}
