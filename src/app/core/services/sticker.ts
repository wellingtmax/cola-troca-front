import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class StickerService {


  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_BASE_URL}/stickers`;

  findMyStickers() {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/my`,
    );
  }

  toggleFavorite(userStickerId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/favorite/${userStickerId}`,
      {},
    );
  }

  placeSticker(userStickerId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/place/${userStickerId}`,
      {},
    );
  }

  placeAllStickers() {
    return this.http.patch<any>(
      `${this.apiUrl}/place-all`,
      {}
    )
  }
}
