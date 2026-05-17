import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CollectionService } from '../../core/services/collection';

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

  loading = true;

  album: any = null;
  stickers: any[] = [];

  progress = 0;
  totalStickers = 0;
  ownedTotal = 0;
  missingTotal = 0;

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');

    if (albumId) {
      this.loadAlbum(albumId);
    }
  }

  loadAlbum(albumId: string) {
    this.collectionService.findByAlbum(albumId).subscribe({
      next: (response) => {
        this.album = response.data.album;
        this.stickers = response.data.stickers;

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

  trackBySticker(index: number, sticker: any) {
    return sticker.id;
  }
}
