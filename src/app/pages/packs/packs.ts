import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PackService } from '../../core/services/pack';
import { AlertService } from '../../core/services/alert';
import { AlbumService } from '../../core/services/album';
import { AuthService } from '../../core/services/auth';
import { Pack } from '../../interfaces/pack.interface';

import { Album } from '../../interfaces/album.interface';

import {
  DrawnSticker,
  PackType,
} from '../../interfaces/pack.interface';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './packs.html',
  styleUrl: './packs.css',
})
export class Packs {
  private readonly packService = inject(PackService);
  private readonly alertService = inject(AlertService);
  private readonly albumService = inject(AlbumService);
  private readonly authService = inject(AuthService);

  albums: Album[] = [];
  selectedAlbumId = '';

  loading = false;
  packs: Pack[] = [];

  selectedPackImage = 'assets/packs/pack-gratis.png';

  drawnStickers: DrawnSticker[] = [];
  revealedStickers: DrawnSticker[] = [];

  constructor() {
    this.loadAlbums();
    this.loadPacks()
  }

  loadPacks() {
    this.packService.findAll().subscribe({
      next: (response) => {
        this.packs = response.data;
      },
      error: () => {
        this.alertService.error('Erro ao carregar packs.');
      },
    });
  }

  loadAlbums() {
    this.albumService.findAll().subscribe({
      next: (response) => {
        this.albums = response.data;
      },

      error: () => {
        this.alertService.error(
          'Erro ao carregar álbuns',
          'Verifique se o back-end está rodando.',
        );
      },
    });
  }

  setSelectedPackImage(packType: PackType) {
    const packImages: Record<PackType, string> = {
      FREE: 'assets/packs/pack-gratis.png',
      SMALL: 'assets/packs/pack-pequeno.png',
      MEDIUM: 'assets/packs/pack-premium.png',
      LARGE: 'assets/packs/pack-elite.png',
    };

    this.selectedPackImage = packImages[packType];
  }

  openPack(packType: PackType) {
    if (!this.selectedAlbumId) {
      this.alertService.warning(
        'Selecione um álbum',
        'Escolha para qual álbum deseja abrir o pack.',
      );

      return;
    }

    this.setSelectedPackImage(packType);

    this.loading = true;
    this.drawnStickers = [];
    this.revealedStickers = [];

    this.packService.openPack({
      albumId: this.selectedAlbumId,
      packType,
    }).subscribe({
      next: (response) => {
        this.drawnStickers = response.data.stickers;

        setTimeout(() => {
          this.loading = false;

          this.revealCards();

          this.authService.profile().subscribe();

          this.alertService.success(
            'Pacote aberto!',
            `${response.data.total} figurinha(s) recebida(s).`,
          );
        }, 2500);
      },

      error: (error) => {
        this.loading = false;

        this.alertService.error(
          'Erro ao abrir pacote',
          error?.error?.message || 'Erro interno do servidor.',
        );
      },
    });
  }

  openFreePack() {
    if (!this.selectedAlbumId) {
      this.alertService.warning(
        'Selecione um álbum',
        'Escolha um álbum antes de abrir o pack.',
      );

      return;
    }

    this.selectedPackImage = 'assets/packs/pack-gratis.png';

    this.loading = true;
    this.drawnStickers = [];
    this.revealedStickers = [];

    this.packService.openFreePack(
      this.selectedAlbumId,
    ).subscribe({
      next: (response) => {
        this.drawnStickers = response.data.stickers;

        setTimeout(() => {
          this.loading = false;

          this.revealCards();

          this.authService.profile().subscribe();

          this.alertService.success(
            'Pack diário aberto!',
            `${response.data.total} figurinha(s) recebida(s).`,
          );
        }, 2500);
      },

      error: (error) => {
        this.loading = false;

        this.alertService.error(
          'Pack diário indisponível',
          error?.error?.message || 'Você já abriu seu pack grátis hoje.',
        );
      },
    });
  }

  revealCards() {
    this.drawnStickers.forEach((sticker, index) => {
      setTimeout(() => {
        this.revealedStickers.push(sticker);
      }, index * 400);
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;

    img.src = 'https://placehold.co/512x768/18181b/ffffff?text=Sem+Imagem';
  }

  get freePack() {
    return this.packs.find(
      (pack: any) => pack.type === 'FREE',
    );
  }

  get paidPacks() {
    return this.packs.filter(
      (pack: any) => pack.type !== 'FREE',
    );
  }

  getPackImage(packType: PackType): string {
  const images: Record<PackType, string> = {
    FREE: 'assets/packs/pack-gratis.png',
    SMALL: 'assets/packs/pack-pequeno.png',
    MEDIUM: 'assets/packs/pack-premium.png',
    LARGE: 'assets/packs/pack-elite.png',
  };

  return images[packType];
}

getPackDescription(packType: PackType): string {
  const descriptions: Record<PackType, string> = {
    FREE: 'Pack diário gratuito. Receba figurinhas comuns uma vez por dia.',
    SMALL: 'Ideal para iniciantes. Traz comuns, raras e pequena chance de épica.',
    MEDIUM: 'Chance elevada de cartas raras, épicas e pequena chance de lendária.',
    LARGE: 'Pack elite com garantia de pelo menos uma figurinha lendária.',
  };

  return descriptions[packType];
}

getPackButtonLabel(packType: PackType): string {
  if (packType === 'FREE') {
    return 'Abrir Grátis';
  }

  return 'Comprar Pack';
}

getPackRarityClass(packType: PackType): string {
  const classes: Record<PackType, string> = {
    FREE: 'rarity-common',
    SMALL: 'rarity-common',
    MEDIUM: 'rarity-rare',
    LARGE: 'rarity-legendary',
  };

  return classes[packType];
}

getPackTitleClass(packType: PackType): string {
  const classes: Record<PackType, string> = {
    FREE: 'text-white',
    SMALL: 'text-emerald-400',
    MEDIUM: 'text-blue-400',
    LARGE: 'text-yellow-400',
  };

  return classes[packType];
}

getPackPriceClass(packType: PackType): string {
  const classes: Record<PackType, string> = {
    FREE: 'price-small',
    SMALL: 'price-small',
    MEDIUM: 'price-premium',
    LARGE: 'price-elite',
  };

  return classes[packType];
}

getPackButtonClass(packType: PackType): string {
  const classes: Record<PackType, string> = {
    FREE: 'bg-white text-emerald-700 hover:bg-zinc-200',
    SMALL: 'bg-emerald-500 hover:bg-emerald-600',
    MEDIUM: 'bg-blue-500 hover:bg-blue-600 text-white',
    LARGE: 'bg-yellow-500 hover:bg-yellow-600 text-black',
  };

  return classes[packType];
}

}
