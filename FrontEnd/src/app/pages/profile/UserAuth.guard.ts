import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const UserAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (authService.user() === null) {
    return false;
  }

  return true;
};
