export interface User {
  id: string;
  userName: string;
  email: string;
  roles: ClaimRoles[];
  permissions?: ClaimPermissions[];
  expiredAt?: Date;
}

export interface ClaimRoles {
  id: number;
  name: string;
}

export interface ClaimPermissions {
  id: number;
  name: string;
}

export interface WebApiUserDto {
  id: string;
  userName: string;
  email: string;
}
