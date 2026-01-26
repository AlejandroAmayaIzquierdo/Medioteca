import { Roles } from './Roles';

export interface RegisterFormDto {
  userName: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  id: string;
  userName: string;
  email: string;
  profilePicId?: string;
  profilePicLink?: string;
  userRoles: Roles[];
}
