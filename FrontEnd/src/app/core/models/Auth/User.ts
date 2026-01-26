import { Roles } from './Roles';

export interface User {
  id: string;
  userName: string;
  email: string;
  rol: string[];
  expiredAt?: Date;
}
