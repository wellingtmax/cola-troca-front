import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreService } from '../../core/services/store';

import { Album } from '../../interfaces/album.interface';

import { AlbumCard } from '../../shared/album-card/album-card';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    AlbumCard,
  ],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library implements OnInit {

  private readonly storeService = inject(StoreService);

  albums: Album[] = [];

  loading = true;

  ngOnInit(): void {

    this.loadLibrary();
  }

  loadLibrary() {

    this.storeService.myAlbums().subscribe({

      next: (response) => {

        this.albums = response.data;

        this.loading = false;
      },

      error: () => {

        this.loading = false;
      },
    });
  }
}
