import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Album } from '../../interfaces/album.interface';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private readonly apiUrl = API_BASE_URL;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<ApiResponse<Album[]>> {
    return this.http.get<ApiResponse<Album[]>>(`${this.apiUrl}/albums`)
  }

  findAlbumProgress(albumId: string) {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/collection/album/${albumId}`
    )
  }
}
