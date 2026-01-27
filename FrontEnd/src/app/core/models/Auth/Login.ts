import { JwtPayload } from 'jwt-decode';

export interface LoginFormDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface JwtLoginPayload extends JwtPayload {
  ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']: string;
  ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']: string;
  ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']: string;
  ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']: string;
  permissions: string;
}

export interface RefreshTokenDto {
  userId: string;
  expiredAccessToken: string;
  refreshToken: string;
}
