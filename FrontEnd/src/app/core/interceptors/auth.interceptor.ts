import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Si es 401 Unauthorized y no estamos en refresh-token
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        console.log('Unauthorized request - logging out');
      }
      return throwError(() => error);
    }),
  );
};
