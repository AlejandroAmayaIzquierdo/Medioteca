import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User, WebApiUserDto } from '../models/Auth/User';
import { catchError, tap, throwError } from 'rxjs';
import { UpdateUserDto } from '../models/Users/Profile';
import { AuthService } from './auth.service';
import { PagedList } from '../models/PagedList';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/Users`;

  private isLoading = signal(false);

  public readonly loading = this.isLoading.asReadonly();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  public updateProfile(data: UpdateUserDto) {
    this.isLoading.set(true);

    const token = this.authService.getToken();

    return this.http
      .put<User>(`${this.apiUrl}`, data, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap(() => {
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.isLoading.set(false);
          return throwError(() => error);
        }),
      );
  }

  public getAllUsers() {
    this.isLoading.set(true);

    const token = this.authService.getToken();

    return this.http
      .get<PagedList<WebApiUserDto>>(`${this.apiUrl}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap(() => {
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.isLoading.set(false);
          return throwError(() => error);
        }),
      );
  }
}
