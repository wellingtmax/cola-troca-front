export interface  AlbumSticker {
    id: string;
    number: number;
    name: string;
    rarity: string;
    imageUrl: string;
    isSpecial: boolean;

    owned: boolean;
    isPaced: boolean;
    canPlace: boolean;
    quantityOwned: number;
    quantityDuplicate: number;
}

export interface AlbumProgress {
    album: any;
    progress: number;
    totalStikers: number;
    ownedTotal: number;
    stickers: AlbumSticker[];
}
