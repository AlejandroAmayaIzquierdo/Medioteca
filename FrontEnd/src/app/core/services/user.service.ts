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
      .patch<User>(`${this.apiUrl}/me`, data, {
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
        params: { page: 1, pageSize: 100 }, // TODO implement pagination
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

  public deactivateUser(userId: string) {
    this.isLoading.set(true);

    const token = this.authService.getToken();

    return this.http
      .delete<void>(`${this.apiUrl}/${userId}`, {
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
