import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { StickerService } from '../../core/services/sticker';
import { AlertService } from '../../core/services/alert';
import { CollectionService } from '../../core/services/collection';

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

  placeSticker(sticker: any) {

    this.stickerService.placeSticker(sticker.id).subscribe({
      next: () => {
        sticker.isPlaced = true;

        this.alertService.success(
          'Figurinha colada com sucesso!',
        );
      },

      error: () => {
        this.alertService.error(
          'Error ao colar figurinha.'
        );
      },
    });
  }

  showPlaceAllModal = false;
pendingPlaceTotal = 0;

openPlaceAllModal() {
  this.pendingPlaceTotal = this.stickers.filter(
    (sticker: any) => !sticker.isPlaced,
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
  this.stickerService.placeAllStickers()
    .subscribe({
      next: (response: any) => {
        this.stickers.forEach((sticker: any) => {
          sticker.isPlaced = true;
        });

        this.collectionService.refreshPendingCount();

        this.showPlaceAllModal = false;

        this.alertService.success(
          response.message || 'Figurinhas coladas!',

        );
      },

      error: () => {
        this.alertService.error(
          'Erro ao colar figurinhas.',
        );
      },
    });
}
}
