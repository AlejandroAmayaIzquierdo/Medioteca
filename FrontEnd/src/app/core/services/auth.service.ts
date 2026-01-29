import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClaimPermissions, ClaimRoles, User } from '../models/Auth/User';
import { catchError, tap, throwError } from 'rxjs';
import {
  JwtLoginPayload,
  LoginFormDto,
  LoginResponseDto,
  RefreshTokenDto,
} from '../models/Auth/Login';
import { jwtDecode } from 'jwt-decode';
import { RegisterResponseDto } from '../models/Auth/Register';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private currentUser = signal<User | null>(null);
  private isLoading = signal(false);

  public readonly isAuthenticated = computed(() => this.currentUser() !== undefined);
  public readonly loading = this.isLoading.asReadonly();
  public readonly user = this.currentUser.asReadonly();

  public readonly hasPermission = (permissionName: string) => {
    console.log(this.currentUser());
    console.log('Checking permission:', permissionName);
    console.log('Current User Permissions:', this.currentUser()?.permissions);
    const user = this.currentUser();
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.some((p) => p.name === permissionName);
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const user = this.getUserFromToken();
    this.currentUser.set(user);
  }

  public setUser(user: User) {
    this.currentUser.set(user);
  }

  public login(credentials: LoginFormDto) {
    this.isLoading.set(true);

    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }

  public register(registerData: LoginFormDto) {
    this.isLoading.set(true);

    return this.http.post<RegisterResponseDto>(`${this.apiUrl}/register`, registerData).pipe(
      tap(() => {
        this.router.navigate(['/login']);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }

  public refreshToken() {
    this.isLoading.set(true);
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) {
      return;
    }

    const userId = this.currentUser()?.id;
    if (!userId) {
      return;
    }

    const payload: RefreshTokenDto = {
      userId: userId,
      expiredAccessToken: accessToken,
      refreshToken: refreshToken,
    };

    return this.http.post<LoginResponseDto>(`${this.apiUrl}/refresh-token`, payload).pipe(
      tap((response) => {
        this.isLoading.set(false);
        this.setSession(response);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }

  public logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(AuthResponse: LoginResponseDto) {
    const accessToken = AuthResponse.accessToken;
    const refreshToken = AuthResponse.refreshToken;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

    const user = this.getUserFromToken(accessToken);

    this.currentUser.set(user);
  }

  public getUserFromToken(accessToken?: string): User | null {
    const token = accessToken ?? localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) {
      return null;
    }
    const payload = jwtDecode<JwtLoginPayload>(token);

    const rolString = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    const roles = JSON.parse(rolString) as ClaimRoles[];

    const permissionsString = payload['permissions'];
    const permissions = JSON.parse(permissionsString) as ClaimPermissions[];

    const user: User = {
      id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      userName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      roles,
      permissions,
      expiredAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
    };

    return user;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public isExpired(): boolean {
    console.log('Checking token expiration');
    console.log('Current User:', this.user());
    if (this.isAuthenticated() && this.user()?.expiredAt) {
      return this.user()?.expiredAt! < new Date();
    }
    const user = this.getUserFromToken();

    console.log('Decoded User from Token:', user);
    if (!user || !user.expiredAt) {
      return true;
    }
    return user.expiredAt < new Date();
  }
}
