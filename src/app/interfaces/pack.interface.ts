export type PackType =
  | 'FREE'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE';

export interface Pack {
  id: string;
  name: string;
  type: PackType;

  stickerQuantity: number;
  price: number;

  commonChance: number;
  rareChance: number;
  epicChance: number;
  legendaryChance: number;

  guaranteedLegendary: boolean;
  dailyLimit: boolean;

  createdAt?: string;
}

export interface OpenPackDto {
  albumId: string;
  packType: PackType;
}

export interface DrawnSticker {
  id: string;
  albumId: string;
  number: number;
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  imageUrl: string;
  isSpecial?: boolean;
}

export interface OpenPackResponse {
  pack?: Pack;
  total: number;
  stickers: DrawnSticker[];
  coinsSpent: number;
  coinsRemaining: number;
}