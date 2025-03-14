'use server';

import { API_TOKEN_CIENT } from '@common/auth';
import { cookies } from 'next/headers';

// NOTE: These server-side cookie functions are no longer used.
// We've switched to client-side cookies only for authentication.
// Keeping them commented for reference in case we need them in the future.

/*
// 30 days in seconds (30 * 24 * 60 * 60)
const THIRTY_DAYS_IN_SECONDS = 2592000;

export const removeTokenServer = () => {
  'use server';
  cookies().delete(API_TOKEN_SERVER);
};

export const setTokenServer = (token: string) => {
  ('use server');
  cookies().set({
    name: API_TOKEN_SERVER,
    value: token,
    httpOnly: true,
    // Use 30 days instead of timeOutDuration
    maxAge: THIRTY_DAYS_IN_SECONDS,
    secure: true,
    sameSite: 'lax',
  });
};
*/

// Instead, provide a way to check if the user is logged in on the server side
// by looking at the client cookie that will be sent with the request
export const checkIsLoggedInServer = () => {
  'use server';
  // This will check for the client cookie that gets sent to the server with requests
  return !!cookies().get(API_TOKEN_CIENT);
};
