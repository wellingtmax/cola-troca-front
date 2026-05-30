import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth';
import { UserLevelService } from '../../core/services/user-level';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly userLevelService = inject(UserLevelService);
  private levelRefreshInterval?: ReturnType<typeof setInterval>;
  private levelRefreshSubscription?: Subscription;

  user = computed(() => this.authService.userSignal());

  levelUser: any = null;
  levelInfo: any = null;

  showMobileLevelCard = false;

  ngOnInit(): void {
    this.authService.profile().subscribe();

    this.loadUserLevel();

    this.levelRefreshSubscription =
      this.userLevelService.levelRefresh$.subscribe(() => {
        this.loadUserLevel();
      });

    this.levelRefreshInterval = setInterval(() => {
      this.loadUserLevel();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.levelRefreshInterval) {
      clearInterval(this.levelRefreshInterval);
    }

    this.levelRefreshSubscription?.unsubscribe();
  }

  loadUserLevel() {
    this.userLevelService.getMyLevel().subscribe({
      next: (response: any) => {
        this.levelUser = response.data.user;
        this.levelInfo = response.data.levelInfo;
      },
      error: () => {
        this.levelUser = null;
        this.levelInfo = null;
      },
    });
  }

  toggleMobileLevelCard() {
    if (!this.levelInfo) {
      return;
    }

    this.showMobileLevelCard = !this.showMobileLevelCard;
  }

  closeMobileLevelCard() {
    this.showMobileLevelCard = false;
  }

  getInitialLetter(): string {
    const user = this.user();

    if (!user?.name) {
      return 'U';
    }

    return user.name.charAt(0).toUpperCase();
  }
}
