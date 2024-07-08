import { getSelectorsByUserAgent } from 'react-device-detect';
import { headers } from 'next/headers';

export const getUserAgentInfo = () => {
  const headersList = headers();
  const userAgent = headersList.get('User-Agent') || '';
  return getSelectorsByUserAgent(userAgent);
};
