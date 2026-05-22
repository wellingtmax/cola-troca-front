import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/api/users';

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
}
