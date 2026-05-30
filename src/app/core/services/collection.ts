import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_BASE_URL}/collection`;

  private readonly pendingRefreshSubject = new Subject<void>();

  pendingRefresh$ = this.pendingRefreshSubject.asObservable();

  refreshPendingCount() {
    this.pendingRefreshSubject.next();
  }

  findByAlbum(albumId: string) {
    return this.http.get<any>(
      `${this.apiUrl}/album/${albumId}`,
    );
  }


  placeSticker(albumId: string, stickerId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/album/${albumId}/sticker/${stickerId}/place`,
      {},
    );
  }

  placeAllStickersFromAlbum(albumId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/album/${albumId}/place-all`,
      {},
    );
  }

  placeAllMyStickers() {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/stickers/place-all`,
      {},
    );
  }

  countPendingAlbums() {
    return this.http.get<ApiResponse<number>>(
      `${this.apiUrl}/pending-albums-count`,
    );
  }

  buyAlbum(albumId: string) {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/albums/${albumId}/buy`,
      {},
    );
  }
}
