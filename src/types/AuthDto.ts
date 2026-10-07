export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  customerId: number;
  name: string;
  role: string;
}
