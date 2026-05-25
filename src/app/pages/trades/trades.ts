import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import { TradeService } from '../../core/services/trade';
import { StickerService } from '../../core/services/sticker';
import { AlertService } from '../../core/services/alert';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './trades.html',
  styleUrl: './trades.css',
})
export class Trades implements OnInit {
  private readonly tradeService = inject(TradeService);
  private readonly stickerService = inject(StickerService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  tradeCode = '';
  receiver: any = null;

  myStickers: any[] = [];
  myTrades: any[] = [];

  offeredStickerIds: string[] = [];
  requestedStickerIds: string[] = [];

  selectedTrade: any = null;
  counterStickerIds: string[] = [];

  currentUser: any;

  loading = true;

  selectedAlbum = '';
  selectedRarity = '';
  selectedLimit = 5;

  modalSelectedAlbum = '';
  modalSelectedRarity = '';
  modalSelectedLimit = 5;

  rarities = [
    'COMMON',
    'RARE',
    'EPIC',
    'LEGENDARY',
  ];

  limits = [
    5,
    10,
    20,
    30,
  ];

  activeTab:
    | 'active'
    | 'sent'
    | 'history'
    = 'active'

  ngOnInit(): void {
    this.loadData();
    this.currentUser = this.authService.getUser();

    this.route.queryParams.subscribe((params) => {
      const tradeCode = params['tradeCode'];

      if (tradeCode) {
        this.tradeCode = tradeCode;

        setTimeout(() => {
          this.searchCollector();
        }, 300);
      }
    });
  }

  loadData() {
    this.loading = true;

    this.stickerService.findMyStickers().subscribe({
      next: (response) => {
        this.myStickers = response.data.filter(
          (sticker: any) =>
            sticker.quantityDuplicate > 0 &&
            !sticker.isPlaced,
        );

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Erro ao carregar figurinhas.');
      },
    });

    this.tradeService.myTrades().subscribe({
      next: (response) => {
        this.myTrades = response.data;
      },
    });
  }

  searchCollector() {
    if (!this.tradeCode.trim()) {
      this.alertService.warning('Digite o ID de troca.');
      return;
    }

    this.tradeService.findUserByTradeCode(this.tradeCode.trim()).subscribe({
      next: (response) => {
        this.receiver = response.data;
        this.alertService.success('Colecionador encontrado.');
      },
      error: () => {
        this.receiver = null;
        this.alertService.error('Colecionador não encontrado.');
      },
    });
  }

  toggleOfferedSticker(stickerId: string) {
    if (this.offeredStickerIds.includes(stickerId)) {
      this.offeredStickerIds = this.offeredStickerIds.filter(
        (id) => id !== stickerId,
      );
      return;
    }

    this.offeredStickerIds.push(stickerId);
  }

  createTrade() {
    if (!this.receiver) {
      this.alertService.warning('Busque um colecionador primeiro.');
      return;
    }

    if (this.offeredStickerIds.length === 0) {
      this.alertService.warning('Selecione pelo menos uma figurinha para oferecer.');
      return;
    }

    this.tradeService.createTrade({
      receiverTradeCode: this.receiver.tradeCode,
      offeredStickerIds: this.offeredStickerIds,
      requestedStickerIds: [],
    }).subscribe({
      next: () => {
        this.alertService.success('Proposta de troca enviada!');
        this.offeredStickerIds = [];
        this.receiver = null;
        this.tradeCode = '';
        this.loadData();
      },
      error: () => {
        this.alertService.error('Erro ao criar troca.');
      },
    });
  }

  openTradeDetails(trade: any) {
    this.selectedTrade = trade;
    this.counterStickerIds = [];

    this.modalSelectedAlbum = '';
    this.modalSelectedRarity = '';
    this.modalSelectedLimit = 10;
  }

  closeTradeDetails() {
    this.selectedTrade = null;
    this.counterStickerIds = [];
  }

  toggleCounterSticker(stickerId: string) {
    if (this.counterStickerIds.includes(stickerId)) {
      this.counterStickerIds = this.counterStickerIds.filter(
        (id) => id !== stickerId,
      );
      return;
    }

    this.counterStickerIds.push(stickerId);
  }

  sendCounterTrade() {
    if (!this.selectedTrade) return;

    if (this.counterStickerIds.length === 0) {
      this.alertService.warning('Selecione pelo menos uma figurinha.');
      return;
    }

    this.tradeService.counterTrade(this.selectedTrade.id, {
      counterStickerIds: this.counterStickerIds,
    }).subscribe({
      next: () => {
        this.alertService.success('Contraproposta enviada!');
        this.closeTradeDetails();
        this.loadData();
      },
      error: () => {
        this.alertService.error('Erro ao enviar contraproposta.');
      },
    });
  }

  acceptTrade(trade: any) {
    this.tradeService.acceptTrade(trade.id).subscribe({
      next: () => {
        this.alertService.success('Troca concluída!');
        this.closeTradeDetails();
        this.loadData();
      },
      error: () => {
        this.alertService.error('Erro ao aceitar troca.');
      },
    });
  }

  rejectTrade(trade: any) {
    this.tradeService.rejectTrade(trade.id).subscribe({
      next: () => {
        this.alertService.success('Troca rejeitada.');
        this.closeTradeDetails();
        this.loadData();
      },
      error: () => {
        this.alertService.error('Erro ao rejeitar troca.');
      },
    });
  }

  cancelTrade(trade: any) {
    this.tradeService.cancelTrade(trade.id).subscribe({
      next: () => {
        this.alertService.success('Troca cancelada.');
        this.closeTradeDetails();
        this.loadData();
      },
      error: () => {
        this.alertService.error('Erro ao cancelar troca.');
      },
    });
  }

  // selects
  get albums() {
    return [
      ...new Set(
        this.myStickers.map((sticker: any) => sticker.albumName),
      ),
    ];
  }

  get filteredTradeStickers() {
    return this.myStickers
      .filter((sticker: any) => {
        const matchesAlbum =
          !this.selectedAlbum ||
          sticker.albumName === this.selectedAlbum;

        const matchesRarity =
          !this.selectedRarity ||
          sticker.rarity === this.selectedRarity;

        return matchesAlbum && matchesRarity;
      })
      .slice(0, this.selectedLimit);
  }

  get modalFilteredTradeStickers() {
    return this.myStickers
      .filter((sticker: any) => {
        const matchesAlbum =
          !this.modalSelectedAlbum ||
          sticker.albumName === this.modalSelectedAlbum;

        const matchesRarity =
          !this.modalSelectedRarity ||
          sticker.rarity === this.modalSelectedRarity;

        return matchesAlbum && matchesRarity;
      })
      .slice(0, this.modalSelectedLimit);
  }

  get activeTrades() {
    return this.myTrades.filter((trade: any) =>
      (
        trade.status === 'PENDING' ||
        trade.status === 'COUNTERED'
      ) && (
        trade.receiver?.id === this.currentUser?.id
      )
    );
  }

  get sentTrades() {
    return this.myTrades.filter((trade: any) =>
      (
        trade.status === 'PENDING' ||
        trade.status === 'COUNTERED'
      ) && (
        trade.sender?.id === this.currentUser?.id
      )
    );
  }

  get historyTrades() {
    return this.myTrades.filter((trade: any) =>
      trade.status === 'ACCEPTED' ||
      trade.status === 'REJECTED' ||
      trade.status === 'CANCELED'
    );
  }

  getTradeStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Aguardando resposta',
    COUNTERED: 'Contraproposta recebida',
    ACCEPTED: 'Troca aceita',
    REJECTED: 'Troca recusada',
    CANCELED: 'Troca cancelada',
  };

  return labels[status] || status;
}
}
