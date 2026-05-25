import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { CollectionService } from '../../core/services/collection';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { NotificationService } from '../../core/services/notification';
import { AppNotification } from '../../interfaces/notification.interface';

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

  notifications: AppNotification[] = [];
  unreadNotifications = 0;
  showNotifications = false;

  dashboard: any = {}

  public readonly themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);

  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.loadPendingAlbumsCount();

    this.loadDashboard();
    this.updatePresence();

    this.loadNotifications();

    setInterval(() => {
      this.loadNotifications();
    }, 60000);

    setInterval(() => {
      this.updatePresence();
    }, 60000);

    this.collectionService.pendingRefresh$.subscribe(() => {
      this.loadPendingAlbumsCount();
    })
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
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  updatePresence() {
    this.userService.updatePresence().subscribe({
      next: () => { },
      error: () => { },
    });
  }

  loadNotifications() {
    this.notificationService.findMine().subscribe({
      next: (response) => {
        this.notifications = response.data;

        this.unreadNotifications =
          response.data.filter((item) => !item.isRead).length;
      },
      error: () => { },
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openNotification(notification: AppNotification) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;

        this.unreadNotifications = Math.max(
          0,
          this.unreadNotifications - 1,
        );

        if (notification.linkUrl) {
          this.router.navigateByUrl(notification.linkUrl);
        }

        this.showNotifications = false;
      },
      error: () => { },
    });
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map((item) => ({
          ...item,
          isRead: true,
        }));

        this.unreadNotifications = 0;
      },
      error: () => { },
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
}
