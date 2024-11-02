'use server';

import { API_TOKEN_SERVER } from '@common/auth';
import { timeOutDuration } from '@common/constants';
import { cookies } from 'next/headers';

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
    maxAge: timeOutDuration / 1000, // in seconds
    secure: true,
    sameSite: 'lax',
  });
};
