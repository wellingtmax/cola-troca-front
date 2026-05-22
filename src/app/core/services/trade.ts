import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/trades';

  findUserByTradeCode(tradeCode: string) {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/user/${encodeURIComponent(tradeCode)}`,
    );
  }

  createTrade(dto: any) {
    return this.http.post<ApiResponse<any>>(
      this.apiUrl,
      dto,
    );
  }

  myTrades() {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/my`,
    );
  }
}
