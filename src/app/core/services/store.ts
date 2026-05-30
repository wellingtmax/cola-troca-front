import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { Album } from '../../interfaces/album.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/store`;

  buyAlbum(albumId: string) {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/buy-album/${albumId}`,
      {},
    );
  }

  myAlbums() {
    return this.http.get<ApiResponse<Album[]>>(
      `${this.apiUrl}/my-albums`,
    );
  }
}
