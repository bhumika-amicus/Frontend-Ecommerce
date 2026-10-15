import type { LoginRequestDto, LoginResponseDto } from '../types/AuthDto';
import { BASE_URL, DEV_LOGIN_EMAIL, DEV_LOGIN_PASSWORD } from '../config';
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../utils/token';

export async function loginApi(credentials?: Partial<LoginRequestDto>): Promise<LoginResponseDto> {
  const email = credentials?.email || DEV_LOGIN_EMAIL;
  const password = credentials?.password || DEV_LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Login credentials are not provided and development environment variables are missing.');
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

  return data;
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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}
