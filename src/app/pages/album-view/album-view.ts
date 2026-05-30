import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageFlip } from 'page-flip';

import { CollectionService } from '../../core/services/collection';
import { AlertService } from '../../core/services/alert';
import { UserLevelService } from '../../core/services/user-level';
import { AlbumConfirmModalComponent } from './album-confirm-modal/album-confirm-modal';
import { AlbumStickerZoomComponent } from './album-sticker-zoom/album-sticker-zoom';

interface AlbumPage {
  pageNumber: number;
  stickers: any[];
}

@Component({
  selector: 'app-album-view',
  standalone: true,
  imports: [CommonModule, RouterLink, AlbumConfirmModalComponent, AlbumStickerZoomComponent],
  templateUrl: './album-view.html',
  styleUrl: './album-view.css',
})
export class AlbumView implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly collectionService = inject(CollectionService);
  private readonly alertService = inject(AlertService);
  private readonly userLevelService = inject(UserLevelService);
  private readonly zone = inject(NgZone);

  @ViewChild('albumFlipBook')
  albumFlipBook?: ElementRef<HTMLElement>;

  loading = true;

  album: any = null;
  albumId = '';

  stickers: any[] = [];
  albumPages: AlbumPage[] = [];

  progress = 0;
  totalStickers = 0;
  ownedTotal = 0;
  missingTotal = 0;

  placingStickerId = '';
  lastPlacedStickerId = '';

  completedPages: number[] = [];

  selectedSticker: any = null;

  showPlaceAllAlbumModal = false;
  placingAllStickers = false;
  lastXpTitle = '';
  lastXpMessage = '';
  showXpToast = false;
  xpToastTimer: any = null;

  pageFlip: PageFlip | null = null;

  currentFlipPageIndex = 0;
  totalFlipPages = 0;

  stickersPerPage = 6;

  albumZoom = 1;
  minAlbumZoom = 0.75;
  maxAlbumZoom = 1.2;

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');

    if (!albumId) {
      this.loading = false;

      this.alertService.error(
        'Álbum não encontrado.',
        'Não foi possível identificar o álbum selecionado.',
      );

      return;
    }

    this.albumId = albumId;
    this.loadAlbum(albumId);
  }

  ngAfterViewInit(): void {
    // O PageFlip será inicializado depois que o álbum carregar.
  }

  ngOnDestroy(): void {
    this.destroyPageFlip();
    document.body.style.overflow = 'auto';
  }

  loadAlbum(albumId: string, keepPageIndex = this.currentFlipPageIndex) {
    this.loading = true;

    this.collectionService.findByAlbum(albumId).subscribe({
      next: (response) => {
        this.album = response.data.album;
        this.stickers = response.data.stickers || [];

        this.progress = response.data.progress || 0;
        this.totalStickers = response.data.totalStickers || 0;
        this.ownedTotal = response.data.ownedTotal || 0;
        this.missingTotal = response.data.missingTotal || 0;

        this.buildAlbumPages();
        this.checkCompletedPages();

        this.loading = false;

        setTimeout(() => {
          this.initializePageFlip(keepPageIndex);
        }, 100);
      },

      error: () => {
        this.loading = false;

        this.alertService.error(
          'Erro ao carregar álbum.',
          'Não foi possível carregar os dados do álbum.',
        );
      },
    });
  }

  buildAlbumPages() {
    this.albumPages = [];

    for (let index = 0; index < this.stickers.length; index += this.stickersPerPage) {
      this.albumPages.push({
        pageNumber: this.albumPages.length + 1,
        stickers: this.stickers.slice(index, index + this.stickersPerPage),
      });
    }
  }

  initializePageFlip(startPageIndex = 0) {
    if (!this.albumFlipBook?.nativeElement) {
      return;
    }

    const element = this.albumFlipBook.nativeElement;

    const pages = Array.from(element.children).filter((child) =>
      child.classList.contains('flip-page'),
    ) as HTMLElement[];

    if (!pages.length) {
      return;
    }

    this.destroyPageFlip();

    this.pageFlip = new PageFlip(element, {
      width: 500,
      height: 730,

      size: 'fixed',
      autoSize: false,

      minWidth: 360,
      maxWidth: 500,

      minHeight: 520,
      maxHeight: 730,

      showCover: true,
      usePortrait: false,

      drawShadow: true,
      maxShadowOpacity: 0.55,

      flippingTime: 1700,

      mobileScrollSupport: true,
      clickEventForward: true,
      swipeDistance: 45,

      startPage: 0,
    });

    this.pageFlip.loadFromHTML(pages);

    this.totalFlipPages = pages.length;

    this.pageFlip.on('flip', (event: any) => {
      this.zone.run(() => {
        this.currentFlipPageIndex = event.data;
      });
    });

    const safePageIndex = Math.min(Math.max(0, startPageIndex), this.totalFlipPages - 1);

    setTimeout(() => {
      if (this.pageFlip && safePageIndex > 0) {
        this.pageFlip.turnToPage(safePageIndex);
        this.currentFlipPageIndex = safePageIndex;
      }
    }, 150);
  }

  destroyPageFlip() {
    if (!this.pageFlip) {
      return;
    }

    try {
      this.pageFlip.destroy();
    } catch (error) {
      console.error('Erro ao destruir PageFlip:', error);
    }

    this.pageFlip = null;
  }

  nextPage() {
    if (!this.canGoNext) {
      return;
    }

    this.pageFlip?.flipNext();
  }

  previousPage() {
    if (!this.canGoPrevious) {
      return;
    }

    this.pageFlip?.flipPrev();
  }

  get canGoPrevious(): boolean {
    return this.totalFlipPages > 0 && this.currentFlipPageIndex > 0;
  }

  get canGoNext(): boolean {
    return this.totalFlipPages > 0 && this.currentFlipPageIndex < this.totalFlipPages - 1;
  }

  get totalPages(): number {
    return this.albumPages.length;
  }

  get pendingStickersTotal(): number {
    return this.stickers.filter((sticker) => sticker.canPlace).length;
  }

  get albumTitle(): string {
    return this.album?.themeName || this.album?.name || 'Álbum Cola&Troca';
  }

  get albumCompletionLabel(): string {
    if (this.progress >= 100) {
      return 'Álbum completo';
    }

    if (this.progress >= 75) {
      return 'Quase completo';
    }

    if (this.progress >= 40) {
      return 'Coleção em evolução';
    }

    return 'Início da coleção';
  }

  get pageCounterLabel(): string {
    if (this.totalFlipPages === 0) {
      return 'Carregando páginas...';
    }

    if (this.currentFlipPageIndex === 0) {
      return 'Capa do Álbum';
    }

    if (this.currentFlipPageIndex === this.totalFlipPages - 1) {
      return 'Contracapa do Álbum';
    }

    return `Página ${this.currentFlipPageIndex} de ${this.albumPages.length}`;
  }

  trackBySticker(index: number, sticker: any) {
    return sticker.id;
  }

  trackByAlbumPage(index: number, page: AlbumPage) {
    return page.pageNumber;
  }

  private updateAlbumStatsLocally() {
    this.ownedTotal = this.stickers.filter((sticker) => sticker.isPlaced).length;
    this.missingTotal = Math.max(0, this.totalStickers - this.ownedTotal);
    this.progress =
      this.totalStickers === 0
        ? 0
        : Number(((this.ownedTotal / this.totalStickers) * 100).toFixed(2));
    this.checkCompletedPages();
  }
  private markStickerAsPlacedLocally(stickerId: string) {
    const sticker = this.stickers.find((item) => item.id === stickerId);
    if (!sticker) {
      return;
    }
    sticker.isPlaced = true;
    sticker.owned = true;
    sticker.canPlace = false;
    sticker.quantityOwned = Math.max(sticker.quantityOwned || 1, 1);
  }
  private markAllPendingStickersAsPlacedLocally() {
    this.stickers.forEach((sticker) => {
      if (sticker.canPlace && !sticker.isPlaced) {
        sticker.isPlaced = true;
        sticker.owned = true;
        sticker.canPlace = false;
        sticker.quantityOwned = Math.max(sticker.quantityOwned || 1, 1);
      }
    });
  }

  private showAlbumXpFeedback(title: string, data: any, fallbackMessage: string) {
    const xpEarned = data?.xpEarned || 0;
    const stickerXpEarned = data?.stickerXpEarned || 0;
    const albumCompletionReward = data?.albumCompletionReward || null;
    const albumCompletionRewards = data?.albumCompletionRewards || [];
    const albumBonusXp = albumCompletionRewards.reduce(
      (total: number, reward: any) => total + (reward.xpEarned || 0),
      0,
    );
    let message = fallbackMessage;
    if (albumCompletionReward) {
      message = `Figurinha: +${stickerXpEarned} XP |
      Álbum completo: +${albumCompletionReward.xpEarned} XP |
      Total: +${xpEarned} XP`;
    } else if (albumCompletionRewards.length > 0) {
      message = `Figurinhas: +${stickerXpEarned} XP |
      Bônus de álbum completo: +${albumBonusXp} XP |
      Total: +${xpEarned} XP`;
    } else if (xpEarned > 0) {
      message = `XP ganho: +${xpEarned}`;
    }
    this.alertService.success(title, message);
    this.lastXpTitle = title;
    this.lastXpMessage = message;
    this.showXpToast = true;
    if (this.xpToastTimer) {
      clearTimeout(this.xpToastTimer);
    }
    this.xpToastTimer = setTimeout(() => {
      this.showXpToast = false;
    }, 4200);
  }

  placeSticker(stickerId: string, event?: Event) {
    event?.stopPropagation();
    if (this.placingStickerId || this.placingAllStickers) {
      return;
    }
    this.placingStickerId = stickerId;
    setTimeout(() => {
      this.collectionService.placeSticker(this.albumId, stickerId).subscribe({
        next: (response) => {
          this.playStickerSound();
          this.markStickerAsPlacedLocally(stickerId);
          this.updateAlbumStatsLocally();
          this.placingStickerId = '';
          this.lastPlacedStickerId = stickerId;
          this.collectionService.refreshPendingCount();
          this.userLevelService.refreshLevel();
          this.showAlbumXpFeedback(
            response.data?.albumCompletionReward ? 'Álbum completo!' : 'Figurinha colada!',
            response.data,
            'A figurinha foi adicionada ao álbum.',
          );
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

  openPlaceAllAlbumModal() {
    if (this.pendingStickersTotal === 0) {
      this.alertService.warning(
        'Nenhuma figurinha pendente.',
        'Este álbum não possui figurinhas disponíveis para colar.',
      );
      return;
    }
    this.showPlaceAllAlbumModal = true;
  }
  closePlaceAllAlbumModal() {
    if (this.placingAllStickers) {
      return;
    }
    this.showPlaceAllAlbumModal = false;
  }
  confirmPlaceAllAlbumStickers() {
    if (this.placingAllStickers) {
      return;
    }
    this.placingAllStickers = true;
    this.collectionService.placeAllStickersFromAlbum(this.albumId).subscribe({
      next: (response) => {
        const data = response.data;
        this.playStickerSound();
        this.markAllPendingStickersAsPlacedLocally();
        this.updateAlbumStatsLocally();
        this.collectionService.refreshPendingCount();
        this.userLevelService.refreshLevel();
        this.showPlaceAllAlbumModal = false;
        this.placingAllStickers = false;
        const totalPlaced = data?.totalPlaced || 0;
        this.showAlbumXpFeedback(
          data?.albumCompletionRewards?.length > 0 ? 'Álbum completo!' : 'Figurinhas coladas!',
          data,
          `${totalPlaced} figurinha(s) colada(s) neste álbum.`,
        );
      },
      error: (error) => {
        this.placingAllStickers = false;
        this.alertService.error(
          'Erro ao colar figurinhas.',
          error?.error?.message ||
          'Não foi possível colar as figurinhas deste álbum.',
        );
      },
    });
  }

  playStickerSound() {
    const audio = new Audio();

    audio.src = 'assets/sounds/sticker-place.wav';
    audio.volume = 1;
    audio.currentTime = 0;

    audio.play().catch((error) => {
      console.error('Erro ao tocar som:', error);
    });
  }

  checkCompletedPages() {
    this.completedPages = [];

    this.albumPages.forEach((page) => {
      const completed =
        page.stickers.length > 0 && page.stickers.every((sticker) => sticker.isPlaced);

      if (completed) {
        this.completedPages.push(page.pageNumber);
      }
    });
  }

  isPageCompleted(page: number): boolean {
    return this.completedPages.includes(page);
  }

  openStickerZoom(sticker: any, event?: Event) {
    event?.stopPropagation();

    if (!sticker?.isPlaced) {
      return;
    }

    this.selectedSticker = sticker;
    document.body.style.overflow = 'hidden';
  }

  closeStickerZoom() {
    this.selectedSticker = null;
    document.body.style.overflow = 'auto';
  }

  getRarityLabel(rarity: string) {
    const labels: Record<string, string> = {
      COMMON: 'Comum',
      RARE: 'Rara',
      EPIC: 'Épica',
      LEGENDARY: 'Lendária',
    };

    return labels[rarity] || rarity;
  }
  // ========================final
  countPlacedByRarity(rarity: string): number {
    return this.stickers.filter((stticker) => stticker.isPlaced && stticker.rarity === rarity)
      .length;
  }

  get commonPlacedTotal(): number {
    return this.countPlacedByRarity('COMMON');
  }

  get rarePlacedTotal(): number {
    return this.countPlacedByRarity('RARE');
  }

  get epicPlacedTotal(): number {
    return this.countPlacedByRarity('EPIC');
  }

  get legendaryPlacedTotal(): number {
    return this.countPlacedByRarity('LEGENDARY');
  }
  // =================================
  getStickerRarityClass(sticker: any) {
    return {
      owned: sticker.isPlaced,
      empty: !sticker.isPlaced,
      rare: sticker.rarity === 'RARE' && sticker.isPlaced,
      epic: sticker.rarity === 'EPIC' && sticker.isPlaced,
      legendary: sticker.rarity === 'LEGENDARY' && sticker.isPlaced,
      'can-place': sticker.canPlace && !sticker.isPlaced,
      'just-placed': this.lastPlacedStickerId === sticker.id,
    };
  }

  getPageThemeLabel(page: AlbumPage) {
    return page.stickers?.[0]?.albumName || this.albumTitle;
  }

  setAlbumZomm(event: Event) {
    const input = event.target as HTMLInputElement;

    const value = Number(input.value);

    if (Number.isNaN(value)) {
      return;
    }

    this.albumZoom = Math.min(this.maxAlbumZoom, Math.max(this.minAlbumZoom, value));
  }

  resetAlbumZoom() {
    this.albumZoom = 1;
  }

  stopFlipEvent(event: Event) {
    event.stopPropagation();
  }
}
