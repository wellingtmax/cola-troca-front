import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Album } from '../../interfaces/album.interface';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-card.html',
  styleUrl: './album-card.css',
})
export class AlbumCard {
  @Input({ required: true })
  album!: Album;

  @Input()
  showBuyButton = false;

  @Output()
  buyAlbum = new EventEmitter<string>();

  onBuyAlbum() {
    this.buyAlbum.emit(this.album.id);
  }
}
