'use server';

import { API_TOKEN_SERVER } from '@common/auth';
import { timeOutDuration } from '@common/constants';
import { cookies } from 'next/headers';

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
