import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OpenPackDto, OpenPackResponse } from '../../interfaces/pack.interface';
import { Pack } from '../../interfaces/pack.interface';
import { ApiResponse } from '../../interfaces/api-response.interface';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = API_BASE_URL;

  openPack(dto: OpenPackDto): Observable<ApiResponse<OpenPackResponse>> {
    return this.http.post<ApiResponse<OpenPackResponse>>(
      `${this.apiUrl}/packs/open`,
      dto,
    );
  }

  openFreePack(albumId: string) {

    return this.http.post<any>(
      `${this.apiUrl}/packs/free`,
      {
        albumId,
      },
    );
  }

  findAll() {
    return this.http.get<ApiResponse<Pack[]>>(
      `${this.apiUrl}/packs`,
    );
  }
}
