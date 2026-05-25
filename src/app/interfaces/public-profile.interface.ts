export interface PublicProfileStats {

    totalAlbums: number;
    totalStickers: number;
    totalDuplicates: number;
    totalFriends: number;
}

export interface PublicFeaturedSticker {
    id: string;
    position: number;

    sticker: {
        id: string;
        name: string;
        number: number;
        rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
        imageUrl: string;
        albumName: string;
    };
}

export interface PublicProfile {
    id: string;
    name: string;
    nickname?: string | null;
    avatarUrl?: string | null;
    tradeCode?: string | null;
    bio?: string | null;
    createdAt: string;

    stats: PublicProfileStats;
    featuredStickers: PublicFeaturedSticker[];

}
