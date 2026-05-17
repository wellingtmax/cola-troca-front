import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private readonly authService = inject(AuthService);

  user = computed(() => this.authService.userSignal());

  ngOnInit(): void {
    this.authService.profile().subscribe();
  }

  getInitialLetter(): string {
    const user = this.user();

    if (!user?.name) {
      return 'U';
    }

    return user.name.charAt(0).toUpperCase();
  }
}
