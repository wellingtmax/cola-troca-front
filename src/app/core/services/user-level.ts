import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class UserLevelService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_BASE_URL}/user-level`;

  private readonly levelRefreshSubject = new Subject<void>();

  levelRefresh$ = this.levelRefreshSubject.asObservable();

  refreshLevel() {
    this.levelRefreshSubject.next();
  }

  getMyLevel() {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/me`,
    );
  }

  getLevelTable() {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/table`,
    );
  }
}
