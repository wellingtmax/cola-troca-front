import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumService } from '../../core/services/album';
import { AlertService } from '../../core/services/alert';

import { Album } from '../../interfaces/album.interface';

import { AlbumCard } from '../../shared/album-card/album-card';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    AlbumCard,
  ],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store implements OnInit {

  private readonly albumService = inject(AlbumService);

  private readonly alertService = inject(AlertService);

  albums: Album[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums() {

    this.albumService.findAll().subscribe({

      next: (response) => {

        this.albums = response.data;

        this.loading = false;

        this.alertService.success(
          'Álbuns carregados!',
          `${this.albums.length} álbum(ns) encontrado(s).`,
        );

        console.log(this.albums);
      },

      error: (error) => {

        console.error(error);

        this.loading = false;

        this.alertService.error(
          'Erro ao carregar álbuns',
          'Verifique se o back-end está rodando.',
        );
      },
    });
  }
}
