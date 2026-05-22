import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { AlbumService } from '../../core/services/album';
import { AlertService } from '../../core/services/alert';
import { StoreService } from '../../core/services/store';

import { Album } from '../../interfaces/album.interface';

import { AlbumCard } from '../../shared/album-card/album-card';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    AlbumCard,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store implements OnInit {

  private readonly albumService = inject(AlbumService);
  private readonly alertService = inject(AlertService);
  private readonly storeService = inject(StoreService);
// =======================BUSCAR
  searchTerm = '';
  selectedCompany = '';
  selectedCategory = '';

  companies: string[] = [];
  categories: string[] = [];
// ==============================
  albums: Album[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums() {

    this.albumService.findAll().subscribe({

      next: (response) => {

        this.albums = response.data;
        // ================buscar=============
        this.companies = [
          ...new Set(this.albums.map((album: any) => album.company).filter(Boolean))
        ];
        this.categories = [
          ...new Set(this.albums.map((album: any) => album.category).filter(Boolean))
        ];
        // ===========================================
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

  buyAlbum(albumId: string) {
    this.storeService.buyAlbum(albumId).subscribe({
      next: (response) => {
        this.alertService.success(
          'Álbum comprado!',
          response.message,
        );
      },
      error: (error) => {
        this.alertService.error(
          'Erro ao comprar álbum',
          error?.error?.message || 'Não foi possível comprar o álbum.',
        );
      },
    });
  }
  // =============================buscar===========
  get filteredAlbums() {
    return this.albums.filter((album: any) => {
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
      !search ||
      album.themeName?.toLowerCase().includes(search) ||
      album.company?.toLowerCase().includes(search) ||
      album.category?.toLowerCase().includes(search) ||
      album.collection?.toLowerCase().includes(search);

      const matchesCompany =
      !this.selectedCategory || album.company === this.selectedCompany;

      const matchesCategory =
      !this.selectedCategory || album.category === this.selectedCategory;

      return matchesSearch && matchesCompany && matchesCategory;
    });
  }
}
