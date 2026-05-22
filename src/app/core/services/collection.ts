import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/api/collection';

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

  countPendingAlbums() {
    return this.http.get<ApiResponse<number>>(
      `${this.apiUrl}/pending-albums-count`,
    );
  }
}
