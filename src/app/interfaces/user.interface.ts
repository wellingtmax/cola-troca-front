export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: string;
  avatarUrl?: string;
  coins: number;
  createdAt: string;
}