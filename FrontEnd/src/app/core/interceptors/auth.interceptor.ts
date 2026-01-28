import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Si es 401 Unauthorized y no estamos en refresh-token o login
      if (
        error.status === 401 &&
        !req.url.includes('/refresh-token') &&
        !req.url.includes('/login')
      ) {
        console.log('Unauthorized request - logging out');

        return auth.refreshToken()!.pipe(
          switchMap((responseNewToken) => {
            const newToken = responseNewToken.accessToken;
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            console.log('Token refresh failed - logging out');
            auth.logout();
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
