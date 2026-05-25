export interface ChatUser {
  id: string;
  name: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  tradeCode?: string | null;
  lastSeenAt?: string | null;
}

export interface ChatReplyTo {
  id: string;
  content: string;
  user: ChatUser;
}

export interface ChatMessage {
  id: string;
  content: string;
  imageUrl?: string | null;

  isPinned: boolean;
  isEdited: boolean;

  createdAt: string;

  user: ChatUser;

  replyTo?: ChatReplyTo | null;

  likesCount: number;
  likedByMe: boolean;
}

export interface CreateChatMessageDto {
  content: string;
  replyToId?: string | null;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
  sender: ChatUser;
}

export interface Friend {
  id: string;
  name: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  tradeCode?: string | null;
  lastSeenAt?: string | null;
}

export interface ChatPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  pagination: ChatPagination;
}