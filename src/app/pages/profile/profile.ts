import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../core/services/user';
import { AlertService } from '../../core/services/alert';
import { AuthService } from '../../core/services/auth';
import { StickerService } from '../../core/services/sticker';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly stickerService = inject(StickerService);

  loading = true;
  activeTab: 'perfil' | 'endereco' | 'avatar' | 'destaques' | 'seguranca' = 'perfil';

  featuredSearchTerm = '';
  featuredSelectedAlbum = '';
  featuredSelectedRarity = '';
  featuredOnlySelected = false;

  featuredPage = 1;
  featuredPageSize = 40;

  featuredPageSizes = [
    20,
    40,
    60,
    100,
  ];

  rarities = [
    'COMMON',
    'RARE',
    'EPIC',
    'LEGENDARY',
  ];

  profile: any = {};
  dashboard: any = {};

  myStickers: any[] = [];
  featuredStickerIds: string[] = [];
  featuredStickers: any[] = [];

  avatars = [
    'assets/avatars/urubu.jfif',
    'assets/avatars/flamengo.png',
    'assets/avatars/trofeu.png',
    'assets/avatars/bola.jfif',
    'assets/avatars/guerreiro.jfif',
    'assets/avatars/coroa.jfif',
  ];

  ngOnInit(): void {
    this.loadProfile();
    this.loadMyStickers();
    this.loadFeaturedStickers();
  }

  loadProfile() {
    this.loading = true;

    this.userService.profile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Erro ao carregar perfil.');
      },
    });

    this.userService.dashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
      },
    });
  }

  updateProfile() {
    this.userService.updateProfile({
      name: this.profile.name,
      nickname: this.profile.nickname,
      phone: this.profile.phone,
      bio: this.profile.bio,
    }).subscribe({
      next: () => {
        this.authService.updateCurrentUser({
          name: this.profile.name,
          nickname: this.profile.nickname,
          phone: this.profile.phone,
        });

        this.alertService.success('Perfil atualizado com sucesso!');
        this.loadProfile();
      },
      error: () => {
        this.alertService.error('Erro ao atualizar perfil.');
      },
    });
  }

  updateAddress() {
    this.userService.updateAddress({
      zipCode: this.profile.zipCode,
      street: this.profile.street,
      number: this.profile.number,
      complement: this.profile.complement,
      district: this.profile.district,
      city: this.profile.city,
      state: this.profile.state,
      country: this.profile.country,
    }).subscribe({
      next: () => {
        this.alertService.success('Endereço atualizado com sucesso!');
        this.loadProfile();
      },
      error: () => {
        this.alertService.error('Erro ao atualizar endereço.');
      },
    });
  }

  selectAvatar(avatarUrl: string) {
    this.userService.updateAvatar(avatarUrl).subscribe({
      next: () => {
        this.profile.avatarUrl = avatarUrl;

        this.authService.updateCurrentUser({
          avatarUrl,
        });

        this.alertService.success('Avatar atualizado!');
      },
      error: () => {
        this.alertService.error('Erro ao atualizar avatar.');
      },
    });
  }

  generateTradeCode() {

    this.userService.generateTradeCode().subscribe({

      next: (response) => {

        this.profile.tradeCode = response.data;

        this.alertService.success(
          'ID de troca gerado!',
        );
      },

      error: () => {
        this.alertService.error(
          'Erro ao gerar ID.',
        );
      },
    });
  }

  copyTradeCode() {

    navigator.clipboard.writeText(
      this.profile.tradeCode,
    );

    this.alertService.success(
      'ID copiado!',
    );
  }

  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;

    img.src = 'assets/avatars/trofeu.png';
  }

  loadMyStickers() {
    this.stickerService.findMyStickers().subscribe({
      next: (response) => {
        this.myStickers = response.data;
      },
      error: () => {
        this.alertService.error(
          'Erro ao carregar suas figurinhas.',
        );
      },
    });
  }

  loadFeaturedStickers() {
    this.userService.findMyFeaturedStickers().subscribe({
      next: (response) => {
        this.featuredStickers = response.data;

        this.featuredStickerIds = response.data.map(
          (item: any) => item.userStickerId,
        );
      },
      error: () => {
        this.alertService.error(
          'Erro ao carregar figurinhas em destaque.',
        );
      },
    });
  }

  toggleFeaturedSticker(userStickerId: string) {
    const alreadySelected =
      this.featuredStickerIds.includes(userStickerId);

    if (alreadySelected) {
      this.featuredStickerIds =
        this.featuredStickerIds.filter(
          (id) => id !== userStickerId,
        );

      return;
    }

    if (this.featuredStickerIds.length >= 5) {
      this.alertService.warning(
        'Você pode escolher no máximo 5 figurinhas.',
      );

      return;
    }

    this.featuredStickerIds.push(userStickerId);
  }

  saveFeaturedStickers() {
    this.userService.updateFeaturedStickers(
      this.featuredStickerIds,
    ).subscribe({
      next: () => {
        this.alertService.success(
          'Figurinhas em destaque atualizadas!',
        );

        this.loadFeaturedStickers();
      },
      error: (error) => {
        this.alertService.error(
          error?.error?.message ||
          'Erro ao salvar destaques.',
        );
      },
    });
  }

  get featuredAlbums() {
    return [
      ...new Set(
        this.myStickers.map((sticker: any) => sticker.albumName),
      ),
    ];
  }

  get filteredFeaturedStickers() {
    const search = this.featuredSearchTerm
      .trim()
      .toLowerCase();

    return this.myStickers.filter((sticker: any) => {
      const matchesSearch =
        !search ||
        sticker.name?.toLowerCase().includes(search) ||
        sticker.number?.toString().includes(search) ||
        sticker.albumName?.toLowerCase().includes(search);

      const matchesAlbum =
        !this.featuredSelectedAlbum ||
        sticker.albumName === this.featuredSelectedAlbum;

      const matchesRarity =
        !this.featuredSelectedRarity ||
        sticker.rarity === this.featuredSelectedRarity;

      const matchesSelected =
        !this.featuredOnlySelected ||
        this.featuredStickerIds.includes(sticker.id);

      return (
        matchesSearch &&
        matchesAlbum &&
        matchesRarity &&
        matchesSelected
      );
    });
  }

  get paginatedFeaturedStickers() {
    const start =
      (this.featuredPage - 1) * this.featuredPageSize;

    const end = start + Number(this.featuredPageSize);

    return this.filteredFeaturedStickers.slice(start, end);
  }

  get featuredTotalPages() {
    return Math.max(
      1,
      Math.ceil(
        this.filteredFeaturedStickers.length /
        Number(this.featuredPageSize),
      ),
    );
  }

  resetFeaturedPage() {
    this.featuredPage = 1;
  }

  nextFeaturedPage() {
    if (this.featuredPage < this.featuredTotalPages) {
      this.featuredPage++;
    }
  }

  previousFeaturedPage() {
    if (this.featuredPage > 1) {
      this.featuredPage--;
    }
  }
}
