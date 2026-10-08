
import { BASE_URL } from '../config';
import { getAccessToken } from '../utils/token';
import { refreshAuthToken } from './auth';

export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(endpoint: string, init: ApiFetchOptions = {}, isRetry = false): Promise<T | undefined> {
  const headers = new Headers(init.headers);
  
  if (init.auth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...init, headers });

  if (!response.ok) {
    // 401 Unauthorized Interceptor
    if (response.status === 401 && init.auth && !isRetry) {
      await refreshAuthToken(); // If this fails, it throws and aborts the request
      return apiFetch<T>(endpoint, init, true); // Retry exactly once
    }
    // 400 Validation Error Interceptor
    if (response.status === 400) {
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          throw new Error(errorData.detail);
        }
      } catch (e) {
        if (e instanceof Error && e.message !== 'Unexpected end of JSON input' && e.message !== 'Failed to parse URL from' && e.message !== 'invalid json response body at') {
           // If it's a real Error (like the one we just manually threw), throw it upwards!
           throw e;
        }
        // Let it fall through to generic error below if it's just a JSON parsing error
      }
    }

    console.error(
      `API HTTP Error: ${response.status} ${response.statusText}`
    )

    if (response.status === 404) {
      throw new Error('The requested resource could not be found.')
    }

    if (response.status >= 500) {
      throw new Error(
        'The server is currently unavailable. Please try again later.'
      )
    }

    throw new Error(
      'We are having trouble completing your request. Please try again.'
    )
  }

  if (response.status === 204) {
    return undefined
  }

  return response.json()
}
