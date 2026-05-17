import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/api/collection';

  findByAlbum(albumId: string) {

    return this.http.get<any>(
      `${this.apiUrl}/album/${albumId}`,
    );
  }
}
