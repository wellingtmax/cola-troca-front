import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { TradeService } from '../../core/services/trade';
import { StickerService } from '../../core/services/sticker';
import { AlertService } from '../../core/services/alert';

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

  tradeCode = '';
  receiver: any = null;

  myStickers: any[] = [];
  myTrades: any[] = [];

  offeredStickerIds: string[] = [];
  requestedStickerIds: string[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadData();
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
}
