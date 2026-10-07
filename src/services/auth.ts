import type { LoginRequestDto, LoginResponseDto } from '../types/AuthDto';
import { BASE_URL, DEV_LOGIN_EMAIL, DEV_LOGIN_PASSWORD } from '../config';
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../utils/token';

export async function devLogin(): Promise<LoginResponseDto> {
  const email = DEV_LOGIN_EMAIL;
  const password = DEV_LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Development login credentials are not set in environment variables.');
  }

  const payload: LoginRequestDto = { email, password };

  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
  }

  const data: LoginResponseDto = await response.json();

  setAccessToken(data.token);
  setRefreshToken(data.refreshToken);

  console.log('✅ Temporary Development Login Successful');

  return data;
}

let authPromise: Promise<LoginResponseDto> | null = null;

export function initializeAuth() {
  if (!authPromise) {
    authPromise = devLogin().catch((err) => {
      authPromise = null; // reset on failure so it can be retried if needed
      throw err;
    });
  }
  return authPromise;
}

let refreshPromise: Promise<void> | null = null;

export function refreshAuthToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Refresh token invalid or expired');
        }

        const data: LoginResponseDto = await response.json();
        setAccessToken(data.token);
        setRefreshToken(data.refreshToken);
      } catch (error) {
        clearTokens();
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}
