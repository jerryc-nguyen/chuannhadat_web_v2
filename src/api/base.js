export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const currentUserKey = 'current_user';

// export const baseApiUrl = publicRuntimeConfig.baseApiUrl;

export function getCurrentUser() {
  try {
    const currentUserStr =
      window.localStorage.getItem(currentUserKey);
    return JSON.parse(currentUserStr);
  } catch (err) {
    return null;
  }
}

export function getAccessToken() {
  return (getCurrentUser() || {})['auth_token'];
}

export function getAuthorizedHeaders() {
  const accessToken = getAccessToken();
  const apiKey = '';

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
  };
}

export async function authorizedFetch(url, config = {}) {
  try {
    const header = await getAuthorizedHeaders();
    const newConfig = { ...config, ...header };
    const res = await fetch(url, newConfig);

    if (!res.ok) {
      const error = new Error('Error while fetching data.');
      const info = await res.json();
      error.message = info?.error;
      throw error;
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function apiFetch(url, config = {}) {
  try {
    const header = await getAuthorizedHeaders();
    const newConfig = { ...config, ...header };
    return fetch(url, newConfig);
  } catch (error) {
    throw new Error(error.toString());
  }
}
