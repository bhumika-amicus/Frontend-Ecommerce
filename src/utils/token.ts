export const getAccessToken = () => localStorage.getItem('accessToken');
export const setAccessToken = (token: string) => localStorage.setItem('accessToken', token);

export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (token: string) => localStorage.setItem('refreshToken', token);

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};
export const setStoredUser = (user: unknown) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
