import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ChatService } from '../../core/services/chat';
import { AlertService } from '../../core/services/alert';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { PublicProfile } from '../../interfaces/public-profile.interface';
import { Router } from '@angular/router';

import {
  ChatMessage,
  FriendRequest,
  Friend,
} from '../../interfaces/chat-message';
import { ChatMessageComponent } from './chat-message/chat-message';

@Component({
  selector: 'app-chat-global',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ChatMessageComponent,
  ],
  templateUrl: './chat-global.html',
  styleUrl: './chat-global.css',
})
export class ChatGlobal implements OnInit, OnDestroy {
  private readonly chatService = inject(ChatService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private refreshInterval?: ReturnType<typeof setInterval>;

  loading = true;
  sending = false;

  messageText = '';
  replyTo: ChatMessage | null = null;

  showMentionBox = false;
  mentionSearch = '';

  interactions: ChatMessage[] = [];
  showInteractions = false;

  friends: Friend[] = [];
  messages: ChatMessage[] = [];

  friendRequests: FriendRequest[] = [];

  currentUser = this.authService.getUser();

  selectedProfile: PublicProfile | null = null;
  loadingProfile = false;

  highlightedMessageId: string | null = null;

  currentPage = 1;
  messageLimit = 10;
  hasMoreMessages = false;
  loadingMoreMessages = false;

  chatSearchTerm = '';
  searchingMessages = false;

  ngOnInit(): void {
    this.loadMessages();
    this.loadFriendRequests();
    this.loadFriends();
    this.loadInteractions();

    this.refreshInterval = setInterval(() => {
      this.loadMessages();
      this.loadFriendRequests();
      this.loadFriends();
      this.loadInteractions();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadMessages() {
    this.loading = true;
    this.currentPage = 1;

    this.chatService.findGlobalMessages(
      this.currentPage,
      this.messageLimit,
      this.chatSearchTerm,
    ).subscribe({
      next: (response) => {
        this.messages = response.data.messages;
        this.hasMoreMessages = response.data.pagination.hasMore;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Erro ao carregar mensagens.');
      },
    });
  }

  sendMessage() {
    const content = this.messageText.trim();

    if (!content) {
      this.alertService.warning('Digite uma mensagem.');
      return;
    }

    this.sending = true;

    this.chatService.sendGlobalMessage({
      content,
      replyToId: this.replyTo?.id,
    }).subscribe({
      next: (response) => {
        this.messages = [
          response.data,
          ...this.messages,
        ];

        this.messageText = '';
        this.replyTo = null;
        this.sending = false;
      },
      error: () => {
        this.sending = false;
        this.alertService.error('Erro ao enviar mensagem.');
      },
    });
  }

  toggleLike(message: ChatMessage) {
    this.chatService.toggleLike(message.id).subscribe({
      next: (response) => {
        const liked = response.data.liked;

        message.likedByMe = liked;
        message.likesCount += liked ? 1 : -1;

        if (message.likesCount < 0) {
          message.likesCount = 0;
        }
      },
      error: () => {
        this.alertService.error('Erro ao curtir mensagem.');
      },
    });
  }

  startReply(message: ChatMessage) {
    this.replyTo = message;
  }

  cancelReply() {
    this.replyTo = null;
  }

  deleteMessage(message: ChatMessage) {
    this.chatService.deleteMessage(message.id).subscribe({
      next: () => {
        this.messages = this.messages.filter(
          (item) => item.id !== message.id,
        );

        this.alertService.success('Mensagem apagada.');
      },
      error: () => {
        this.alertService.error('Erro ao apagar mensagem.');
      },
    });
  }

  isMine(message: ChatMessage) {
    return message.user.id === this.currentUser?.id;
  }

  addEmoji(emoji: string) {
    this.messageText += emoji;
  }

  toggleMentionBox() {
    this.showMentionBox = !this.showMentionBox;

    if (this.showMentionBox) {
      this.mentionSearch = '';
      this.loadFriends();
    }
  }

  closeMentionBox() {
    this.showMentionBox = false;
    this.mentionSearch = '';
  }

  getMentionUser(friendItem: any) {
    return (
      friendItem?.friend ||
      friendItem?.user ||
      friendItem
    );
  }

  get mentionableUsers() {
    const search = this.mentionSearch
      .trim()
      .toLowerCase();

    return this.friends
      .map((friendItem: any) => this.getMentionUser(friendItem))
      .filter((user: any) => {
        if (!user) {
          return false;
        }

        if (user.id === this.currentUser?.id) {
          return false;
        }

        const nickname = user.nickname || '';
        const name = user.name || '';
        const tradeCode = user.tradeCode || '';

        const searchable = `
        ${nickname}
        ${name}
        ${tradeCode}
      `.toLowerCase();

        return !search || searchable.includes(search);
      });
  }

  insertMention(user: any) {
    const mentionName =
      user?.nickname ||
      user?.name ||
      user?.tradeCode;

    if (!mentionName) {
      this.alertService.warning(
        'Não foi possível marcar este usuário.',
      );

      return;
    }

    const mention = mentionName.startsWith('@')
      ? mentionName
      : `@${mentionName}`;

    const currentText = this.messageText.trim();

    this.messageText = currentText
      ? `${currentText} ${mention} `
      : `${mention} `;

    this.closeMentionBox();
  }

  mentionMessageUser(message: ChatMessage) {
    this.insertMention(message.user);
  }

  sendFriendRequest(userId: string) {
    this.chatService.sendFriendRequest(userId).subscribe({
      next: () => {
        this.alertService.success(
          'Solicitação de amizade enviada!',
        );
      },
      error: (error) => {
        this.alertService.error(
          error?.error?.message ||
          'Erro ao enviar solicitação de amizade.',
        );
      },
    });
  }

  loadFriendRequests() {
    this.chatService.findFriendRequests().subscribe({
      next: (response) => {
        this.friendRequests = response.data;
      },
      error: () => {
        this.alertService.error(
          'Erro ao carregar solicitações de amizade.',
        );
      },
    });
  }

  loadFriends() {
    this.chatService.findMyFriends().subscribe({
      next: (response) => {
        this.friends = response.data;
      },
      error: () => {
        this.alertService.error(
          'Erro ao carregar amigos.',
        );
      },
    });
  }

  acceptFriendRequest(requestId: string) {
    this.chatService.acceptFriendRequest(requestId).subscribe({
      next: () => {
        this.alertService.success('Solicitação aceita!');
        this.loadFriendRequests();
        this.loadFriends();
      },
      error: (error) => {
        this.alertService.error(
          error?.error?.message ||
          'Erro ao aceitar solicitação.',
        );
      },
    });
  }

  rejectFriendRequest(requestId: string) {
    this.chatService.rejectFriendRequest(requestId).subscribe({
      next: () => {
        this.alertService.success('Solicitação recusada.');
        this.loadFriendRequests();
      },
      error: (error) => {
        this.alertService.error(
          error?.error?.message ||
          'Erro ao recusar solicitação.',
        );
      },
    });
  }

  loadInteractions() {
    this.chatService.findMyInteractions().subscribe({
      next: (response) => {
        this.interactions = response.data;
      },
      error: () => {
        this.alertService.error(
          'Erro ao carregar interações.',
        );
      },
    });
  }

  openPublicProfile(userId: string) {
    this.loadingProfile = true;

    this.userService.getPublicProfile(userId).subscribe({
      next: (response) => {
        this.selectedProfile = response.data;
        this.loadingProfile = false;
      },

      error: () => {
        this.loadingProfile = false;
        this.alertService.error(
          'Erro ao carregar perfil do colecionador.'
        );
      },
    });
  }

  closePublicProfile() {
    this.selectedProfile = null;
  }

  openTradeWithProfile() {
    if (!this.selectedProfile?.tradeCode) {
      this.alertService.warning(
        'Este colecionador ainda não possui ID de troca.',
      );

      return;
    }

    this.router.navigate(['/trocas'], {
      queryParams: {
        tradeCode: this.selectedProfile.tradeCode,
      },
    });
  }

  openTradeWithUser(user: any) {
    if (!user?.tradeCode) {
      this.alertService.warning(
        'Este colecionador ainda não possui ID de troca.',
      );

      return;
    }

    this.router.navigate(['/trocas'], {
      queryParams: {
        tradeCode: user.tradeCode,
      },
    });
  }

  goToInteraction(messageId: string) {
    this.highlightedMessageId = messageId;

    setTimeout(() => {
      const element = document.getElementById(
        `message-${messageId}`,
      );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        setTimeout(() => {
          this.highlightedMessageId = null;
        }, 3500);

        return;
      }

      this.alertService.warning(
        'Mensagem não encontrada na lista atual.',
        'Atualize o chat ou carregue mais mensagens.',
      );

      this.highlightedMessageId = null;
    }, 100);
  }

  removeInteraction(messageId: string) {
    this.chatService.dismissInteraction(messageId).subscribe({
      next: () => {
        this.interactions = this.interactions.filter(
          (interaction) => interaction.id !== messageId,
        );

        this.alertService.success(
          'Interação removida da lista.',
        );
      },

      error: () => {
        this.alertService.error(
          'Erro ao remover interação.',
        );
      },
    });
  }

  isOnline(lastSeenAt?: string | null) {
    if (!lastSeenAt) {
      return false;
    }

    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();

    const diffInMinutes =
      (now - lastSeen) / 1000 / 60;

    return diffInMinutes <= 2;
  }

  getLastSeenLabel(lastSeenAt?: string | null) {
    if (!lastSeenAt) {
      return 'Offline';
    }

    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();

    const diffInMinutes = Math.floor(
      (now - lastSeen) / 1000 / 60,
    );

    if (diffInMinutes <= 2) {
      return 'Online agora';
    }

    if (diffInMinutes < 60) {
      return `Visto há ${diffInMinutes} min`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `Visto há ${diffInHours} h`;
    }

    return 'Offline';
  }

  loadMoreMessages() {
    if (!this.hasMoreMessages || this.loadingMoreMessages) {
      return;
    }

    this.loadingMoreMessages = true;

    const nextPage = this.currentPage + 1;

    this.chatService.findGlobalMessages(
      nextPage,
      this.messageLimit,
      this.chatSearchTerm,
    ).subscribe({
      next: (response) => {
        this.messages = [
          ...this.messages,
          ...response.data.messages,
        ];

        this.currentPage = nextPage;
        this.hasMoreMessages = response.data.pagination.hasMore;
        this.loadingMoreMessages = false;
      },
      error: () => {
        this.loadingMoreMessages = false;

        this.alertService.error(
          'Erro ao carregar mensagens antigas.',
        );
      },
    });
  }
  searchMessages() {
    this.searchingMessages = true;

    setTimeout(() => {
      this.loadMessages();
      this.searchingMessages = false;
    }, 250);
  }

  clearChatSearch() {
    this.chatSearchTerm = '';
    this.loadMessages();
  }
}
