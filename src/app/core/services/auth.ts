import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  LoginDto,
  RegisterDto,
  AuthResponse,
} from '../../interfaces/auth.interface';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  login(dto: LoginDto): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/Login`,
      dto,
    ).pipe(
      tap((response) => {
        localStorage.setItem(
          'token',
          response.data.access_token,
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user),
        );
      }),
    );
  }

  register(dto: RegisterDto): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/register`,
      dto,
    ).pipe(
      tap((response) => {
        localStorage.setItem(
          'token',
          response.data.access_token,
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user),
        );
      }),
    );
  }

  profile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.apiUrl}/profile`,
    ).pipe(
      tap((response) => {
        localStorage.setItem(
          'user',
          JSON.stringify(response.data),
        );
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }
}
