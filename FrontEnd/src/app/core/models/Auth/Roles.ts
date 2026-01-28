export interface Roles {
  id: number;
  roleId: number;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}
