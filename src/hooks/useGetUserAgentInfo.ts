import { headers } from 'next/headers';
import { getSelectorsByUserAgent } from 'react-device-detect';

const useGetUserAgentInfo = () => {
  const headersList = headers();
  const userAgent = headersList.get('User-Agent') || '';
  return getSelectorsByUserAgent(userAgent);
};
export { useGetUserAgentInfo };
