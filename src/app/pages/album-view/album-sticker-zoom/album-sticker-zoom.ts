import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-album-sticker-zoom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-sticker-zoom.html',
  styleUrl: './album-sticker-zoom.css',
})
export class AlbumStickerZoomComponent {
  @Input() sticker: any = null;
  @Input() rarityLabel = '';

  @Output() close = new EventEmitter<void>();
}
