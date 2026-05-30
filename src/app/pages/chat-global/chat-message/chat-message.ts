import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ChatMessage as ChatMessageModel, ChatUser } from '../../../interfaces/chat-message';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: ChatMessageModel;
  @Input() mine = false;
  @Input() highlighted = false;

  @Output() openProfile = new EventEmitter<string>();
  @Output() like = new EventEmitter<ChatMessageModel>();
  @Output() reply = new EventEmitter<ChatMessageModel>();
  @Output() mention = new EventEmitter<ChatMessageModel>();
  @Output() friendRequest = new EventEmitter<string>();
  @Output() trade = new EventEmitter<ChatUser>();
  @Output() remove = new EventEmitter<ChatMessageModel>();

  getInitialLetter(): string {
    return this.message.user.nickname?.[0] || this.message.user.name?.[0] || 'U';
  }

  isOnline(lastSeenAt?: string | null): boolean {
    if (!lastSeenAt) {
      return false;
    }

    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();

    return (now - lastSeen) / 1000 / 60 <= 2;
  }

  getLastSeenLabel(lastSeenAt?: string | null): string {
    if (!lastSeenAt) {
      return 'Offline';
    }

    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();
    const diffInMinutes = Math.floor((now - lastSeen) / 1000 / 60);

    if (diffInMinutes <= 2) {
      return 'Online agora';
    }

    if (diffInMinutes < 60) {
      return `Visto ha ${diffInMinutes} min`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `Visto ha ${diffInHours} h`;
    }

    return 'Offline';
  }
}
