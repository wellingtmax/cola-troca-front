import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PublicProfile } from '../../interfaces/public-profile.interface';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_BASE_URL}/users`;

  profile() {
    return this.http.get<any>(
      `${this.apiUrl}/profile`,
    );
  }

  dashboard() {
    return this.http.get<any>(
      `${this.apiUrl}/dashboard`,
    );
  }

  updateProfile(dto: any) {
    return this.http.patch<any>(
      `${this.apiUrl}/profile`,
      dto,
    );

  }

  updateAddress(dto: any) {
    return this.http.patch<any>(
      `${this.apiUrl}/address`,
      dto,
    );
  }

  updateAvatar(avatarUrl: string) {
    return this.http.patch<any>(
      `${this.apiUrl}/avatar`,
      {
        avatarUrl,
      },
    );
  }

  generateTradeCode() {
    return this.http.patch<any>(
      `${this.apiUrl}/trade-code`,
      {},
    );
  }

  getPublicProfile(userId: string) {
    return this.http.get<ApiResponse<PublicProfile>>(
      `${this.apiUrl}/public/${userId}`,
    );
  }

  findMyFeaturedStickers() {
    return this.http.get<any>(
      `${this.apiUrl}/featured-stickers`,
    );
  }

  updateFeaturedStickers(userStickerIds: string[]) {
    return this.http.patch<any>(
      `${this.apiUrl}/featured-stickers`,
      {
        userStickerIds,
      },
    );
  }

  updatePresence() {
    return this.http.patch<any>(
      `${this.apiUrl}/presence`,
      {},
    );
  }
}
