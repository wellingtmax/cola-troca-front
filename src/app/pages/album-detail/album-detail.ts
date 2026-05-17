import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { AlbumService } from '../../core/services/album';

@Component({
  selector: 'app-album-detail',
  imports: [CommonModule],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.css',
})
export class AlbumDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly albumService = inject(AlbumService);

  albumData : any
  loading = true;

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');

    if (albumId) {
      this.loadAlbum(albumId);
    }
  }

  loadAlbum(albumId: string) {
    this.albumService.findAlbumProgress(albumId).subscribe({
      next: (response) => {
        this.albumData = response.data;
        this.loading = false;

        console.log(this.albumData);
      },
      error: (error) => {
        console.error(error);
        this.loading =false
      },
    });
  }
}
