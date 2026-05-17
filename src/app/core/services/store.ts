import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { Album } from '../../interfaces/album.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/store';

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