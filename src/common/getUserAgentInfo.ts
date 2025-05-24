import { headers } from 'next/headers';
import { getSelectorsByUserAgent } from 'react-device-detect';

export const getUserAgentInfo = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('User-Agent') || '';
  return await getSelectorsByUserAgent(userAgent);
};
