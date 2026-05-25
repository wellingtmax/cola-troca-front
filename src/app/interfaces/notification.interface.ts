export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'CHAT_REPLY'
  | 'CHAT_MENTION'
  | 'TRADE_RECEIVED'
  | 'TRADE_ACCEPTED'
  | 'TRADE_REJECTED'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadNotificationCount {
  total: number;
}
