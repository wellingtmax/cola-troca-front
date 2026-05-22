import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { StoreService } from '../../core/services/store';

import { Album } from '../../interfaces/album.interface';

import { AlbumCard } from '../../shared/album-card/album-card';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    AlbumCard,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library implements OnInit {
  private readonly storeService = inject(StoreService);

  albums: Album[] = [];

  loading = true;
  // =======================busca
  searchTerm = '';
  selectedCompany = '';
  selectedCategory = '';

  companies: string[] = [];
  categories: string[] = [];
  // ==================================

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary() {
    this.storeService.myAlbums().subscribe({
      next: (response) => {
        console.log('Álbuns da BIBLIOTECAS', response.data);
        
        this.albums = response.data.map((album: any) => ({
          ...album,

          pendingCount:
            album.stickers?.filter(
              (sticker: any) => sticker.canPlace,
            ).length || 0,
        }));

        this.companies = [
          ...new Set(this.albums.map((album: any) => album.company).filter(Boolean)),
        ];

        this.categories = [
          ...new Set(this.albums.map((album: any) => album.category).filter(Boolean)),
        ];

        this.loading = false;
      },

      error: () => {
        this.loading = false;
      },
    });
  }
  // =================================buscar
  get filteredAlbums() {
    return this.albums.filter((album: any) => {
      const search = this.searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        album.themeName?.toLowerCase().includes(search) ||
        album.company?.toLowerCase().includes(search) ||
        album.category?.toLowerCase().includes(search) ||
        album.collection?.toLowerCase().includes(search);

      const matchesCompany =
        !this.selectedCompany || album.company === this.selectedCompany;

      const matchesCategory =
        !this.selectedCategory || album.category === this.selectedCategory;

      return matchesSearch && matchesCompany && matchesCategory;
    });
  }
  // ===================================
}
