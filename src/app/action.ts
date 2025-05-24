'use server';

import { API_TOKEN_CIENT } from '@common/auth';
import { cookies } from 'next/headers';

// NOTE: These server-side cookie functions are no longer used.
// We've switched to client-side cookies only for authentication.
// Keeping them commented for reference in case we need them in the future.

// Instead, provide a way to check if the user is logged in on the server side
// by looking at the client cookie that will be sent with the request
export const checkIsLoggedInServer = async () => {
  'use server';
  // This will check for the client cookie that gets sent to the server with requests
  const cookieStore = await cookies();
  return !!cookieStore.get(API_TOKEN_CIENT);
};

export const getCookieServer = async (name: string): Promise<string | undefined> => {
  'use server';
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};
