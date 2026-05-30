import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';

import {
  AppNotification,
  UnreadNotificationCount,
} from '../../interfaces/notification.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_BASE_URL}/notifications`;

  findMine() {
    return this.http.get<ApiResponse<AppNotification[]>>(
      this.apiUrl,
    );
  }

  countUnread() {
    return this.http.get<ApiResponse<UnreadNotificationCount>>(
      `${this.apiUrl}/unread-count`,
    );
  }

  markAsRead(notificationId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/${notificationId}/read`,
      {},
    );
  }

  markAllAsRead() {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/read-all`,
      {},
    );
  }
}
