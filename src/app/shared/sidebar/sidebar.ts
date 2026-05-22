import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { CollectionService } from '../../core/services/collection';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  pendingAlbumsCount = 0;

  public readonly themeService = inject(ThemeService);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);

  ngOnInit(): void {
    this.loadPendingAlbumsCount();

    this.collectionService.pendingRefresh$.subscribe(() => {
      this.loadPendingAlbumsCount();
    })
  }

  loadPendingAlbumsCount() {
    this.collectionService.countPendingAlbums().subscribe({
      next: (response) => {
        this.pendingAlbumsCount = response.data;
      },
      error: () => {
        this.pendingAlbumsCount = 0;
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
