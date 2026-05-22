import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class StickerService {


  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/stickers';

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
}
