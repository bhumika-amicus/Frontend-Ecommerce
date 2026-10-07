export const getAccessToken = () => localStorage.getItem('accessToken');
export const setAccessToken = (token: string) => localStorage.setItem('accessToken', token);

export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (token: string) => localStorage.setItem('refreshToken', token);

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
