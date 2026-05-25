import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../interfaces/api-response.interface';

import {
  ChatMessage,
  ChatMessagesResponse,
  CreateChatMessageDto,
  FriendRequest,
  Friend,
} from '../../interfaces/chat-message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/chat';

  findGlobalMessages(page = 1, limit = 30) {
    return this.http.get<ApiResponse<ChatMessagesResponse>>(
      `${this.apiUrl}/global?page=${page}&limit=${limit}`,
    );
  }

  sendGlobalMessage(dto: CreateChatMessageDto) {
    return this.http.post<ApiResponse<ChatMessage>>(
      `${this.apiUrl}/global`,
      dto,
    );
  }

  toggleLike(messageId: string) {
    return this.http.patch<ApiResponse<{ liked: boolean }>>(
      `${this.apiUrl}/messages/${messageId}/like`,
      {},
    );
  }

  deleteMessage(messageId: string) {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/messages/${messageId}`,
    );
  }

  sendFriendRequest(userId: string) {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/friends/request/${userId}`,
      {},
    );
  }

  findFriendRequests() {
    return this.http.get<ApiResponse<FriendRequest[]>>(
      `${this.apiUrl}/friends/requests`,
    );
  }

  acceptFriendRequest(requestId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/friends/requests/${requestId}/accept`,
      {},
    );
  }

  rejectFriendRequest(requestId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/friends/requests/${requestId}/reject`,
      {},
    );
  }

  findMyFriends() {
    return this.http.get<ApiResponse<Friend[]>>(
      `${this.apiUrl}/friends`,
    );
  }

  findMyInteractions() {
    return this.http.get<ApiResponse<ChatMessage[]>>(
      `${this.apiUrl}/interactions`,
    );
  }

  dismissInteraction(messageId: string) {
    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/interactions/${messageId}/dismiss`,
      {},
    );
  }
}
