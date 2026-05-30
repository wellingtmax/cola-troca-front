import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { CollectionService } from '../../core/services/collection';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { NotificationService } from '../../core/services/notification';
import { AppNotification } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  @Output() closeSidebar = new EventEmitter<void>();

  pendingAlbumsCount = 0;

  notifications: AppNotification[] = [];
  unreadNotifications = 0;
  showNotifications = false;

  dashboard: any = {};

  get visibleNotifications() {
    return this.notifications.filter((notification) => !notification.isRead);
  }

  public readonly themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);

  private readonly userService = inject(UserService);
  private notificationInterval?: ReturnType<typeof setInterval>;
  private presenceInterval?: ReturnType<typeof setInterval>;
  private pendingRefreshSubscription?: Subscription;

  ngOnInit(): void {
    this.loadPendingAlbumsCount();

    this.loadDashboard();
    this.updatePresence();

    this.loadNotifications();

    this.notificationInterval = setInterval(() => {
      this.loadNotifications();
    }, 60000);

    this.presenceInterval = setInterval(() => {
      this.updatePresence();
    }, 60000);

    this.pendingRefreshSubscription =
      this.collectionService.pendingRefresh$.subscribe(() => {
        this.loadPendingAlbumsCount();
      });
  }

  ngOnDestroy(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }

    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
    }

    this.pendingRefreshSubscription?.unsubscribe();
  }

  loadDashboard() {
    this.userService.dashboard().subscribe({
      next: (response: any) => {
        this.dashboard = response.data;
      },
    });
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
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  updatePresence() {
    this.userService.updatePresence().subscribe({
      next: () => {},
      error: () => {},
    });
  }

  loadNotifications() {
    this.notificationService.findMine().subscribe({
      next: (response) => {
        this.notifications = response.data || [];

        this.unreadNotifications =
          this.notifications.filter((item) => !item.isRead).length;
      },
      error: () => {
        this.notifications = [];
        this.unreadNotifications = 0;
      },
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openNotification(notification: AppNotification) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;

        this.notifications = this.notifications.filter(
          (item) => item.id !== notification.id,
        );

        this.unreadNotifications =
          this.notifications.filter((item) => !item.isRead).length;

        this.showNotifications = false;

        if (notification.linkUrl) {
          this.router.navigateByUrl(notification.linkUrl);
        }
      },

      error: () => {
        this.alertNotificationError();
      },
    });
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = [];
        this.unreadNotifications = 0;
        this.showNotifications = false;
      },
      error: () => {
        this.alertNotificationError();
      },
    });
  }

  getNotificationIcon(type: string) {
    const icons: Record<string, string> = {
      FRIEND_REQUEST: 'person_add',
      CHAT_REPLY: 'reply',
      CHAT_MENTION: 'alternate_email',
      TRADE_RECEIVED: 'swap_horiz',
      TRADE_ACCEPTED: 'check_circle',
      TRADE_REJECTED: 'cancel',
      SYSTEM: 'notifications',
    };

    return icons[type] || 'notifications';
  }

  alertNotificationError() {
    console.error('Erro ao atualizar notificação.');
  }

  closeSidebarOnClick() {
    this.closeSidebar.emit();
  }
}
