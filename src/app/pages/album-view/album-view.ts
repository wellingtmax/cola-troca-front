import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CollectionService } from '../../core/services/collection';
import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-album-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-view.html',
  styleUrl: './album-view.css',
})
export class AlbumView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly collectionService = inject(CollectionService);
  private readonly alertService = inject(AlertService)

  loading = true;

  album: any = null;
  albumId = '';
  stickers: any[] = [];
  placingStickerId = '';
  lastPlacedStickerId = '';
  completedPages: number[] = [];
  flipDirection: 'next' | 'previous' | '' = '';
  selectedSticker: any = null;

  progress = 0;
  totalStickers = 0;
  ownedTotal = 0;
  missingTotal = 0;

  currentPage = 0;
  itemsPerPage = 12;

  isFlipping = false;

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');

    if (albumId) {
      this.albumId = albumId
      this.loadAlbum(albumId);
    }
  }

  loadAlbum(albumId: string) {
    this.collectionService.findByAlbum(albumId).subscribe({
      next: (response) => {
        this.album = response.data.album;
        this.stickers = response.data.stickers;
        this.checkCompletedPages();

        this.progress = response.data.progress;
        this.totalStickers = response.data.totalStickers;
        this.ownedTotal = response.data.ownedTotal;
        this.missingTotal = response.data.missingTotal;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.stickers.length / this.itemsPerPage);
  }

  get currentStickers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.stickers.slice(start, start + this.itemsPerPage);
  }

  get leftPageStickers() {
    return this.currentStickers.slice(0, 6);
  }

  get rightPageStickers() {
    return this.currentStickers.slice(6, 12);
  }

  get pendingStickersTotal(): number {
    return this.stickers.filter((stickers) => stickers.canPlace).length;
  }

  nextPage() {
    if (this.isFlipping) return;

    if (this.currentPage === 0) {
      this.flipDirection = 'next';
      this.isFlipping = true;

      setTimeout(() => {
        this.currentPage = 1
      }, 650);

      setTimeout(() => {
        this.isFlipping = false;
        this.flipDirection = '';
      }, 1200);

      return;
    }

    if ( this.currentPage + 2 > this.totalPages) return;

    this.flipDirection = 'next';
    this.isFlipping = true;

    setTimeout(() => {
      this.currentPage += 2;
    }, 650)

    setTimeout(() => {
      this.isFlipping = false;
      this.flipDirection = '';
    }, 1200);
  }

  previousPage() {
  if (this.isFlipping) return;

  if (this.currentPage === 0) return;

  if (this.currentPage === 1) {
    this.flipDirection = 'previous';
    this.isFlipping = true;

    setTimeout(() => {
      this.currentPage = 0;
    }, 650);

    setTimeout(() => {
      this.isFlipping = false;
      this.flipDirection = '';
    }, 1200);

    return;
  }

  this.flipDirection = 'previous';
  this.isFlipping = true;

  setTimeout(() => {
    this.currentPage -= 2;

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }, 650);

  setTimeout(() => {
    this.isFlipping = false;
    this.flipDirection = '';
  }, 1200);
}

  trackBySticker(index: number, sticker: any) {
    return sticker.id;
  }

  placeSticker(stickerId: string) {
    this.placingStickerId = stickerId;

    setTimeout(() => {
      this.collectionService.placeSticker(this.albumId, stickerId).subscribe({
        next: () => {
          this.playStickerSound();

          this.alertService.success(
            'Figurinha colada!',
            'A figurinha foi adicionada ao álbum.',
          );

          this.placingStickerId = '';
          this.lastPlacedStickerId = stickerId
          this.loadAlbum(this.albumId);
          setTimeout(() => {
            this.collectionService.refreshPendingCount()
          }, 300);

          setTimeout(() => {
            this.lastPlacedStickerId = '';
          }, 1800);
        },

        error: (error) => {
          this.placingStickerId = '';

          this.alertService.error(
            'Erro ao colar figurinha',
            error?.error?.message || 'Não foi possível colar essa figurinha.',
          );
        },
      });
    }, 700);
  }

  playStickerSound() {
    const audio = new Audio();

    audio.src = 'assets/sounds/sticker-place.wav';
    audio.volume = 1;
    audio.currentTime = 0;

    audio.play().catch((error) => {
      console.log('Erro ao tocar som:', error);
    });
  }

  checkCompletedPages() {
   this.completedPages = [];

   const totalPages = Math.ceil(
    this.stickers.length / this.itemsPerPage,
   );

   for ( let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * this.itemsPerPage;

    const pageStickers = this.stickers.slice(
      start,
      start + this.itemsPerPage,
    );

    const completed = pageStickers.every(
      (sticker) => sticker.isPlaced,
    );

    if( completed) {
      this.completedPages.push(page);
    }
   }
  }

  openStickerZoom(sticker: any) {
    this.selectedSticker = sticker;

    document.body.style.overflow = 'hidden';
  }

  closeStickerZoom() {
    this.selectedSticker = null;

    document.body.style.overflow = 'auto';
  }
}
