import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { StickerService } from '../../core/services/sticker';
import { AlertService } from '../../core/services/alert';
import { CollectionService } from '../../core/services/collection';
import { UserLevelService } from '../../core/services/user-level';

@Component({
  selector: 'app-stickers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './stickers.html',
  styleUrl: './stickers.css',
})
export class Stickers implements OnInit {

  private readonly stickerService = inject(StickerService);
  private readonly alertService = inject(AlertService);
  private readonly collectionService = inject(CollectionService)
  private readonly userLevelService = inject(UserLevelService)

  loading = true;

  stickers: any[] = [];

  searchTerm = '';
  selectedSticker: any = null;
  selectedAlbum = '';
  selectedRarity = '';

  onlyDuplicates = false;
  onlyFavorites = false;
  onlyMissing = false;

  albums: string[] = [];

  rarities = [
    'COMMON',
    'RARE',
    'EPIC',
    'LEGENDARY',
  ];

  ngOnInit(): void {
    this.loadStickers();
  }

  loadStickers() {
    this.loading = true;

    this.stickerService.findMyStickers().subscribe({
      next: (response) => {

        this.stickers = response.data;

        this.albums = [
          ...new Set(
            this.stickers.map(
              (sticker: any) => sticker.albumName,
            ),
          ),
        ];

        this.loading = false;
      },

      error: () => {
        this.loading = false;

        this.alertService.error(
          'Erro ao carregar figurinhas.',
        );
      },
    });
  }

  toggleFavorite(sticker: any) {
    this.stickerService.toggleFavorite(sticker.id)
      .subscribe({
        next: () => {

          sticker.favorite = !sticker.favorite;

        },

        error: () => {
          this.alertService.error(
            'Erro ao favoritar figurinha.',
          );
        },
      });
  }

  get filteredStickers() {

    return this.stickers.filter((sticker: any) => {

      const search =
        this.searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||

        sticker.name?.toLowerCase().includes(search) ||

        sticker.albumName?.toLowerCase().includes(search) ||

        sticker.number?.toString().includes(search);

      const matchesAlbum =
        !this.selectedAlbum ||

        sticker.albumName === this.selectedAlbum;

      const matchesRarity =
        !this.selectedRarity ||

        sticker.rarity === this.selectedRarity;

      const matchesDuplicates =
        !this.onlyDuplicates ||

        sticker.quantityDuplicate > 0;

      const matchesFavorites =
        !this.onlyFavorites ||

        sticker.favorite;

      const matchesMissing =
        !this.onlyMissing ||

        !sticker.isPlaced;

      return (
        matchesSearch &&
        matchesAlbum &&
        matchesRarity &&
        matchesDuplicates &&
        matchesFavorites &&
        matchesMissing
      );
    });
  }



  openStickerDetails(sticker: any) {
    this.selectedSticker = sticker;
  }

  closeStickerDetails() {
    this.selectedSticker = null;
  }

  private getRealStickerId(sticker: any): string {
    return (
      sticker?.stickerId ||
      sticker?.sticker?.id ||
      sticker?.id
    );
  }

  placeSticker(sticker: any) {
    const stickerId = this.getRealStickerId(sticker);

    if (!sticker.albumId || !stickerId) {
      this.alertService.error(
        'Não foi possível identificar a figurinha ou o álbum.',
      );

      return;
    }

    this.collectionService.placeSticker(
      sticker.albumId,
      stickerId,
    ).subscribe({
      next: (response) => {
        sticker.isPlaced = true;

        if (this.selectedSticker?.id === sticker.id) {
          this.selectedSticker.isPlaced = true;
        }

        this.collectionService.refreshPendingCount();
        this.userLevelService.refreshLevel();

        const xpEarned = response.data?.xpEarned || 0;
        const stickerXpEarned = response.data?.stickerXpEarned || 0;
        const albumCompletionReward = response.data?.albumCompletionReward;

        let message = `XP ganho: +${xpEarned}`;

        if (albumCompletionReward) {
          message =
            `Figurinha: +${stickerXpEarned} XP | Álbum completo: +${albumCompletionReward.xpEarned} XP | Total: +${xpEarned} XP`;
        }

        this.alertService.success(
          albumCompletionReward
            ? 'Álbum completo!'
            : 'Figurinha colada com sucesso!',
          message,
        );
      },

      error: (error) => {
        this.alertService.error(
          'Erro ao colar figurinha.',
          error?.error?.message || 'Não foi possível colar a figurinha.',
        );
      },
    });
  }

  showPlaceAllModal = false;
  pendingPlaceTotal = 0;

  openPlaceAllModal() {
    this.pendingPlaceTotal = this.stickers.filter(
      (sticker: any) =>
        !sticker.isPlaced &&
        sticker.quantityOwned > 0,
    ).length;

    if (this.pendingPlaceTotal === 0) {
      this.alertService.warning('Nenhuma figurinha pendente.');
      return;
    }

    this.showPlaceAllModal = true;
  }

  closePlaceAllModal() {
    this.showPlaceAllModal = false;
  }

  confirmPlaceAllStickers() {
    this.collectionService.placeAllMyStickers()
      .subscribe({
        next: (response: any) => {
          this.stickers.forEach((sticker: any) => {
            if (
              !sticker.isPlaced &&
              sticker.quantityOwned > 0
            ) {
              sticker.isPlaced = true;
            }
          });

          this.collectionService.refreshPendingCount();
          this.userLevelService.refreshLevel();

          this.showPlaceAllModal = false;

          const totalPlaced = response.data?.totalPlaced || 0;
          const xpEarned = response.data?.xpEarned || 0;
          const stickerXpEarned = response.data?.stickerXpEarned || 0;
          const albumCompletionRewards =
            response.data?.albumCompletionRewards || [];

          const albumBonusXp = albumCompletionRewards.reduce(
            (total: number, reward: any) => total + reward.xpEarned,
            0,
          );

          let message =
            `${totalPlaced} figurinha(s) colada(s) | XP ganho: +${xpEarned}`;

          if (albumCompletionRewards.length > 0) {
            message =
              `${totalPlaced} figurinha(s) colada(s) | Figurinhas: +${stickerXpEarned} XP | Bônus de álbum completo: +${albumBonusXp} XP | Total: +${xpEarned} XP`;
          }

          this.alertService.success(
            albumCompletionRewards.length > 0
              ? 'Álbum completo!'
              : 'Figurinhas coladas!',
            message,
          );
        },

        error: (error) => {
          this.alertService.error(
            'Erro ao colar figurinhas.',
            error?.error?.message || 'Não foi possível colar as figurinhas.',
          );
        },
      });
  }
}
