export type PackType = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface OpenPackDto {
    albumId: string;
    packType: PackType;
}

export interface DrawnSticker {
    id: string;
    albumId: string;
    number: number;
    name: string;
    rarity: string;
    imageUrl: string;
    isSpecial: boolean;
}

export interface OpenPackResponse {
    total: number;
    stickers: DrawnSticker[];
}